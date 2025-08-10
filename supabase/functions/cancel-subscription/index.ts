
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'
import { enforceRateLimit } from '../_shared/rateLimit.ts'
import { sanitizeObject, validateBasicPayload } from '../_shared/sanitize.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { logHttpStart, logHttpEnd, logPaymentAudit, logSecurityEvent } from '../_shared/logging.ts'

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const env = origin && (origin.includes('localhost') || origin.includes('127.0.0.1')) ? 'development' : 'production';
  const securityConfig = getSecurityConfig(env);
  const secureHeaders = getCorsHeaders(origin, securityConfig);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: secureHeaders })
  }

  if (!isOriginAllowed(origin, securityConfig)) {
    await logSecurityEvent(req, 'cors_violation', 'medium', { function: 'cancel-subscription', origin })
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: { ...secureHeaders, 'Content-Type': 'application/json' } })
  }

  // Start logging after CORS is allowed
  const http = await logHttpStart(req, 'cancel-subscription')

  try {
    const rate = await enforceRateLimit(req, 'cancel-subscription', { userLimit: 20, ipLimit: 60, windowSeconds: 60 })
    if (!rate.allowed) {
      await logHttpEnd(http, 429, secureHeaders)
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...secureHeaders, 'Content-Type': 'application/json', 'Retry-After': String(rate.retryAfter ?? 60) } })
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
      await logHttpEnd(http, 500, secureHeaders)
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured' }),
        { status: 500, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
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
    const body = sanitizeObject(raw)
    const basic = validateBasicPayload(body, { maxKeys: 10 })
    if (!basic.ok) {
      await logPaymentAudit({
        requestId: http.requestId,
        userId: http.userId,
        ip: http.ip,
        userAgent: http.userAgent,
        status: 'failed',
        errorMessage: basic.error ?? 'Invalid payload'
      })
      await logHttpEnd(http, 400, secureHeaders)
      return new Response(JSON.stringify({ error: basic.error }), { status: 400, headers: { ...secureHeaders, 'Content-Type': 'application/json' } })
    }

    const { subscriptionId, immediately = false } = body as any

    // Audit: initiated
    await logPaymentAudit({
      requestId: http.requestId,
      userId: http.userId,
      ip: http.ip,
      userAgent: http.userAgent,
      status: 'initiated'
    })

    let subscription: Stripe.Subscription

    if (immediately) {
      subscription = await stripe.subscriptions.cancel(subscriptionId)
    } else {
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      })
    }

    // Update database record
    await supabaseClient
      .from('subscription_payments')
      .update({
        status: subscription.status,
        cancelled_at: immediately ? new Date().toISOString() : null,
        cancel_at_period_end: !immediately,
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

    await logHttpEnd(http, 200, secureHeaders)
    return new Response(
      JSON.stringify({
        subscription_id: subscription.id,
        status: subscription.status,
        cancelled: true,
        cancel_at_period_end: subscription.cancel_at_period_end
      }),
      { status: 200, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    await logPaymentAudit({
      requestId: http.requestId,
      userId: http.userId,
      ip: http.ip,
      userAgent: http.userAgent,
      status: 'failed',
      errorMessage: (error as any)?.message ?? 'Unknown error'
    })
    await logHttpEnd(http, 400, secureHeaders)
    return new Response(
      JSON.stringify({ error: (error as any).message }),
      { status: 400, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

serve(handler)

