import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const origin = req.headers.get('origin') || `${url.protocol}//${url.host}`;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY');

    const envDiagnostics = {
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasAnonKey: Boolean(anonKey),
      hasServiceRoleKey: Boolean(serviceRoleKey),
    };

    if (!supabaseUrl || !anonKey) {
      return new Response(
        JSON.stringify({ ok: false, stage: 'env', error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY', env: envDiagnostics }),
        { status: 500, headers: { 'content-type': 'application/json', ...corsHeaders } }
      );
    }

    const authHeader = req.headers.get('Authorization') ?? '';

    // Client bound to caller's JWT
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Admin client (requires SERVICE_ROLE_KEY)
    const supabaseAdmin = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
      : null;

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ ok: false, stage: 'method', error: 'Method not allowed', method: req.method }),
        { status: 405, headers: { 'content-type': 'application/json', ...corsHeaders } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const target_user_id = body?.target_user_id ?? null;
    const test_link: boolean = Boolean(body?.test_link);

    // Identify caller
    const { data: callerRes, error: callerErr } = await supabase.auth.getUser();
    if (callerErr || !callerRes?.user) {
      return new Response(
        JSON.stringify({ ok: false, stage: 'auth', error: 'Unauthorized', details: callerErr?.message }),
        { status: 401, headers: { 'content-type': 'application/json', ...corsHeaders } }
      );
    }

    const callerId = callerRes.user.id;

    // Check caller profile and admin role
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', callerId)
      .single();

    const isAdmin = !profileErr && profile?.user_type === 'admin';
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ ok: false, stage: 'rbac', error: 'Forbidden: admin only', callerId, user_type: profile?.user_type ?? null }),
        { status: 403, headers: { 'content-type': 'application/json', ...corsHeaders } }
      );
    }

    // Admin key diagnostics
    const adminDiagnostics: Record<string, unknown> = {
      canCreateAdminClient: Boolean(supabaseAdmin),
    };

    // If we have admin client, try light-weight privileged ops
    let targetLookup: { ok: boolean; error?: string } = { ok: false };
    let linkTest: 'skipped' | 'success' | 'failed' = 'skipped';
    let linkErrMsg: string | undefined = undefined;

    if (supabaseAdmin && target_user_id) {
      const { data: targetRes, error: targetErr } = await supabaseAdmin.auth.admin.getUserById(target_user_id);
      targetLookup = {
        ok: Boolean(targetRes?.user),
        error: targetErr?.message,
      };

      if (test_link && targetRes?.user?.email) {
        const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: targetRes.user.email,
          options: { redirectTo: `${origin}/` },
        } as any);
        if (linkErr || !linkData?.properties?.action_link) {
          linkTest = 'failed';
          linkErrMsg = linkErr?.message || 'Failed to generate link';
        } else {
          linkTest = 'success';
        }
      }
    }

    const diagnostics = {
      ok: true,
      stage: 'diagnostics',
      timestamp: new Date().toISOString(),
      env: envDiagnostics,
      caller: { id: callerId, user_type: 'admin' },
      admin: adminDiagnostics,
      targetLookup,
      linkTest,
      linkErrMsg,
    };

    return new Response(JSON.stringify(diagnostics), {
      status: 200,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, stage: 'exception', error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { 'content-type': 'application/json', ...corsHeaders } }
    );
  }
});
