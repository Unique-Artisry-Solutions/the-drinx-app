
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'
import { enforceRateLimit } from '../_shared/rateLimit.ts'
import { sanitizeObject, validateBasicPayload } from '../_shared/sanitize.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { logHttpStart, logHttpEnd, logPaymentAudit } from '../_shared/logging.ts'

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const config = getSecurityConfig();
  const cors = getCorsHeaders(origin, config);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }
  if (!isOriginAllowed(origin, config)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  // Start request logging
  const http = await logHttpStart(req, 'update-subscription')

  try {
    // Persistent rate limiting
    const rate = await enforceRateLimit(req, 'update-subscription', { userLimit: 30, ipLimit: 90, windowSeconds: 60 })
    if (!rate.allowed) {
      await logHttpEnd(http, 429, corsHeaders)
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': String(rate.retryAfter ?? 60) } })
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
      await logHttpEnd(http, 500, corsHeaders)
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const raw = await req.json()
    const body = sanitizeObject(raw) as any

    const basic = validateBasicPayload(body, { maxKeys: 20 })
    if (!basic.ok) {
      await logPaymentAudit({
        requestId: http.requestId,
        userId: http.userId,
        ip: http.ip,
        userAgent: http.userAgent,
        status: 'failed',
        errorMessage: basic.error ?? 'Invalid payload'
      })
      await logHttpEnd(http, 400, corsHeaders)
      return new Response(JSON.stringify({ error: basic.error }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { subscriptionId, priceId, metadata } = body

    // Audit: initiated
    await logPaymentAudit({
      requestId: http.requestId,
      userId: http.userId,
      ip: http.ip,
      userAgent: http.userAgent,
      status: 'initiated'
    })

    // Update the subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: (await stripe.subscriptions.retrieve(subscriptionId)).items.data[0].id,
        price: priceId
      }],
      metadata,
      proration_behavior: 'create_prorations'
    })

    // Update database record
    await supabaseClient
      .from('subscription_payments')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        metadata: {
          ...subscription.metadata,
          updated_price_id: priceId
        },
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId)

    // Audit: succeeded
    await logPaymentAudit({
      requestId: http.requestId,
      userId: http.userId,
      ip: http.ip,
      userAgent: http.userAgent,
      status: 'succeeded'
    })

    await logHttpEnd(http, 200, corsHeaders)
    return new Response(
      JSON.stringify({
        subscription_id: subscription.id,
        status: subscription.status,
        updated: true
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating subscription:', error)
    await logPaymentAudit({
      requestId: http.requestId,
      userId: http.userId,
      ip: http.ip,
      userAgent: http.userAgent,
      status: 'failed',
      errorMessage: (error as any)?.message ?? 'Unknown error'
    })
    await logHttpEnd(http, 400, corsHeaders)
    return new Response(
      JSON.stringify({ error: (error as any).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

serve(handler)

