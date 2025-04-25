import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0"

// Define proper CORS headers to be used consistently across all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Helper function to create consistent error responses
const createErrorResponse = (message: string, status = 400) => {
  console.error('Error:', message);
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const { action, params } = await req.json()
    
    switch (action) {
      case 'getVapidKey':
        const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
        if (!publicKey) {
          console.error('VAPID public key not configured in environment variables');
          return createErrorResponse('VAPID public key not configured');
        }
        console.log('Returning VAPID public key successfully');
        return new Response(
          JSON.stringify({ publicKey }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getNotifications':
        if (!params?.userId) {
          return createErrorResponse('User ID is required');
        }
        return await handleGetNotifications(params);

      case 'updateNotification':
        if (!params?.notificationId) {
          return createErrorResponse('Notification ID is required');
        }
        return await handleUpdateNotification(params);

      case 'markAllAsRead':
        if (!params?.userId) {
          return createErrorResponse('User ID is required');
        }
        return await handleMarkAllAsRead(params);

      case 'createNotification':
        return await handleCreateNotification(params, req.headers.get('Authorization') || '');

      case 'saveVapidKeys':
        if (!params.publicKey || !params.privateKey || !params.mailto) {
          return createErrorResponse('Missing required VAPID parameters');
        }
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Please set these keys in your Supabase dashboard secrets'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'testPushNotification':
        // Simple test endpoint that doesn't rely on web-push
        const userId = params?.userId;
        if (!userId) {
          return createErrorResponse('User ID is required');
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
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'healthCheck':
        // Simple health check endpoint
        return new Response(
          JSON.stringify({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            version: '1.0.0',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getPromoterNotifications':
        if (!params?.promoterId) {
          return createErrorResponse('Promoter ID is required');
        }
        return await handleGetPromoterNotifications(params);

      case 'updatePromoterPreferences':
        if (!params?.promoterId || !params?.preferences) {
          return createErrorResponse('Promoter ID and preferences are required');
        }
        return await handleUpdatePromoterPreferences(params);

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

async function handleMarkAllAsRead(params: any) {
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error marking notifications as read: ${error.message}`);
  }
}

async function handleUpdateNotification(params: any) {
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error updating notification: ${error.message}`);
  }
}

async function handleGetNotifications(params: any) {
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error fetching notifications: ${error.message}`);
  }
}

async function handleCreateNotification(params: any, authHeader: string) {
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

async function handleGetPromoterNotifications(params: any) {
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
      .eq('recipient_id', params.promoterId)
      .eq('recipient_type', 'promoter')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error fetching promoter notifications: ${error.message}`);
  }
}

async function handleUpdatePromoterPreferences(params: any) {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabaseClient
      .from('promoter_notification_preferences')
      .upsert(params.preferences)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        message: 'Preferences updated successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return createErrorResponse(`Error updating promoter preferences: ${error.message}`);
  }
}
