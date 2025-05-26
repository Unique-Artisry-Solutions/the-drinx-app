
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    if (!STRIPE_SECRET_KEY) {
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

    const { 
      priceId, 
      customerId, 
      trialPeriodDays, 
      metadata, 
      userId,
      currency = 'USD'
    } = await req.json()

    let customer_id = customerId

    // Create or get customer if not provided
    if (!customer_id) {
      const { data: userData } = await supabaseClient.auth.admin.getUserById(userId)
      if (!userData.user?.email) {
        throw new Error('User email not found')
      }

      const customers = await stripe.customers.list({ 
        email: userData.user.email, 
        limit: 1 
      })

      if (customers.data.length > 0) {
        customer_id = customers.data[0].id
      } else {
        const customer = await stripe.customers.create({
          email: userData.user.email,
          metadata: { userId }
        })
        customer_id = customer.id
      }
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer_id,
      items: [{ price: priceId }],
      trial_period_days: trialPeriodDays,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        ...metadata,
        userId,
        currency
      }
    })

    // Save subscription to database
    const { data: dbSubscription, error: dbError } = await supabaseClient
      .from('subscription_payments')
      .insert({
        subscription_id: subscription.metadata.internal_subscription_id || crypto.randomUUID(),
        stripe_subscription_id: subscription.id,
        user_id: userId,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        metadata: {
          customer_id: customer_id,
          price_id: priceId,
          currency
        }
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error saving subscription to database:', dbError)
      // Don't fail the request, but log the error
    }

    const latest_invoice = subscription.latest_invoice as Stripe.Invoice
    const payment_intent = latest_invoice?.payment_intent as Stripe.PaymentIntent

    return new Response(
      JSON.stringify({
        subscription_id: subscription.id,
        client_secret: payment_intent?.client_secret,
        status: subscription.status,
        internal_subscription_id: dbSubscription?.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

serve(handler)
