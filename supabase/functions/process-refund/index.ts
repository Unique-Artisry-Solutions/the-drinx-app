
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'
import { enforceRateLimit } from '../_shared/rateLimit.ts'
import { sanitizeObject, validateBasicPayload } from '../_shared/sanitize.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  const origin = req.headers.get('origin');
  const env = origin && (origin.includes('localhost') || origin.includes('127.0.0.1')) ? 'development' : 'production';
  const securityConfig = getSecurityConfig(env);
  const secureHeaders = getCorsHeaders(origin, securityConfig);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: secureHeaders })
  }
  if (!isOriginAllowed(origin, securityConfig)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: { ...secureHeaders, 'Content-Type': 'application/json' } })
  }
  
  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    
    if (!STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured' }),
        { status: 500, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Persistent rate limiting
    const rate = await enforceRateLimit(req, 'process-refund', { userLimit: 15, ipLimit: 45, windowSeconds: 60 })
    if (!rate.allowed) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...secureHeaders, 'Content-Type': 'application/json', 'Retry-After': String(rate.retryAfter ?? 60) } })
    }
    
    const { paymentIntentId, amount, reason, refundedBy, transactionId } = sanitizeObject(await req.json()) as any
    
    // Get the transaction details
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single()
    
    if (transactionError || !transaction) {
      return new Response(
        JSON.stringify({ error: 'Transaction not found' }),
        { status: 404, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Process the refund through Stripe
    const refund = await stripe.refunds.create({
      payment_intent: transaction.provider_transaction_id,
      amount: amount || undefined, // If no amount provided, refund the full amount
      reason: reason === 'requested_by_customer' ? 'requested_by_customer' : 'other',
    })
    
    // Record the refund in our database
    const { data: refundData, error: refundError } = await supabaseClient
      .from('payment_refunds')
      .insert({
        transaction_id: transactionId,
        amount: amount || transaction.amount,
        status: refund.status,
        reason,
        provider_refund_id: refund.id,
        refunded_by: refundedBy,
        metadata: {
          stripe_refund_id: refund.id
        }
      })
      .select()
      .single()
    
    if (refundError) {
      console.error('Error recording refund:', refundError)
    }
    
    // Update the transaction status if it was a full refund
    if (!amount || amount === transaction.amount) {
      await supabaseClient
        .from('payment_transactions')
        .update({ status: 'refunded' })
        .eq('id', transactionId)
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        refundId: refund.id,
        status: refund.status,
        transactionId
      }),
      { status: 200, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing refund:', error)
    return new Response(
      JSON.stringify({ error: (error as any).message }),
      { status: 400, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Import the Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create a Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } }
)

serve(handler)
