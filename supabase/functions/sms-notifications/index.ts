import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts';
import { enforceRateLimit } from '../_shared/rateLimit.ts';
import { sanitizeObject } from '../_shared/sanitize.ts';
import { z } from "npm:zod@3.23.8";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID') ?? '';
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN') ?? '';
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER') ?? '';

const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

// Helper function to create consistent error responses
const createErrorResponse = (message: string, status = 400, cors: Record<string, string>) => {
  console.error('SMS Error:', message);
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    }
  );
};

// Zod schemas for request validation
const ActionSchema = z.object({
  action: z.enum([
    'sendSMS', 'sendBulkSMS', 'deliveryWebhook', 'healthCheck', 'validatePhone', 
    'optInUser', 'optOutUser', 'sendTemplate', 'getCampaignStats', 'testSMS'
  ]),
  params: z.unknown().optional()
}).strict();

const SendSMSSchema = z.object({
  phoneNumber: z.string().min(10),
  message: z.string().min(1).max(1600),
  userId: z.string().uuid().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
  notificationId: z.string().uuid().optional()
}).strict();

const SendBulkSMSSchema = z.object({
  recipients: z.array(z.object({
    phoneNumber: z.string().min(10),
    userId: z.string().uuid().optional(),
    variables: z.record(z.any()).optional()
  })).min(1).max(1000),
  message: z.string().min(1).max(1600),
  templateId: z.string().uuid().optional(),
  campaignId: z.string().uuid().optional(),
  scheduledFor: z.string().optional()
}).strict();

const TemplateMessageSchema = z.object({
  phoneNumber: z.string().min(10),
  templateKey: z.string().min(1),
  variables: z.record(z.any()).optional(),
  userId: z.string().uuid().optional()
}).strict();

const PhoneValidationSchema = z.object({
  phoneNumber: z.string().min(10)
}).strict();

const OptInOutSchema = z.object({
  phoneNumber: z.string().min(10),
  userId: z.string().uuid()
}).strict();

