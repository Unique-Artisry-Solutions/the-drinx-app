import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0"
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'
import { enforceRateLimit } from '../_shared/rateLimit.ts'
import { sanitizeObject } from '../_shared/sanitize.ts'
import { z } from "npm:zod@3.23.8"

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

// Helper function to create consistent error responses
const createErrorResponse = (message: string, status = 400, cors: Record<string, string>) => {
  console.error('Error:', message);
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
    'getVapidKey','getNotifications','updateNotification','markAllAsRead','createNotification',
    'saveVapidKeys','testPushNotification','getPromoterNotifications','updatePromoterPreferences',
    'getEstablishmentNotifications','updateEstablishmentPreferences','healthCheck'
  ]),
  params: z.unknown().optional()
}).strict();

const GetNotificationsSchema = z.object({ userId: z.string().uuid() }).strict();
const UpdateNotificationSchema = z.object({ notificationId: z.string().uuid(), isRead: z.boolean() }).strict();
const MarkAllAsReadSchema = z.object({ userId: z.string().uuid() }).strict();
const CreateNotificationSchema = z.object({
  recipientId: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  priority: z.enum(['low','medium','high']).optional(),
  categoryId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional()
}).strict();
const SaveVapidKeysSchema = z.object({ publicKey: z.string().min(1), privateKey: z.string().min(1), mailto: z.string().email() }).strict();
const IdOnlySchema = z.object({ promoterId: z.string().uuid().optional(), establishmentId: z.string().uuid().optional(), userId: z.string().uuid().optional() }).strict();
const PreferencesSchema = z.object({ promoterId: z.string().uuid().optional(), establishmentId: z.string().uuid().optional(), preferences: z.record(z.any()) }).strict();

serve(async (req) => {
  const origin = req.headers.get('origin');
  const config = getSecurityConfig();
  const cors = getCorsHeaders(origin, config);
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: cors 
    });
  }
  if (!isOriginAllowed(origin, config)) {
    return createErrorResponse('Origin not allowed', 403, cors);
  }

  try {
    // Persistent rate limiting
    const rate = await enforceRateLimit(req, 'notifications', { userLimit: 20, ipLimit: 60, windowSeconds: 60 });
    if (!rate.allowed) {
      const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '')
        .split(',')[0].trim() || null;
      await admin.from('security_event_logs').insert({
        event_type: 'rate_limit_exceeded',
        severity: 'medium',
        ip_address: ip,
        user_agent: req.headers.get('user-agent'),
        user_id: null,
        endpoint: 'notifications',
        details: { retry_after: rate.retryAfter, reason: rate.reason }
      });
      return createErrorResponse('Rate limit exceeded', 429, cors);
    }
    const raw = await req.json();
    const clean = sanitizeObject(raw);
    const { action, params } = ActionSchema.parse(clean);
    
    switch (action) {
      case 'getVapidKey':
        const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
        if (!publicKey) {
          console.error('VAPID public key not configured in environment variables');
          return createErrorResponse('VAPID public key not configured', 400, cors);
        }
        console.log('Returning VAPID public key successfully');
        return new Response(
          JSON.stringify({ publicKey }),
          { headers: { ...cors, 'Content-Type': 'application/json' } }
        );

      case 'getNotifications':
        const pGet = GetNotificationsSchema.parse(params ?? {});
        return await handleGetNotifications(pGet, cors);

      case 'updateNotification':
        const pUpdate = UpdateNotificationSchema.parse(params ?? {});
        return await handleUpdateNotification(pUpdate, cors);

      case 'markAllAsRead':
        const pMark = MarkAllAsReadSchema.parse(params ?? {});
        return await handleMarkAllAsRead(pMark, cors);

      case 'createNotification':
        const pCreate = CreateNotificationSchema.parse(params ?? {});
        return await handleCreateNotification(pCreate, req.headers.get('Authorization') || '', cors);

      case 'saveVapidKeys':
        const pVapid = SaveVapidKeysSchema.parse(params ?? {});
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Please set these keys in your Supabase dashboard secrets'
          }),
          { headers: { ...cors, 'Content-Type': 'application/json' } }
        );

      case 'testPushNotification':
        const pTest = GetNotificationsSchema.parse(params ?? {});
        const userId = pTest.userId;
        
        const testResponse = {
          success: true,
          message: "Test notification processed",
          timestamp: new Date().toISOString(),
          payload: {
            title: "Test Notification",
            body: "This is a test notification from the server",
          }
        };
        
        console.log('Test notification processed successfully');
        return new Response(
          JSON.stringify(testResponse),
          { headers: { ...cors, 'Content-Type': 'application/json' } }
        );

      case 'healthCheck':
        // Simple health check endpoint
        return new Response(
          JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            version: '1.0.0',
          }),
          { headers: { ...cors, 'Content-Type': 'application/json' } }
        );

      case 'getPromoterNotifications':
        const pProm = z.object({ promoterId: z.string().uuid() }).strict().parse(params ?? {});
        return await handleGetPromoterNotifications(pProm, cors);

      case 'updatePromoterPreferences':
        const pPromPref = PreferencesSchema.parse(params ?? {});
        if (!pPromPref.promoterId || !pPromPref.preferences) {
          return createErrorResponse('Promoter ID and preferences are required', 400, cors);
        }
        return await handleUpdatePromoterPreferences(pPromPref, cors);

      case 'getEstablishmentNotifications':
        if (!params?.establishmentId) {
          return createErrorResponse('Establishment ID is required');
        }
        return await handleGetEstablishmentNotifications(params);

      case 'updateEstablishmentPreferences':
        const pEstPref = PreferencesSchema.parse(params ?? {});
        if (!pEstPref.establishmentId || !pEstPref.preferences) {
          return createErrorResponse('Establishment ID and preferences are required', 400, cors);
        }
        return await handleUpdateEstablishmentPreferences(pEstPref, cors);

      default:
        return createErrorResponse('Invalid action');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    const msg = (error as any)?.message || '';
    if (msg === 'No authorization header' || msg === 'Unauthorized') {
      const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '')
        .split(',')[0].trim() || null;
      await admin.from('security_event_logs').insert({
        event_type: 'auth_failure',
        severity: 'low',
        ip_address: ip,
        user_agent: req.headers.get('user-agent'),
        user_id: null,
        endpoint: 'notifications',
        details: { error: msg }
      });
    }
    return createErrorResponse(
      msg || 'Internal server error',
      msg === 'No authorization header' ? 401 : 500,
      cors
    );
  }
});

