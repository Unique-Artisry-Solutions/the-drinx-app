// Supabase Edge Function: seed-dev-data
// Provides orchestrated dev data seeding with token-protected access

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Json = Record<string, unknown>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-seed-admin-token",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SEED_ADMIN_TOKEN = Deno.env.get("SEED_ADMIN_TOKEN");
  const token = req.headers.get("x-seed-admin-token");

  // Require token if configured
  if (SEED_ADMIN_TOKEN && token !== SEED_ADMIN_TOKEN) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return jsonResponse({ error: "Missing Supabase service configuration" }, 500);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // no-op, allow empty body
  }

  const action: string = body?.action ?? "";

  async function getOrCreateUser(email: string, password: string, metadata: Record<string, any>) {
    // Try to create first
    const createRes = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (createRes.data?.user) return createRes.data.user;

    // If already exists, find via listUsers
    const list = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = list.data?.users?.find((u) => u.email === email);
    if (found) return found;

    // As a fallback, try again once
    if (createRes.error) {
      const retry = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata,
      });
      if (retry.data?.user) return retry.data.user;
      throw createRes.error;
    }

    throw new Error("Unable to ensure user exists");
  }

  async function startSeedRun(params: Json = {}) {
    const { data, error } = await supabase
      .from("dev_seed_registry")
      .insert({ params, status: "running" })
      .select("id")
      .single();
    if (error) throw error;
    return data.id as string;
  }

  async function completeSeedRun(id: string) {
    await supabase
      .from("dev_seed_registry")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", id);
  }

  try {
    if (action === "seed_personas") {
      const indy = await getOrCreateUser("indy.user@spiritless.dev", "Dev123!@#", {
        username: "indy.user",
        name: "Indy User",
        user_type: "individual",
        phone: "+1-555-0001",
      });
      const owner = await getOrCreateUser("owner.user@spiritless.dev", "Dev123!@#", {
        username: "owner.user",
        name: "Owner User",
        user_type: "establishment",
        phone: "+1-555-0002",
      });
      const promoter = await getOrCreateUser("promo.user@spiritless.dev", "Dev123!@#", {
        username: "promo.user",
        name: "Promo User",
        user_type: "promoter",
        phone: "+1-555-0003",
      });

      return jsonResponse({
        users: {
          individual: indy,
          owner,
          promoter,
        },
      });
    }

    if (action === "cleanup") {
      const { data, error } = await supabase.rpc("clear_dev_seed", { p_seed_run_id: body?.seed_run_id ?? null });
      if (error) throw error;
      return jsonResponse({ cleared: data });
    }

    if (action === "seed_all") {
      // Personas
      const indy = await getOrCreateUser("indy.user@spiritless.dev", "Dev123!@#", {
        username: "indy.user",
        name: "Indy User",
        user_type: "individual",
        phone: "+1-555-0001",
      });
      const owner = await getOrCreateUser("owner.user@spiritless.dev", "Dev123!@#", {
        username: "owner.user",
        name: "Owner User",
        user_type: "establishment",
        phone: "+1-555-0002",
      });
      const promoter = await getOrCreateUser("promo.user@spiritless.dev", "Dev123!@#", {
        username: "promo.user",
        name: "Promo User",
        user_type: "promoter",
        phone: "+1-555-0003",
      });

      const seedRunId = await startSeedRun(body?.params ?? {});

      // Establishments
      const estRes = await supabase.rpc("seed_establishments", {
        p_owner_ids: [owner.id],
        p_count: body?.establishment_count ?? 18,
        p_seed_run_id: seedRunId,
      });
      if (estRes.error) throw estRes.error;
      const establishmentIds: string[] = estRes.data ?? [];

      // Cocktails
      const cocktailsRes = await supabase.rpc("seed_cocktails_for_establishments", {
        p_establishment_ids: establishmentIds,
        p_min_per: 3,
        p_max_per: 6,
        p_seed_run_id: seedRunId,
      });
      if (cocktailsRes.error) throw cocktailsRes.error;
      const cocktailIds: string[] = cocktailsRes.data ?? [];

      // Reviews
      const reviewers = [indy.id, owner.id, promoter.id];
      const reviewsRes = await supabase.rpc("seed_reviews", {
        p_user_ids: reviewers,
        p_cocktail_ids: cocktailIds,
        p_total: body?.reviews_total ?? 120,
        p_seed_run_id: seedRunId,
      });
      if (reviewsRes.error) throw reviewsRes.error;

      // Analytics (last 30 days)
      const analyticsRes = await supabase.rpc("seed_analytics", {
        p_user_ids: reviewers,
        p_days: body?.analytics_days ?? 30,
        p_seed_run_id: seedRunId,
      });
      if (analyticsRes.error) throw analyticsRes.error;

      // Rewards activity
      const rewardsRes = await supabase.rpc("seed_rewards_activity", {
        p_user_ids: reviewers,
        p_establishment_ids: establishmentIds,
        p_events_per_user: body?.rewards_events_per_user ?? 6,
        p_seed_run_id: seedRunId,
      });
      if (rewardsRes.error) throw rewardsRes.error;

      await completeSeedRun(seedRunId);

      return jsonResponse({
        seed_run_id: seedRunId,
        users: { individual: indy.id, owner: owner.id, promoter: promoter.id },
        establishments: establishmentIds.length,
        cocktails: cocktailIds.length,
        reviews_created: reviewsRes.data,
        analytics: analyticsRes.data,
        rewards: rewardsRes.data,
      });
    }

    return jsonResponse({ error: "Unknown action" }, 400);
  } catch (e) {
    return jsonResponse({ error: String(e) }, 500);
  }
});