// Twilio helper functions
const sendSMSViaTwilio = async (phoneNumber: string, message: string): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
  segments?: number;
}> => {
  try {
    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error('Twilio credentials not configured');
    }

    // Format phone number
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+1${phoneNumber}`;
    
    const body = new URLSearchParams({
      To: formattedPhone,
      From: twilioPhoneNumber,
      Body: message,
      StatusCallback: `${supabaseUrl}/functions/v1/sms-notifications`
    });

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send SMS');
    }

    // Calculate segments and cost (rough estimate)
    const segments = Math.ceil(message.length / 160);
    const estimatedCost = segments * 0.0075; // ~$0.0075 per segment

    return {
      success: true,
      messageId: result.sid,
      cost: estimatedCost,
      segments
    };
  } catch (error: any) {
    console.error('Twilio SMS Error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};

// Template processing function
const processTemplate = (template: string, variables: Record<string, any> = {}): string => {
  let processed = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
  }
  return processed;
};

// Phone number validation
const validatePhoneNumber = (phoneNumber: string): { isValid: boolean; formatted?: string; error?: string } => {
  try {
    // Basic US phone number validation
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return { isValid: true, formatted: `+1${cleaned}` };
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return { isValid: true, formatted: `+${cleaned}` };
    } else if (phoneNumber.startsWith('+')) {
      const international = phoneNumber.replace(/\D/g, '');
      if (international.length >= 10 && international.length <= 15) {
        return { isValid: true, formatted: phoneNumber };
      }
    }
    
    return { isValid: false, error: 'Invalid phone number format' };
  } catch (error) {
    return { isValid: false, error: 'Phone validation error' };
  }
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const config = getSecurityConfig();
  const cors = getCorsHeaders(origin, config);
  
  console.log(`[SMS] Request: ${req.method} from origin: ${origin}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[SMS] CORS preflight handled for origin: ${origin}`);
    return new Response(null, { 
      status: 204, 
      headers: cors 
    });
  }

  // Handle Twilio webhooks (POST without origin check)
  if (req.method === 'POST' && req.url.includes('webhook')) {
    return await handleTwilioWebhook(req, cors);
  }
  
  if (!isOriginAllowed(origin, config)) {
    console.error(`[SMS] Origin not allowed: ${origin}`);
    return createErrorResponse('Origin not allowed', 403, cors);
  }
  
  console.log(`[SMS] Origin allowed: ${origin}`);

  try {
    // Rate limiting
    const rate = await enforceRateLimit(req, 'sms-notifications', { userLimit: 10, ipLimit: 30, windowSeconds: 60 });
    if (!rate.allowed) {
      const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '')
        .split(',')[0].trim() || null;
      await admin.from('security_event_logs').insert({
        event_type: 'rate_limit_exceeded',
        severity: 'medium',
        ip_address: ip,
        user_agent: req.headers.get('user-agent'),
        user_id: null,
        endpoint: 'sms-notifications',
        details: { retry_after: rate.retryAfter, reason: rate.reason }
      });
      return createErrorResponse('Rate limit exceeded', 429, cors);
    }

    const raw = await req.json();
    const clean = sanitizeObject(raw);
    const { action, params } = ActionSchema.parse(clean);
    
    switch (action) {
      case 'sendSMS':
        const pSMS = SendSMSSchema.parse(params ?? {});
        return await handleSendSMS(pSMS, cors);

      case 'sendBulkSMS':
        const pBulk = SendBulkSMSSchema.parse(params ?? {});
        return await handleSendBulkSMS(pBulk, cors);

      case 'sendTemplate':
        const pTemplate = TemplateMessageSchema.parse(params ?? {});
        return await handleSendTemplate(pTemplate, cors);

      case 'validatePhone':
        const pValidate = PhoneValidationSchema.parse(params ?? {});
        return await handleValidatePhone(pValidate, cors);

      case 'optInUser':
        const pOptIn = OptInOutSchema.parse(params ?? {});
        return await handleOptIn(pOptIn, cors);

      case 'optOutUser':
        const pOptOut = OptInOutSchema.parse(params ?? {});
        return await handleOptOut(pOptOut, cors);

      case 'testSMS':
        const pTest = SendSMSSchema.parse(params ?? {});
        return await handleTestSMS(pTest, cors);

      case 'healthCheck':
        return new Response(
          JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            twilio_configured: !!(twilioAccountSid && twilioAuthToken && twilioPhoneNumber)
          }),
          { headers: { ...cors, 'Content-Type': 'application/json' } }
        );

      default:
        return createErrorResponse('Invalid action', 400, cors);
    }
  } catch (error) {
    console.error('Unexpected SMS error:', error);
    const msg = (error as any)?.message || '';
    return createErrorResponse(
      msg || 'Internal server error',
      500,
      cors
    );
  }
});

// Handle individual SMS sending
async function handleSendSMS(params: any, cors: Record<string, string>) {
  try {
    const { phoneNumber, message, userId, priority, notificationId } = params;
    
    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      return createErrorResponse(validation.error || 'Invalid phone number', 400, cors);
    }

    // Check user opt-in status if userId provided
    if (userId) {
      const { data: phone } = await admin
        .from('user_phone_numbers')
        .select('sms_opt_in')
        .eq('user_id', userId)
        .eq('phone_number', validation.formatted)
        .single();
      
      if (phone && !phone.sms_opt_in) {
        return createErrorResponse('User has not opted in to SMS notifications', 403, cors);
      }
    }

    // Send SMS via Twilio
    const result = await sendSMSViaTwilio(validation.formatted!, message);
    
    // Log delivery attempt
    const { data: deliveryLog } = await admin
      .from('sms_delivery_logs')
      .insert({
        notification_id: notificationId,
        user_id: userId,
        phone_number: validation.formatted,
        message_body: message,
        provider: 'twilio',
        provider_message_id: result.messageId,
        status: result.success ? 'sent' : 'failed',
        error_message: result.error,
        cost_amount: result.cost,
        segments: result.segments
      })
      .select()
      .single();

    if (result.success) {
      return new Response(
        JSON.stringify({ 
          success: true,
          messageId: result.messageId,
          deliveryLogId: deliveryLog?.id,
          cost: result.cost,
          segments: result.segments
        }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    } else {
      return createErrorResponse(result.error || 'Failed to send SMS', 500, cors);
    }
  } catch (error: any) {
    return createErrorResponse(`Error sending SMS: ${error.message}`, 500, cors);
  }
}

// Handle bulk SMS sending
async function handleSendBulkSMS(params: any, cors: Record<string, string>) {
  try {
    const { recipients, message, templateId, campaignId } = params;
    const results: any[] = [];
    let totalCost = 0;
    let successCount = 0;
    let failureCount = 0;

    // Get template if specified
    let messageTemplate = message;
    if (templateId) {
      const { data: template } = await admin
        .from('sms_templates')
        .select('message_template')
        .eq('id', templateId)
        .single();
      
      if (template) {
        messageTemplate = template.message_template;
      }
    }

    // Process each recipient
    for (const recipient of recipients) {
      try {
        const validation = validatePhoneNumber(recipient.phoneNumber);
        if (!validation.isValid) {
          results.push({
            phoneNumber: recipient.phoneNumber,
            success: false,
            error: 'Invalid phone number format'
          });
          failureCount++;
          continue;
        }

        // Check opt-in status
        if (recipient.userId) {
          const { data: phone } = await admin
            .from('user_phone_numbers')
            .select('sms_opt_in')
            .eq('user_id', recipient.userId)
            .eq('phone_number', validation.formatted)
            .maybeSingle();
          
          if (phone && !phone.sms_opt_in) {
            results.push({
              phoneNumber: recipient.phoneNumber,
              success: false,
              error: 'User not opted in'
            });
            failureCount++;
            continue;
          }
        }

        // Process template variables
        const processedMessage = processTemplate(messageTemplate, recipient.variables || {});

        // Send SMS
        const result = await sendSMSViaTwilio(validation.formatted!, processedMessage);
        
        // Log delivery
        await admin
          .from('sms_delivery_logs')
          .insert({
            user_id: recipient.userId,
            phone_number: validation.formatted,
            message_body: processedMessage,
            provider: 'twilio',
            provider_message_id: result.messageId,
            status: result.success ? 'sent' : 'failed',
            error_message: result.error,
            cost_amount: result.cost,
            segments: result.segments,
            metadata: { campaign_id: campaignId, bulk_send: true }
          });

        results.push({
          phoneNumber: recipient.phoneNumber,
          success: result.success,
          messageId: result.messageId,
          error: result.error,
          cost: result.cost
        });

        if (result.success) {
          successCount++;
          totalCost += result.cost || 0;
        } else {
          failureCount++;
        }

        // Add delay between sends to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        results.push({
          phoneNumber: recipient.phoneNumber,
          success: false,
          error: error.message
        });
        failureCount++;
      }
    }

    // Update campaign stats if campaignId provided
    if (campaignId) {
      await admin
        .from('sms_campaigns')
        .update({
          messages_sent: successCount,
          messages_failed: failureCount,
          campaign_cost: totalCost,
          status: 'sent'
        })
        .eq('id', campaignId);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        results,
        summary: {
          total: recipients.length,
          successful: successCount,
          failed: failureCount,
          totalCost
        }
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return createErrorResponse(`Error sending bulk SMS: ${error.message}`, 500, cors);
  }
}

// Handle template-based SMS
async function handleSendTemplate(params: any, cors: Record<string, string>) {
  try {
    const { phoneNumber, templateKey, variables, userId } = params;
    
    // Get template
    const { data: template } = await admin
      .from('sms_templates')
      .select('message_template')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .single();
    
    if (!template) {
      return createErrorResponse('Template not found', 404, cors);
    }

    const processedMessage = processTemplate(template.message_template, variables || {});

    // Use regular SMS sending logic
    return await handleSendSMS({
      phoneNumber,
      message: processedMessage,
      userId
    }, cors);
  } catch (error: any) {
    return createErrorResponse(`Error sending template SMS: ${error.message}`, 500, cors);
  }
}

// Handle phone number validation
async function handleValidatePhone(params: any, cors: Record<string, string>) {
  try {
    const { phoneNumber } = params;
    const validation = validatePhoneNumber(phoneNumber);
    
    return new Response(
      JSON.stringify({
        isValid: validation.isValid,
        formatted: validation.formatted,
        error: validation.error
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return createErrorResponse(`Error validating phone: ${error.message}`, 500, cors);
  }
}

// Handle SMS opt-in
async function handleOptIn(params: any, cors: Record<string, string>) {
  try {
    const { phoneNumber, userId } = params;
    
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      return createErrorResponse('Invalid phone number', 400, cors);
    }

    // Upsert phone number record
    await admin
      .from('user_phone_numbers')
      .upsert({
        user_id: userId,
        phone_number: validation.formatted,
        sms_opt_in: true,
        sms_opt_in_date: new Date().toISOString(),
        is_verified: true
      }, { onConflict: 'user_id,phone_number' });

    // Log consent
    await admin
      .from('sms_consent_tracking')
      .insert({
        user_id: userId,
        phone_number: validation.formatted,
        consent_type: 'opt_in',
        consent_method: 'api'
      });

    return new Response(
      JSON.stringify({ success: true, message: 'User opted in successfully' }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return createErrorResponse(`Error opting in user: ${error.message}`, 500, cors);
  }
}

// Handle SMS opt-out
async function handleOptOut(params: any, cors: Record<string, string>) {
  try {
    const { phoneNumber, userId } = params;
    
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      return createErrorResponse('Invalid phone number', 400, cors);
    }

    // Update phone number record
    await admin
      .from('user_phone_numbers')
      .update({
        sms_opt_in: false,
        sms_opt_out_date: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('phone_number', validation.formatted);

    // Log consent
    await admin
      .from('sms_consent_tracking')
      .insert({
        user_id: userId,
        phone_number: validation.formatted,
        consent_type: 'opt_out',
        consent_method: 'api'
      });

    return new Response(
      JSON.stringify({ success: true, message: 'User opted out successfully' }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return createErrorResponse(`Error opting out user: ${error.message}`, 500, cors);
  }
}

// Handle test SMS
async function handleTestSMS(params: any, cors: Record<string, string>) {
  try {
    const { phoneNumber } = params;
    
    return await handleSendSMS({
      ...params,
      message: `Test SMS from ${new URL(supabaseUrl).hostname} at ${new Date().toLocaleTimeString()}`
    }, cors);
  } catch (error: any) {
    return createErrorResponse(`Error sending test SMS: ${error.message}`, 500, cors);
  }
}

// Handle Twilio delivery status webhooks
async function handleTwilioWebhook(req: Request, cors: Record<string, string>) {
  try {
    console.log('[SMS Webhook] Processing Twilio delivery status');
    
    const formData = await req.formData();
    const messageSid = formData.get('MessageSid')?.toString();
    const messageStatus = formData.get('MessageStatus')?.toString();
    const errorCode = formData.get('ErrorCode')?.toString();
    const errorMessage = formData.get('ErrorMessage')?.toString();

    if (!messageSid) {
      return createErrorResponse('Missing MessageSid', 400, cors);
    }

    // Update delivery log
    const { data: updated } = await admin
      .from('sms_delivery_logs')
      .update({
        delivery_status: messageStatus,
        delivery_timestamp: new Date().toISOString(),
        error_message: errorMessage,
        metadata: {
          twilio_status: messageStatus,
          error_code: errorCode
        }
      })
      .eq('provider_message_id', messageSid)
      .select();

    console.log(`[SMS Webhook] Updated ${updated?.length || 0} delivery logs for ${messageSid}`);

    return new Response('OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error: any) {
    console.error('[SMS Webhook] Error:', error);
    return new Response('Error processing webhook', { status: 500 });
  }
}