
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getSecurityConfig, getCorsHeaders } from '../_shared/security.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const handler = async (req: Request): Promise<Response> => {
  // Server-to-server: build CORS but do not enforce origin checks
  const origin = req.headers.get('origin');
  const config = getSecurityConfig();
  const cors = getCorsHeaders(origin, config);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
      console.error('Missing Stripe configuration')
      return new Response(
        JSON.stringify({ error: 'Stripe configuration incomplete' }),
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

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent, supabaseClient)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent, supabaseClient)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabaseClient)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabaseClient)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription, supabaseClient)
        break
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, supabaseClient)
        break
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, supabaseClient)
        break
      
      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook handler error:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  console.log('Processing successful payment:', paymentIntent.id)
  
  const { error } = await supabase
    .from('payment_transactions')
    .update({
      status: 'completed',
      provider_transaction_id: paymentIntent.id,
      metadata: {
        ...paymentIntent.metadata,
        stripe_payment_intent: paymentIntent.id,
        amount_received: paymentIntent.amount_received,
        charges: paymentIntent.charges.data.map(charge => ({
          id: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          status: charge.status
        }))
      },
      updated_at: new Date().toISOString()
    })
    .eq('provider_transaction_id', paymentIntent.id)

  if (error) {
    console.error('Error updating payment transaction:', error)
    throw error
  }

  // If this is a ticket purchase, update ticket status
  if (paymentIntent.metadata.ticket_purchase_id) {
    await supabase
      .from('ticket_purchases')
      .update({
        payment_status: 'completed',
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentIntent.metadata.ticket_purchase_id)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  console.log('Processing failed payment:', paymentIntent.id)
  
  const { error } = await supabase
    .from('payment_transactions')
    .update({
      status: 'failed',
      metadata: {
        ...paymentIntent.metadata,
        failure_reason: paymentIntent.last_payment_error?.message,
        failure_code: paymentIntent.last_payment_error?.code
      },
      updated_at: new Date().toISOString()
    })
    .eq('provider_transaction_id', paymentIntent.id)

  if (error) {
    console.error('Error updating failed payment:', error)
    throw error
  }

  // Create payment retry record
  await supabase
    .from('payment_retries')
    .insert({
      transaction_id: paymentIntent.metadata.transaction_id,
      attempt_number: 1,
      failure_reason: paymentIntent.last_payment_error?.message,
      retry_scheduled_for: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      metadata: {
        payment_intent_id: paymentIntent.id,
        original_amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    })
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing new subscription:', subscription.id)
  
  const { error } = await supabase
    .from('subscription_payments')
    .insert({
      subscription_id: subscription.metadata.internal_subscription_id,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      metadata: {
        customer_id: subscription.customer,
        items: subscription.items.data.map(item => ({
          price_id: item.price.id,
          quantity: item.quantity
        }))
      }
    })

  if (error) {
    console.error('Error creating subscription payment record:', error)
    throw error
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription update:', subscription.id)
  
  await supabase
    .from('subscription_payments')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription cancellation:', subscription.id)
  
  await supabase
    .from('subscription_payments')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing successful invoice payment:', invoice.id)
  
  await supabase
    .from('payment_receipts')
    .insert({
      transaction_id: invoice.metadata.transaction_id,
      receipt_number: `INV-${invoice.number}`,
      receipt_data: {
        invoice_id: invoice.id,
        amount_paid: invoice.amount_paid,
        currency: invoice.currency,
        subscription_id: invoice.subscription,
        period_start: new Date(invoice.period_start * 1000).toISOString(),
        period_end: new Date(invoice.period_end * 1000).toISOString()
      }
    })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing failed invoice payment:', invoice.id)
  
  // Log the failure and potentially notify the customer
  await supabase
    .from('payment_failures')
    .insert({
      invoice_id: invoice.id,
      subscription_id: invoice.metadata.internal_subscription_id,
      failure_reason: invoice.last_finalization_error?.message,
      attempt_count: invoice.attempt_count,
      next_payment_attempt: invoice.next_payment_attempt ? 
        new Date(invoice.next_payment_attempt * 1000).toISOString() : null
    })
}

serve(handler)
