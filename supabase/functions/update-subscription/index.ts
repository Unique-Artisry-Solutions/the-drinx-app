
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'
import { enforceRateLimit } from '../_shared/rateLimit.ts'
import { sanitizeObject, validateBasicPayload } from '../_shared/sanitize.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { logHttpStart, logHttpEnd, logPaymentAudit } from '../_shared/logging.ts'
import { z } from "npm:zod@3.23.8"

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const admin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })

async function getAuthenticatedUser(req: Request): Promise<{ user: any | null; error?: string }> {
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (authHeader.split(' ')[1] || '')
  if (!token) {
    return { user: null, error: 'Missing Authorization header' }
  }
  const { data, error } = await supabaseAnon.auth.getUser(token)
  if (error || !data?.user) {
    return { user: null, error: 'Invalid or expired token' }
  }
  return { user: data.user }
}

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
    // Authenticate user
    const { user, error: authError } = await getAuthenticatedUser(req)
    if (!user) {
      const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '')
        .split(',')[0].trim() || null
      await admin.from('security_event_logs').insert({
        event_type: 'auth_failure',
        severity: 'medium',
        ip_address: ip,
        user_agent: req.headers.get('user-agent'),
        user_id: null,
        endpoint: 'update-subscription',
        details: { error: authError || 'Unauthorized' }
      })
      await logHttpEnd(http, 401, cors)
      return new Response(JSON.stringify({ error: authError || 'Unauthorized' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    // Persistent rate limiting
    const rate = await enforceRateLimit(req, 'update-subscription', { userLimit: 30, ipLimit: 90, windowSeconds: 60 })
    if (!rate.allowed) {
      const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '')
        .split(',')[0].trim() || null
      await admin.from('security_event_logs').insert({
        event_type: 'rate_limit_exceeded',
        severity: 'medium',
        ip_address: ip,
        user_agent: req.headers.get('user-agent'),
        user_id: user.id,
        endpoint: 'update-subscription',
        details: { retry_after: rate.retryAfter, reason: rate.reason }
      })
      await logHttpEnd(http, 429, cors)
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...cors, 'Content-Type': 'application/json', 'Retry-After': String(rate.retryAfter ?? 60) } })
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
      await logHttpEnd(http, 500, cors)
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured' }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
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
      await logHttpEnd(http, 400, cors)
      return new Response(JSON.stringify({ error: basic.error }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } })
    }

    const Schema = z.object({
      subscriptionId: z.string().min(1),
      priceId: z.string().min(1),
      metadata: z.record(z.any()).optional()
    }).strict()

    const { subscriptionId, priceId, metadata } = Schema.parse(body)


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

    await logHttpEnd(http, 200, cors)
    return new Response(
      JSON.stringify({
        subscription_id: subscription.id,
        status: subscription.status,
        updated: true
      }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
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
    await logHttpEnd(http, 400, cors)
    return new Response(
      JSON.stringify({ error: (error as any).message }),
      { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
    )
  }
}

serve(handler)

