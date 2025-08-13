import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const origin = req.headers.get('origin') || `${url.protocol}//${url.host}`;

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY');

    if (!supabaseUrl || !anonKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase URL or anon key' }), {
        status: 500,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }
    if (!serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'SERVICE_ROLE_KEY is not configured' }), {
        status: 500,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    const authHeader = req.headers.get('Authorization') ?? '';

    // Client bound to the caller's JWT (to read caller info if needed)
    const supabase = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Admin client for privileged actions
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    const { target_user_id } = await req.json().catch(() => ({ target_user_id: null }));
    if (!target_user_id) {
      return new Response(JSON.stringify({ error: 'target_user_id is required' }), {
        status: 400,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // Get caller
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    const callerId = userData.user.id;

    // Verify caller is admin via profiles.user_type
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', callerId)
      .single();

    if (profileErr || profile?.user_type !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), {
        status: 403,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    // Fetch target user (to get email)
    const { data: targetUserRes, error: targetUserErr } = await supabaseAdmin.auth.admin.getUserById(target_user_id);
    if (targetUserErr || !targetUserRes?.user?.email) {
      return new Response(JSON.stringify({ error: 'Target user not found or has no email' }), {
        status: 404,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    const redirectTo = `${origin}/`;

    // Generate magic link
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUserRes.user.email,
      options: { redirectTo },
    } as any);

    if (linkErr || !linkData?.properties?.action_link) {
      return new Response(JSON.stringify({ error: linkErr?.message || 'Failed to generate link' }), {
        status: 500,
        headers: { 'content-type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(
      JSON.stringify({ action_link: linkData.properties.action_link }),
      { status: 200, headers: { 'content-type': 'application/json', ...corsHeaders } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { 'content-type': 'application/json', ...corsHeaders },
    });
  }
});
