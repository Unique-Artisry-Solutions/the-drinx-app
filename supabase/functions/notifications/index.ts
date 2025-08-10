import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0"
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'
import { enforceRateLimit } from '../_shared/rateLimit.ts'


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
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), { status: 429, headers: { ...cors, 'Content-Type': 'application/json', 'Retry-After': String(rate.retryAfter ?? 60) } });
    }
    const { action, params } = await req.json()
    
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
        if (!params?.userId) {
          return createErrorResponse('User ID is required', 400, cors);
        }
        return await handleGetNotifications(params, cors);

      case 'updateNotification':
        if (!params?.notificationId) {
          return createErrorResponse('Notification ID is required', 400, cors);
        }
        return await handleUpdateNotification(params, cors);

      case 'markAllAsRead':
        if (!params?.userId) {
          return createErrorResponse('User ID is required', 400, cors);
        }
        return await handleMarkAllAsRead(params, cors);

      case 'createNotification':
        return await handleCreateNotification(params, req.headers.get('Authorization') || '', cors);

      case 'saveVapidKeys':
        if (!params.publicKey || !params.privateKey || !params.mailto) {
          return createErrorResponse('Missing required VAPID parameters', 400, cors);
        }
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Please set these keys in your Supabase dashboard secrets'
          }),
          { headers: { ...cors, 'Content-Type': 'application/json' } }
        );

      case 'testPushNotification':
        // Simple test endpoint that doesn't rely on web-push
        const userId = params?.userId;
        if (!userId) {
          return createErrorResponse('User ID is required', 400, cors);
        }

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
        if (!params?.promoterId) {
          return createErrorResponse('Promoter ID is required', 400, cors);
        }
        return await handleGetPromoterNotifications(params, cors);

      case 'updatePromoterPreferences':
        if (!params?.promoterId || !params?.preferences) {
          return createErrorResponse('Promoter ID and preferences are required', 400, cors);
        }
        return await handleUpdatePromoterPreferences(params, cors);

      case 'getEstablishmentNotifications':
        if (!params?.establishmentId) {
          return createErrorResponse('Establishment ID is required');
        }
        return await handleGetEstablishmentNotifications(params);

      case 'updateEstablishmentPreferences':
        if (!params?.establishmentId || !params?.preferences) {
          return createErrorResponse('Establishment ID and preferences are required');
        }
        return await handleUpdateEstablishmentPreferences(params);

      default:
        return createErrorResponse('Invalid action');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse(
      error.message || 'Internal server error',
      error.message === 'No authorization header' ? 401 : 500
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
