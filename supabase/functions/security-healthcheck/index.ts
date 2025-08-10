import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSecurityConfig, getCorsHeaders } from '../_shared/security.ts'

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const env = origin && (origin.includes('localhost') || origin.includes('127.0.0.1')) ? 'development' : 'production';
  const headers = getCorsHeaders(origin, getSecurityConfig(env));

  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(JSON.stringify({ ok: false, error: 'STRIPE_SECRET_KEY is not set' }), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 500 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16', httpClient: Stripe.createFetchHttpClient() });

    // Validate key by calling Stripe API
    let account: any = null;
    try {
      account = await stripe.accounts.retrieve();
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid Stripe secret key', details: (e as any)?.message }), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 500 });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        environment: env,
        stripe: { id: account.id, email: account.email, business_type: account.business_type, charges_enabled: account.charges_enabled, payouts_enabled: account.payouts_enabled },
        supabase: { urlSet: !!Deno.env.get('SUPABASE_URL') }
      }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: (error as any)?.message || 'unknown' }), { headers: { ...headers, 'Content-Type': 'application/json' }, status: 500 });
  }
});
