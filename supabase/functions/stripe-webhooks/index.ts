
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getSecurityConfig, getCorsHeaders } from '../_shared/security.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Structured logging helper
const logWebhookEvent = (level: 'info' | 'warn' | 'error', event: string, data: Record<string, any> = {}) => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level,
    event,
    service: 'stripe-webhooks',
    ...data
  };
  console.log(JSON.stringify(logData));
};

// Idempotency check using event ID
const checkEventIdempotency = async (supabase: any, eventId: string): Promise<boolean> => {
  try {
    const { data: existing } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .single();
    
    return !!existing;
  } catch {
    return false;
  }
};

// Record processed event for idempotency
const recordProcessedEvent = async (supabase: any, event: Stripe.Event) => {
  try {
    await supabase
      .from('webhook_events')
      .upsert({
        event_id: event.id,
        event_type: event.type,
        processed_at: new Date().toISOString(),
        created_at: new Date(event.created * 1000).toISOString(),
        livemode: event.livemode,
        api_version: event.api_version
      }, { 
        onConflict: 'event_id',
        ignoreDuplicates: true
      });
  } catch (error) {
    logWebhookEvent('warn', 'failed_to_record_event', { 
      eventId: event.id, 
      error: error.message 
    });
  }
};

// Enhanced signature verification with defensive checks
const verifyWebhookSignature = (
  body: string, 
  signature: string | null, 
  secret: string,
  stripe: Stripe
): { success: boolean; event?: Stripe.Event; error?: string } => {
  if (!signature) {
    return { success: false, error: 'Missing Stripe-Signature header' };
  }

  // Check signature format
  if (!signature.includes('t=') || !signature.includes('v1=')) {
    return { success: false, error: 'Invalid signature format' };
  }

  // Verify signature hasn't been tampered with
  const elements = signature.split(',');
  const timestamp = elements.find(elem => elem.startsWith('t='))?.split('=')[1];
  
  if (!timestamp) {
    return { success: false, error: 'Missing timestamp in signature' };
  }

  // Check if timestamp is reasonable (within 5 minutes)
  const webhookTimestamp = parseInt(timestamp);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const tolerance = 5 * 60; // 5 minutes
  
  if (Math.abs(currentTimestamp - webhookTimestamp) > tolerance) {
    return { success: false, error: 'Webhook timestamp too old or too far in future' };
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    return { success: true, event };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown signature error';
    return { success: false, error: errorMsg };
  }
};

// Validate required fields in webhook data
const validateWebhookData = (event: Stripe.Event): { valid: boolean; missingFields?: string[] } => {
  const missingFields: string[] = [];
  
  if (!event.id) missingFields.push('event.id');
  if (!event.type) missingFields.push('event.type');
  if (!event.data?.object) missingFields.push('event.data.object');
  
  // Type-specific validations
  switch (event.type) {
    case 'payment_intent.succeeded':
    case 'payment_intent.payment_failed':
      const pi = event.data.object as Stripe.PaymentIntent;
      if (!pi.id) missingFields.push('payment_intent.id');
      if (typeof pi.amount !== 'number') missingFields.push('payment_intent.amount');
      break;
      
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const sub = event.data.object as Stripe.Subscription;
      if (!sub.id) missingFields.push('subscription.id');
      if (!sub.customer) missingFields.push('subscription.customer');
      break;
  }
  
  return { valid: missingFields.length === 0, missingFields };
};

