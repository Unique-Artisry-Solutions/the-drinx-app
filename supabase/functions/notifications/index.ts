
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0"
import webPush from "https://esm.sh/web-push@3.6.6"

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

  let pushDeliveryStatus = { 
    success: false, 
    error: null, 
    timestamp: new Date().toISOString() 
  };

  try {
    const { data: subscriptions, error: subError } = await supabaseClient
      .from('push_notification_subscriptions')
      .select('*')
      .eq('user_id', params.recipientId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (subError) throw subError;
    
    if (!subscriptions || subscriptions.length === 0) {
      throw new Error('No push subscription found for user');
    }
    
    const subscription = subscriptions[0];
    
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidMailto = Deno.env.get('VAPID_MAILTO') || 'mailto:test@example.com';
    
    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('VAPID keys not configured:', { 
        publicKeyExists: !!vapidPublicKey,
        privateKeyExists: !!vapidPrivateKey
      });
      throw new Error('VAPID keys not configured');
    }

    webPush.setVapidDetails(vapidMailto, vapidPublicKey, vapidPrivateKey);
    
    const p256dhBuffer = Uint8Array.from(atob(subscription.p256dh), c => c.charCodeAt(0));
    const authBuffer = Uint8Array.from(atob(subscription.auth), c => c.charCodeAt(0));
    
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: Buffer.from(p256dhBuffer).toString('base64'),
        auth: Buffer.from(authBuffer).toString('base64')
      }
    };
    
    const pushPayload = JSON.stringify({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      priority: notification.priority,
      metadata: notification.metadata,
      created_at: notification.created_at
    });
    
    await webPush.sendNotification(pushSubscription, pushPayload);
    
    pushDeliveryStatus = { 
      success: true, 
      timestamp: new Date().toISOString() 
    };
    
    console.log('Push notification sent successfully');
  } catch (pushError) {
    console.error('Error sending push notification:', pushError);
    pushDeliveryStatus.error = pushError.message || 'Unknown error sending push notification';
  }

  await supabaseClient
    .from('notifications')
    .update({
      delivery_status: { push: pushDeliveryStatus },
      delivery_attempts: notification.delivery_attempts + 1
    })
    .eq('id', notification.id);

  return new Response(
    JSON.stringify({ 
      data: notification,
      push_status: pushDeliveryStatus
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}
