import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { 
  getSecurityConfig, 
  getCorsHeaders, 
  sanitizeInput, 
  validateSQLSafety,
  checkRateLimit,
  generateRequestFingerprint,
  detectSuspiciousActivity
} from '../_shared/security.ts'
import { 
  AuditLogger, 
  generateRequestId, 
  sanitizeForAudit,
  extractGeoLocation,
  sanitizeHeaders,
  generateDeviceFingerprint
} from '../_shared/audit.ts'
import { enforceRateLimit } from '../_shared/rateLimit.ts'
import { sanitizeObject, validateBasicPayload } from '../_shared/sanitize.ts'
import Stripe from 'https://esm.sh/stripe@12.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create a Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } }
)

const handler = async (req: Request): Promise<Response> => {
  const requestId = generateRequestId();
  const startTime = Date.now();
  const securityConfig = getSecurityConfig();
  const fingerprint = generateRequestFingerprint(req);
  const auditLogger = new AuditLogger(supabaseClient);
  
  // Enhanced CORS handling
  const origin = req.headers.get('origin');
  const secureHeaders = getCorsHeaders(origin, securityConfig);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: secureHeaders });
  }
  
  try {
    // Log CORS violation if origin not allowed
    if (origin && !secureHeaders['Access-Control-Allow-Origin']?.includes(origin)) {
      await auditLogger.logCorsViolation(origin, fingerprint.ip, fingerprint.userAgent);
      return new Response(
        JSON.stringify({ error: 'Origin not allowed' }),
        { status: 403, headers: secureHeaders }
      );
    }

    // New: persistent rate limiting (IP and user)
    const rate = await enforceRateLimit(req, 'process-payment', {
      userLimit: 20,
      ipLimit: 60,
      windowSeconds: 60,
    })
    if (!rate.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        {
          status: 429,
          headers: { ...secureHeaders, 'Content-Type': 'application/json', 'Retry-After': String(rate.retryAfter ?? 60) }
        }
      )
    }

    // Rate limiting checks
    const ipRateLimit = checkRateLimit(
      `ip:${fingerprint.ip}`, 
      1, // 1 minute window
      securityConfig.maxRequestsPerMinute
    );
    
    if (!ipRateLimit.allowed) {
      await auditLogger.logRateLimitViolation(
        fingerprint.ip, 
        fingerprint.userAgent, 
        fingerprint.userId,
        { type: 'ip_rate_limit', resetTime: ipRateLimit.resetTime }
      );
      
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded', 
          resetTime: ipRateLimit.resetTime 
        }),
        { 
          status: 429, 
          headers: { 
            ...secureHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((ipRateLimit.resetTime - Date.now()) / 1000).toString()
          } 
        }
      );
    }

    // User-based rate limiting if user ID provided
    if (fingerprint.userId) {
      const userRateLimit = checkRateLimit(
        `user:${fingerprint.userId}`, 
        60, // 60 minute window
        securityConfig.maxRequestsPerHour
      );
      
      if (!userRateLimit.allowed) {
        await auditLogger.logRateLimitViolation(
          fingerprint.ip, 
          fingerprint.userAgent, 
          fingerprint.userId,
          { type: 'user_rate_limit', resetTime: userRateLimit.resetTime }
        );
        
        return new Response(
          JSON.stringify({ 
            error: 'User rate limit exceeded', 
            resetTime: userRateLimit.resetTime 
          }),
          { 
            status: 429, 
            headers: { 
              ...secureHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((userRateLimit.resetTime - Date.now()) / 1000).toString()
            } 
          }
        );
      }
    }

    // Detect suspicious activity
    if (detectSuspiciousActivity(fingerprint)) {
      await auditLogger.logSuspiciousActivity(
        fingerprint.ip,
        fingerprint.userAgent,
        'Suspicious user agent detected',
        { requestId, method: req.method }
      );
    }
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
    
    // Parse and sanitize input (enhanced)
    const rawBody = await req.json();
    const sanitizedBody = sanitizeObject(rawBody);
    const basic = validateBasicPayload(sanitizedBody, { maxKeys: 25 });
    if (!basic.ok) {
      throw new Error(basic.error);
    }
    const { paymentMethodId, amount, currency, description, metadata } = sanitizedBody as any;
    
    // Enhanced input validation
    if (typeof amount !== 'number' || !isFinite(amount) || amount <= 0) {
      throw new Error('Invalid amount provided');
    }
    
    if (currency && !validateSQLSafety(currency)) {
      throw new Error('Invalid currency format');
    }
    
    if (description && (!validateSQLSafety(description) || description.length > 500)) {
      throw new Error('Invalid description format or length');
    }
    
    if (!paymentMethodId || typeof paymentMethodId !== 'string' || !paymentMethodId.startsWith('pm_')) {
      throw new Error('Invalid payment method ID');
    }

    // Log payment attempt with comprehensive audit data
    await auditLogger.logPaymentAttempt({
      request_id: requestId,
      user_id: (metadata as any)?.userId,
      ip_address: fingerprint.ip,
      user_agent: fingerprint.userAgent,
      payment_method_id: paymentMethodId,
      amount,
      currency: currency || 'usd',
      status: 'initiated',
      timestamp: new Date().toISOString(),
      security_flags: detectSuspiciousActivity(fingerprint) ? ['suspicious_activity'] : [],
      request_headers: sanitizeHeaders(req.headers),
      geolocation_data: extractGeoLocation(req),
      session_id: req.headers.get('x-session-id') || undefined,
      referrer_url: req.headers.get('referer') || undefined,
      device_fingerprint: generateDeviceFingerprint(req)
    });
    
    console.log('Processing payment:', sanitizeForAudit({ 
      requestId, 
      paymentMethodId: 'pm_***', 
      amount, 
      currency, 
      description 
    }));
    
    // Get the origin for dynamic return URL
    const originForReturn = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'http://localhost:3000'

    // Security: BIN validation, device fingerprint upsert, and anomaly detection
    let riskFlags: string[] = []

    // Try to retrieve payment method details to check card metadata
    let pm: any = null
    try {
      pm = await stripe.paymentMethods.retrieve(paymentMethodId)
    } catch (e) {
      console.warn('Failed to retrieve payment method details', e)
    }
    const cardInfo = pm?.card || null
    let bin: string | null = (cardInfo as any)?.iin || null
    if (!bin && (metadata as any)?.bin) {
      bin = String((metadata as any).bin).slice(0, 6)
    }
    if (bin) {
      try {
        const { data: binRow } = await supabaseClient
          .from('bin_database')
          .select('bin_range, card_brand, country_code, is_restricted, risk_level, issuing_bank')
          .eq('bin_range', bin)
          .maybeSingle()
        if (binRow) {
          if (binRow.is_restricted) {
            await supabaseClient.from('security_event_logs').insert({
              event_type: 'bin_validation_block',
              severity: 'high',
              ip_address: fingerprint.ip,
              user_agent: fingerprint.userAgent,
              endpoint: 'process-payment',
              details: { bin, amount, currency, issuing_bank: binRow.issuing_bank }
            })
            return new Response(
              JSON.stringify({ error: 'This card is not accepted. Please use a different payment method.' }),
              { status: 403, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
            )
          }
          if (binRow.risk_level && binRow.risk_level !== 'low') {
            riskFlags.push(`bin_risk_${binRow.risk_level}`)
          }
        }
      } catch (e) {
        console.warn('BIN lookup failed', e)
      }
    }

    // Persist/request device fingerprint
    const deviceFp = generateDeviceFingerprint(req)
    try {
      await supabaseClient.from('device_fingerprints').insert({
        user_id: (metadata as any)?.userId || null,
        device_data: { user_agent: fingerprint.userAgent, accept_language: req.headers.get('accept-language') },
        fingerprint_hash: deviceFp,
        is_trusted: false,
        risk_score: 0
      })
    } catch (_) { /* ignore unique/rls issues */ }

    // Basic anomaly detection on user history
    if ((metadata as any)?.userId) {
      try {
        const { data: recent } = await supabaseClient
          .from('payment_transactions')
          .select('amount, created_at, status')
          .eq('user_id', (metadata as any).userId)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(10)
        const amounts = (recent || []).map(r => Number(r.amount) || 0)
        const avg = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0
        if (avg > 0 && amount > avg * 3) riskFlags.push('amount_spike')
        if (amount >= 200000) riskFlags.push('absolute_high_amount') // >= $2000 assuming cents
      } catch (e) {
        console.warn('Anomaly detection failed', e)
      }
    }

    if (riskFlags.length) {
      try {
        await supabaseClient.from('security_event_logs').insert({
          event_type: 'payment_anomaly',
          severity: riskFlags.includes('absolute_high_amount') ? 'high' : 'medium',
          ip_address: fingerprint.ip,
          user_agent: fingerprint.userAgent,
          endpoint: 'process-payment',
          details: { amount, currency, payment_method_id: paymentMethodId, bin: bin || undefined, card_brand: cardInfo?.brand, issuing_country: cardInfo?.country, flags: riskFlags }
        })
      } catch (_) { /* ignore */ }
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description,
      metadata,
      return_url: `${originForReturn}/payment-confirmation`,
    })
    
    console.log('Payment intent created:', { id: 'pi_***', status: paymentIntent.status, requestId });
    
    // Log successful payment processing with comprehensive data
    await auditLogger.logPaymentAttempt({
      request_id: requestId,
      user_id: (metadata as any)?.userId,
      ip_address: fingerprint.ip,
      user_agent: fingerprint.userAgent,
      payment_method_id: paymentMethodId,
      amount,
      currency: currency || 'usd',
      status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'processing',
      stripe_payment_intent_id: paymentIntent.id,
      processing_time_ms: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      security_flags: detectSuspiciousActivity(fingerprint) ? ['suspicious_activity'] : [],
      request_headers: sanitizeHeaders(req.headers),
      geolocation_data: extractGeoLocation(req),
      session_id: req.headers.get('x-session-id') || undefined,
      referrer_url: req.headers.get('referer') || undefined,
      device_fingerprint: generateDeviceFingerprint(req)
    });
    
    // Record the payment in our database
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        user_id: (metadata as any).userId,
        amount,
        currency,
        status: paymentIntent.status === 'succeeded' ? 'completed' : paymentIntent.status,
        provider: 'stripe',
        provider_transaction_id: paymentIntent.id,
        payment_method_id: paymentMethodId,
        metadata: {
          ...(metadata as any),
          stripe_payment_intent: paymentIntent.id,
          risk_flags: riskFlags
        }
      })
      .select('id')
      .single()

    if (paymentError) {
      console.error('Error recording payment:', paymentError)
      
      // If payment succeeded but we can't record it, we need to handle this carefully
      if (paymentIntent.status === 'succeeded') {
        // Log critical error for manual reconciliation
        console.error('CRITICAL: Payment succeeded but database insert failed', {
          paymentIntentId: paymentIntent.id,
          amount,
          currency,
          error: paymentError.message
        })
        
        // Still return success since payment went through, but flag the issue
        return new Response(
          JSON.stringify({ 
            success: true,
            status: paymentIntent.status,
            paymentIntentId: paymentIntent.id,
            transactionId: null,
            warning: 'Payment processed but record creation failed'
          }),
          { status: 200, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // If payment failed and we can't record it, try to cancel the payment intent
      try {
        await stripe.paymentIntents.cancel(paymentIntent.id)
        console.log('Cancelled payment intent due to database error:', paymentIntent.id)
      } catch (cancelError) {
        console.error('Failed to cancel payment intent:', cancelError)
      }
      
      throw new Error('Failed to process payment: ' + paymentError.message)
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
            ...(metadata as any)
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
      { status: 200, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing payment:', error);
    
    // Log failed payment attempt with comprehensive audit data
    try {
      await auditLogger.logPaymentAttempt({
        request_id: requestId,
        user_id: fingerprint.userId,
        ip_address: fingerprint.ip,
        user_agent: fingerprint.userAgent,
        status: 'failed',
        error_code: (error as any).code || 'unknown',
        error_message: (error as any).message,
        processing_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        security_flags: detectSuspiciousActivity(fingerprint) ? ['suspicious_activity'] : [],
        request_headers: sanitizeHeaders(req.headers),
        geolocation_data: extractGeoLocation(req),
        session_id: req.headers.get('x-session-id') || undefined,
        referrer_url: req.headers.get('referer') || undefined,
        device_fingerprint: generateDeviceFingerprint(req)
      });
    } catch (auditError) {
      console.error('Failed to log audit event:', auditError);
    }
    
    const secureHeadersFinal = getCorsHeaders(req.headers.get('origin'), securityConfig);
    return new Response(
      JSON.stringify({ error: (error as any).message }),
      { status: 400, headers: { ...secureHeadersFinal, 'Content-Type': 'application/json' } }
    );
  }
}

serve(handler)