const handler = async (req: Request): Promise<Response> => {
  const requestId = crypto.randomUUID();
  
  // Server-to-server: build CORS but do not enforce origin checks
  const origin = req.headers.get('origin');
  const config = getSecurityConfig();
  const cors = getCorsHeaders(origin, config);
  
  logWebhookEvent('info', 'webhook_request_received', { 
    requestId, 
    method: req.method, 
    origin,
    userAgent: req.headers.get('user-agent')?.slice(0, 100) // Truncate for security
  });
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  try {
    // Environment variable checks with specific error messages
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const missingEnvVars = [];
    if (!STRIPE_SECRET_KEY) missingEnvVars.push('STRIPE_SECRET_KEY');
    if (!STRIPE_WEBHOOK_SECRET) missingEnvVars.push('STRIPE_WEBHOOK_SECRET');
    if (!SUPABASE_URL) missingEnvVars.push('SUPABASE_URL');
    if (!SUPABASE_SERVICE_ROLE_KEY) missingEnvVars.push('SUPABASE_SERVICE_ROLE_KEY');
    
    if (missingEnvVars.length > 0) {
      logWebhookEvent('error', 'missing_configuration', { 
        requestId, 
        missingEnvVars 
      });
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration incomplete',
          requestId,
          details: 'Required environment variables not configured'
        }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    // Get request body and signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    logWebhookEvent('info', 'webhook_signature_check', { 
      requestId,
      hasSignature: !!signature,
      bodyLength: body.length 
    });

    // Enhanced signature verification
    const verificationResult = verifyWebhookSignature(body, signature, STRIPE_WEBHOOK_SECRET, stripe);
    
    if (!verificationResult.success) {
      logWebhookEvent('error', 'signature_verification_failed', { 
        requestId,
        error: verificationResult.error,
        signaturePresent: !!signature 
      });
      return new Response(
        JSON.stringify({ 
          error: 'Webhook signature verification failed',
          requestId,
          details: verificationResult.error 
        }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    const event = verificationResult.event!;
    
    logWebhookEvent('info', 'webhook_event_verified', { 
      requestId,
      eventId: event.id,
      eventType: event.type,
      livemode: event.livemode 
    });

    // Validate webhook data structure
    const validation = validateWebhookData(event);
    if (!validation.valid) {
      logWebhookEvent('error', 'invalid_webhook_data', { 
        requestId,
        eventId: event.id,
        eventType: event.type,
        missingFields: validation.missingFields 
      });
      return new Response(
        JSON.stringify({ 
          error: 'Invalid webhook data structure',
          requestId,
          missingFields: validation.missingFields 
        }),
        { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // Idempotency check - prevent duplicate processing
    const alreadyProcessed = await checkEventIdempotency(supabaseClient, event.id);
    if (alreadyProcessed) {
      logWebhookEvent('info', 'event_already_processed', { 
        requestId,
        eventId: event.id,
        eventType: event.type 
      });
      return new Response(
        JSON.stringify({ 
          received: true, 
          message: 'Event already processed',
          requestId,
          eventId: event.id 
        }),
        { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    }

    // Record event for idempotency tracking
    await recordProcessedEvent(supabaseClient, event);

    // Process the webhook event
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent, supabaseClient, requestId);
          break;
        
        case 'payment_intent.payment_failed':
          await handlePaymentFailure(event.data.object as Stripe.PaymentIntent, supabaseClient, requestId);
          break;
        
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabaseClient, requestId);
          break;
        
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabaseClient, requestId);
          break;
        
        case 'customer.subscription.deleted':
          await handleSubscriptionCancelled(event.data.object as Stripe.Subscription, supabaseClient, requestId);
          break;
        
        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, supabaseClient, requestId);
          break;
        
        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, supabaseClient, requestId);
          break;
        
        default:
          logWebhookEvent('warn', 'unhandled_event_type', { 
            requestId,
            eventId: event.id,
            eventType: event.type 
          });
      }

      logWebhookEvent('info', 'webhook_processed_successfully', { 
        requestId,
        eventId: event.id,
        eventType: event.type 
      });

      return new Response(
        JSON.stringify({ 
          received: true,
          requestId,
          eventId: event.id,
          eventType: event.type 
        }),
        { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
      );

    } catch (processingError) {
      logWebhookEvent('error', 'webhook_processing_failed', { 
        requestId,
        eventId: event.id,
        eventType: event.type,
        error: processingError instanceof Error ? processingError.message : 'Unknown error'
      });
      throw processingError;
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown webhook error';
    
    logWebhookEvent('error', 'webhook_handler_error', { 
      requestId,
      error: errorMessage,
      stack: error instanceof Error ? error.stack?.slice(0, 500) : undefined
    });

    return new Response(
      JSON.stringify({ 
        error: 'Webhook processing failed',
        requestId,
        message: 'Internal server error occurred'
      }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  }
};

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent, supabase: any, requestId: string) {
  logWebhookEvent('info', 'processing_payment_success', { 
    requestId,
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency
  });

  // Guard against missing required fields
  if (!paymentIntent.id) {
    throw new Error('Payment intent ID is missing');
  }
  
  if (typeof paymentIntent.amount !== 'number') {
    throw new Error('Payment intent amount is invalid');
  }

  try {
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
      .eq('provider_transaction_id', paymentIntent.id);

    if (error) {
      logWebhookEvent('error', 'payment_transaction_update_failed', { 
        requestId,
        paymentIntentId: paymentIntent.id,
        error: error.message 
      });
      throw error;
    }

    // If this is a ticket purchase, update ticket status
    if (paymentIntent.metadata?.ticket_purchase_id) {
      const { error: ticketError } = await supabase
        .from('ticket_purchases')
        .update({
          payment_status: 'completed',
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentIntent.metadata.ticket_purchase_id);

      if (ticketError) {
        logWebhookEvent('error', 'ticket_purchase_update_failed', { 
          requestId,
          paymentIntentId: paymentIntent.id,
          ticketPurchaseId: paymentIntent.metadata.ticket_purchase_id,
          error: ticketError.message 
        });
        // Don't throw here - payment was successful even if ticket update failed
      }
    }

    logWebhookEvent('info', 'payment_success_processed', { 
      requestId,
      paymentIntentId: paymentIntent.id 
    });

  } catch (error) {
    logWebhookEvent('error', 'payment_success_handler_error', { 
      requestId,
      paymentIntentId: paymentIntent.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent, supabase: any, requestId: string) {
  logWebhookEvent('info', 'processing_payment_failure', { 
    requestId,
    paymentIntentId: paymentIntent.id,
    failureReason: paymentIntent.last_payment_error?.message 
  });

  // Guard against missing required fields
  if (!paymentIntent.id) {
    throw new Error('Payment intent ID is missing');
  }

  try {
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
      .eq('provider_transaction_id', paymentIntent.id);

    if (error) {
      logWebhookEvent('error', 'payment_failure_update_failed', { 
        requestId,
        paymentIntentId: paymentIntent.id,
        error: error.message 
      });
      throw error;
    }

    // Create payment retry record if transaction_id exists
    if (paymentIntent.metadata?.transaction_id) {
      const { error: retryError } = await supabase
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
        });

      if (retryError) {
        logWebhookEvent('warn', 'payment_retry_insert_failed', { 
          requestId,
          paymentIntentId: paymentIntent.id,
          error: retryError.message 
        });
        // Don't throw - failure was recorded successfully
      }
    }

    logWebhookEvent('info', 'payment_failure_processed', { 
      requestId,
      paymentIntentId: paymentIntent.id 
    });

  } catch (error) {
    logWebhookEvent('error', 'payment_failure_handler_error', { 
      requestId,
      paymentIntentId: paymentIntent.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any, requestId: string) {
  logWebhookEvent('info', 'processing_subscription_created', { 
    requestId,
    subscriptionId: subscription.id,
    customerId: subscription.customer as string,
    status: subscription.status 
  });

  // Guard against missing required fields
  if (!subscription.id || !subscription.customer) {
    throw new Error('Subscription ID or customer ID is missing');
  }

  try {
    const { error } = await supabase
      .from('subscription_payments')
      .insert({
        subscription_id: subscription.metadata?.internal_subscription_id || null,
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
      });

    if (error) {
      logWebhookEvent('error', 'subscription_created_insert_failed', { 
        requestId,
        subscriptionId: subscription.id,
        error: error.message 
      });
      throw error;
    }

    logWebhookEvent('info', 'subscription_created_processed', { 
      requestId,
      subscriptionId: subscription.id 
    });

  } catch (error) {
    logWebhookEvent('error', 'subscription_created_handler_error', { 
      requestId,
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any, requestId: string) {
  logWebhookEvent('info', 'processing_subscription_updated', { 
    requestId,
    subscriptionId: subscription.id,
    status: subscription.status 
  });

  if (!subscription.id) {
    throw new Error('Subscription ID is missing');
  }

  try {
    const { error } = await supabase
      .from('subscription_payments')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      logWebhookEvent('error', 'subscription_updated_failed', { 
        requestId,
        subscriptionId: subscription.id,
        error: error.message 
      });
      throw error;
    }

    logWebhookEvent('info', 'subscription_updated_processed', { 
      requestId,
      subscriptionId: subscription.id 
    });

  } catch (error) {
    logWebhookEvent('error', 'subscription_updated_handler_error', { 
      requestId,
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription, supabase: any, requestId: string) {
  logWebhookEvent('info', 'processing_subscription_cancelled', { 
    requestId,
    subscriptionId: subscription.id 
  });

  if (!subscription.id) {
    throw new Error('Subscription ID is missing');
  }

  try {
    const { error } = await supabase
      .from('subscription_payments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      logWebhookEvent('error', 'subscription_cancelled_failed', { 
        requestId,
        subscriptionId: subscription.id,
        error: error.message 
      });
      throw error;
    }

    logWebhookEvent('info', 'subscription_cancelled_processed', { 
      requestId,
      subscriptionId: subscription.id 
    });

  } catch (error) {
    logWebhookEvent('error', 'subscription_cancelled_handler_error', { 
      requestId,
      subscriptionId: subscription.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, supabase: any, requestId: string) {
  logWebhookEvent('info', 'processing_invoice_payment_succeeded', { 
    requestId,
    invoiceId: invoice.id,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency 
  });

  if (!invoice.id) {
    throw new Error('Invoice ID is missing');
  }

  try {
    const { error } = await supabase
      .from('payment_receipts')
      .insert({
        transaction_id: invoice.metadata?.transaction_id || null,
        receipt_number: `INV-${invoice.number || invoice.id}`,
        receipt_data: {
          invoice_id: invoice.id,
          amount_paid: invoice.amount_paid,
          currency: invoice.currency,
          subscription_id: invoice.subscription,
          period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
          period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null
        }
      });

    if (error) {
      logWebhookEvent('error', 'invoice_receipt_insert_failed', { 
        requestId,
        invoiceId: invoice.id,
        error: error.message 
      });
      throw error;
    }

    logWebhookEvent('info', 'invoice_payment_succeeded_processed', { 
      requestId,
      invoiceId: invoice.id 
    });

  } catch (error) {
    logWebhookEvent('error', 'invoice_payment_succeeded_handler_error', { 
      requestId,
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, supabase: any, requestId: string) {
  logWebhookEvent('info', 'processing_invoice_payment_failed', { 
    requestId,
    invoiceId: invoice.id,
    attemptCount: invoice.attempt_count,
    failureReason: invoice.last_finalization_error?.message 
  });

  if (!invoice.id) {
    throw new Error('Invoice ID is missing');
  }

  try {
    const { error } = await supabase
      .from('payment_failures')
      .insert({
        invoice_id: invoice.id,
        subscription_id: invoice.metadata?.internal_subscription_id || null,
        failure_reason: invoice.last_finalization_error?.message || null,
        attempt_count: invoice.attempt_count || 0,
        next_payment_attempt: invoice.next_payment_attempt ? 
          new Date(invoice.next_payment_attempt * 1000).toISOString() : null
      });

    if (error) {
      logWebhookEvent('error', 'invoice_payment_failure_insert_failed', { 
        requestId,
        invoiceId: invoice.id,
        error: error.message 
      });
      throw error;
    }

    logWebhookEvent('info', 'invoice_payment_failed_processed', { 
      requestId,
      invoiceId: invoice.id 
    });

  } catch (error) {
    logWebhookEvent('error', 'invoice_payment_failed_handler_error', { 
      requestId,
      invoiceId: invoice.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

serve(handler)