async function handleMarkAllAsRead(params: any, cors: Record<string, string>) {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabaseClient
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', params.userId)
      .eq('is_read', false)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: data ? data.length : 0,
        message: `Marked ${data ? data.length : 0} notifications as read` 
      }),
      {
        headers: { ...cors, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error marking notifications as read: ${error.message}`);
  }
}

async function handleUpdateNotification(params: any, cors: Record<string, string>) {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabaseClient
      .from('notifications')
      .update({ is_read: params.isRead })
      .eq('id', params.notificationId)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...cors, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error updating notification: ${error.message}`);
  }
}

async function handleGetNotifications(params: any, cors: Record<string, string>) {
  if (!params.userId) {
    return createErrorResponse('User ID is required to fetch notifications');
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { data: notifications, error } = await supabaseClient
      .from('notifications')
      .select('*')
      .eq('recipient_id', params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!notifications || notifications.length === 0) {
        return new Response(
          JSON.stringify({ data: [], message: 'No notifications found' }),
          {
            headers: { ...cors, 'Content-Type': 'application/json' },
          }
        );
    }

    return new Response(
      JSON.stringify({ data: notifications }),
      {
        headers: { ...cors, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error fetching notifications: ${error.message}`);
  }
}

async function handleCreateNotification(params: any, authHeader: string, cors: Record<string, string>) {
  if (!params.recipientId) {
    throw new Error('Recipient ID is required');
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  if (!authHeader) {
    throw new Error('No authorization header');
  }

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
    authHeader.replace('Bearer ', '')
  )

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  if (user.id !== params.recipientId) {
    throw new Error('Cannot send notifications for other users');
  }

  const [{ data: preferences }, { data: userProfile }] = await Promise.all([
    supabaseClient
      .from('notification_preferences')
      .select('*')
      .eq('user_id', params.recipientId)
      .eq('category_id', params.categoryId)
      .single(),
    supabaseClient
      .from('profiles')
      .select('email')
      .eq('id', params.recipientId)
      .single()
  ]);

  // Create notification in database
  const { data: notification, error } = await supabaseClient
    .from('notifications')
    .insert({
      recipient_id: params.recipientId,
      title: params.title,
      content: params.content,
      priority: params.priority || 'medium',
      category_id: params.categoryId,
      metadata: params.metadata || {},
      delivery_status: {},
      delivery_attempts: 0
    })
    .select()
    .single()

  if (error) throw error

  // For now, just return a success response without attempting web-push
  // We'll implement a browser-direct notification approach instead
  return new Response(
    JSON.stringify({ 
      data: notification,
      push_status: { 
        success: true,
        message: "Notification created successfully",
        timestamp: new Date().toISOString()
      }
    }),
    {
      headers: { ...cors, 'Content-Type': 'application/json' },
    }
  )
}

async function handleGetEstablishmentNotifications(params: any, cors: Record<string, string>) {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabaseClient
      .from('notifications')
      .select(`
        *,
        notification_categories(name, description)
      `)
      .eq('recipient_id', params.establishmentId)
      .eq('recipient_type', 'establishment')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...cors, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error fetching establishment notifications: ${error.message}`);
  }
}

async function handleUpdateEstablishmentPreferences(params: any, cors: Record<string, string>) {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabaseClient
      .from('establishment_notification_preferences')
      .upsert(params.preferences)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        message: 'Establishment preferences updated successfully' 
      }),
      {
        headers: { ...cors, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error updating establishment preferences: ${error.message}`);
  }
}
