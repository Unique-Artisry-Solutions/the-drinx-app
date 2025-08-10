import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'

const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const env = origin && (origin.includes('localhost') || origin.includes('127.0.0.1')) ? 'development' : 'production';
  const headers = getCorsHeaders(origin, getSecurityConfig(env));
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (!isOriginAllowed(origin, getSecurityConfig(env))) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  try {
    // Auth: require admin
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userData.user.id)
      .single();

    if (profile?.user_type !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    const newKey = String(body?.new_key || '').trim();
    const rotationReason = String(body?.rotation_reason || 'routine');
    if (!newKey.startsWith('sk_')) {
      return new Response(JSON.stringify({ error: 'Invalid key format' }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
    }

    // Validate new key with Stripe (do not store it)
    const stripe = new Stripe(newKey, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });
    let account: any = null;
    try {
      account = await stripe.accounts.retrieve();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Stripe validation failed', details: (e as any)?.message }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
    }

    // Hash the new key for audit trail
    const hashBytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(newKey));
    const newKeyHash = toHex(hashBytes);

    // Record rotation (do not store the raw key)
    const nextRotation = new Date();
    nextRotation.setDate(nextRotation.getDate() + 90);

    await supabase.from('api_key_rotations').insert({
      service_name: 'stripe',
      new_key_hash: newKeyHash,
      old_key_hash: null,
      rotation_reason: rotationReason,
      rotated_by: userData.user.id,
      status: 'validated',
      next_rotation_date: nextRotation.toISOString(),
      metadata: { stripe_account: account?.id, environment: env }
    });

    // Return instructions to complete rotation securely
    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Key validated and rotation recorded. Update Supabase Edge Function secrets to complete rotation.',
        stripe_account: account?.id
      }),
      { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as any)?.message || 'unknown' }), { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } });
  }
});
