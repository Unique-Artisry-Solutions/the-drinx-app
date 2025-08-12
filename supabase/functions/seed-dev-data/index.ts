
/* eslint-disable */
// Supabase Edge Function: seed-dev-data
// Provides dev seeding utilities, now including Phase 2: realistic event data population.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Json = Record<string, any>;

function getSupabaseClient() {
  const url =
    Deno.env.get("SUPABASE_URL") ??
    "https://dvifibvzwunnpcsihpxq.supabase.co";
  // Prefer service role for RLS-protected reads; fall back to anon if not set
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey =
    Deno.env.get("SUPABASE_ANON_KEY") ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWZpYnZ6d3VubnBjc2locHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzM4MDcsImV4cCI6MjA1ODg0OTgwN30.8nsPh_YwHjoFDJ2_IMQY9tkM9NHVLmu6oFf5Tnwa2FA";

  const key = serviceKey || anonKey;
  const client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

async function jsonResponse(status: number, body: Json) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function createSeedRun(supabase: ReturnType<typeof getSupabaseClient>) {
  // Best-effort: dev_seed_registry may have different columns across environments.
  // We'll insert minimal fields and gracefully proceed if it fails.
  try {
    const { data, error } = await supabase
      .from("dev_seed_registry")
      .insert({ status: "running", started_at: new Date().toISOString() })
      .select("id")
      .maybeSingle();

    if (error) {
      console.log("[seed] createSeedRun warning:", error.message);
      return null;
    }
    return data?.id ?? null;
  } catch (e) {
    console.log("[seed] createSeedRun exception:", String(e));
    return null;
  }
}

async function finalizeSeedRun(
  supabase: ReturnType<typeof getSupabaseClient>,
  runId: string | null,
  status: "completed" | "failed",
  details?: Json
) {
  if (!runId) return;
  try {
    const patch: Json = { status };
    // Try to set completed_at if exists
    patch.completed_at = new Date().toISOString();
    if (details) patch.details = details;

    await supabase.from("dev_seed_registry").update(patch).eq("id", runId);
  } catch (e) {
    console.log("[seed] finalizeSeedRun warning:", String(e));
  }
}

async function autoDetectPromoterId(supabase: ReturnType<typeof getSupabaseClient>) {
  // Try user_type first
  const byType = await supabase
    .from("profiles")
    .select("id, user_type")
    .eq("user_type", "promoter")
    .limit(1)
    .maybeSingle();

  if (byType.data?.id) {
    console.log("[seed] promoter detected by user_type:", byType.data.id);
    return byType.data.id as string;
  }

  // Fallback by email if present
  const byEmail = await supabase
    .from("profiles")
    .select("id, email")
    .ilike("email", "promoter@%")
    .limit(1)
    .maybeSingle();

  if (byEmail.data?.id) {
    console.log("[seed] promoter detected by email:", byEmail.data.id);
    return byEmail.data.id as string;
  }

  console.log("[seed] promoter not detected");
  return null;
}

async function getEstablishmentIds(supabase: ReturnType<typeof getSupabaseClient>, limit = 6) {
  const { data, error } = await supabase
    .from("establishments")
    .select("id")
    .limit(limit);

  if (error) {
    console.log("[seed] establishments fetch warning:", error.message);
    return [] as string[];
  }
  const ids = (data ?? []).map((r: any) => r.id).filter(Boolean);
  console.log("[seed] establishments found:", ids.length);
  return ids;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === "GET") {
    return jsonResponse(200, { ok: true, message: "seed-dev-data is alive" });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const supabase = getSupabaseClient();

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // ignore, use defaults
  }

  const action = body?.action ?? "health";
  console.log("[seed-dev-data] action:", action);

  // Simple health
  if (action === "health") {
    return jsonResponse(200, { ok: true, action });
  }

  // Cleanup with optional seed_run_id (null -> all)
  if (action === "cleanup") {
    const seedRunId = body?.seed_run_id ?? null;
    console.log("[seed] cleanup requested for seed_run_id:", seedRunId);

    const { data, error } = await supabase.rpc("clear_dev_seed", {
      p_seed_run_id: seedRunId,
    });

    if (error) {
      console.error("[seed] cleanup error:", error);
      return jsonResponse(500, { ok: false, action, seed_run_id: seedRunId, error: error.message });
    }
    return jsonResponse(200, { ok: true, action, seed_run_id: seedRunId, result: data });
  }

  // Seed all: now includes Phase 2 Event data generation
  if (action === "seed_all") {
    const runId = (await createSeedRun(supabase)) as string | null;

    try {
      // Inputs
      const requestedPromoterId: string | null = body?.promoter_id ?? null;
      const promoterId = requestedPromoterId || (await autoDetectPromoterId(supabase));
      if (!promoterId) {
        throw new Error("Could not determine promoter_id; provide one in request body or create a promoter profile.");
      }

      const establishmentIds: string[] =
        Array.isArray(body?.establishment_ids) && body.establishment_ids.length > 0
          ? body.establishment_ids
          : await getEstablishmentIds(supabase, 8);

      // 1) Seed Events
      const { data: seededEventIds, error: seedEventsErr } = await supabase.rpc("seed_events", {
        p_promoter_id: promoterId,
        p_establishment_ids: establishmentIds.length > 0 ? establishmentIds : null,
        p_count: body?.event_count ?? 6,
        p_seed_run_id: runId,
      });

      if (seedEventsErr) throw seedEventsErr;
      const eventIds: string[] = Array.isArray(seededEventIds) ? seededEventIds : [];
      console.log("[seed] events created:", eventIds.length);

      // 2) Seed Ticket Types
      const { data: ticketTypeIds, error: seedTicketErr } = await supabase.rpc("seed_event_ticket_types", {
        p_event_ids: eventIds,
        p_min_per: 2,
        p_max_per: 3,
        p_seed_run_id: runId,
      });
      if (seedTicketErr) throw seedTicketErr;

      // 3) Seed Discount Codes
      const { data: discountCount, error: seedDiscErr } = await supabase.rpc("seed_event_discount_codes", {
        p_event_ids: eventIds,
        p_codes_per_event: 2,
        p_seed_run_id: runId,
      });
      if (seedDiscErr) throw seedDiscErr;

      // 4) Seed Notification Schedules
      const { data: notifCount, error: seedNotifErr } = await supabase.rpc("seed_event_notification_schedules", {
        p_event_ids: eventIds,
        p_seed_run_id: runId,
      });
      if (seedNotifErr) throw seedNotifErr;

      // 5) Seed Marketing Campaigns
      const { data: campaignCount, error: seedCampErr } = await supabase.rpc("seed_event_marketing_campaigns", {
        p_event_ids: eventIds,
        p_seed_run_id: runId,
      });
      if (seedCampErr) throw seedCampErr;

      await finalizeSeedRun(supabase, runId, "completed", {
        event_ids: eventIds,
        ticket_types: Array.isArray(ticketTypeIds) ? ticketTypeIds.length : 0,
        discounts: discountCount ?? 0,
        notifications: notifCount ?? 0,
        campaigns: campaignCount ?? 0,
      });

      return jsonResponse(200, {
        ok: true,
        action,
        seed_run_id: runId,
        summary: {
          events: eventIds.length,
          ticket_types: Array.isArray(ticketTypeIds) ? ticketTypeIds.length : 0,
          discounts: discountCount ?? 0,
          notifications: notifCount ?? 0,
          campaigns: campaignCount ?? 0,
        },
        event_ids: eventIds,
      });
    } catch (e: any) {
      console.error("[seed] seed_all error:", e?.message || String(e));
      await finalizeSeedRun(supabase, body?.seed_run_id ?? null, "failed", {
        error: e?.message || String(e),
      });
      return jsonResponse(500, { ok: false, action, error: e?.message || String(e) });
    }
  }

  // Unknown action
  return jsonResponse(400, { ok: false, error: "Unknown action", action });
});
