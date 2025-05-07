
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
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
    
    const { paymentMethodId, amount, currency, description, metadata } = await req.json()
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description,
      metadata,
      return_url: 'https://yoursite.com/payment-confirmation',
    })
    
    // Record the payment in our database
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        user_id: metadata.userId,
        amount,
        currency,
        status: paymentIntent.status === 'succeeded' ? 'completed' : paymentIntent.status,
        provider: 'stripe',
        provider_transaction_id: paymentIntent.id,
        payment_method_id: paymentMethodId,
        metadata: {
          ...metadata,
          stripe_payment_intent: paymentIntent.id,
        }
      })
      .select('id')
      .single()

    if (paymentError) {
      console.error('Error recording payment:', paymentError)
      // Payment was processed by Stripe but we failed to record it
      // This should trigger an alert for manual reconciliation
    }
    
    // Create a receipt if payment was successful
    if (paymentIntent.status === 'succeeded' && paymentData?.id) {
      const receiptNumber = `RCPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      
      await supabaseClient
        .from('payment_receipts')
        .insert({
          transaction_id: paymentData.id,
          receipt_number: receiptNumber,
          receipt_data: {
            payment_intent: paymentIntent.id,
            amount: paymentIntent.amount / 100, // Convert cents to dollars for display
            currency: paymentIntent.currency.toUpperCase(),
            date: new Date().toISOString(),
            description: paymentIntent.description,
            ...metadata
          }
        })
    }
    
    return new Response(
      JSON.stringify({ 
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        paymentIntentId: paymentIntent.id,
        transactionId: paymentData?.id || null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
