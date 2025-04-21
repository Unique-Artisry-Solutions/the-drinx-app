
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

webpush.setVapidDetails(
  'mailto:' + Deno.env.get('VAPID_MAILTO'),
  Deno.env.get('VAPID_PUBLIC_KEY') || '',
  Deno.env.get('VAPID_PRIVATE_KEY') || ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, params } = await req.json()

    switch (action) {
      case 'getVapidKey':
        return new Response(
          JSON.stringify({ publicKey: Deno.env.get('VAPID_PUBLIC_KEY') }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      case 'createNotification':
        return await handleCreateNotification(params)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

async function handleCreateNotification(params: NotificationData) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Get user's notification preferences and profile
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

  // Create in-app notification
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

  let deliveryStatus = {};

  // Handle push notifications if enabled
  if (preferences?.channels?.includes('push')) {
    try {
      const { data: subscriptions } = await supabaseClient
        .from('push_notification_subscriptions')
        .select('*')
        .eq('user_id', params.recipientId);

      if (subscriptions) {
        for (const sub of subscriptions) {
          try {
            await webpush.sendNotification({
              endpoint: sub.endpoint,
              keys: {
                p256dh: atob(sub.p256dh),
                auth: atob(sub.auth)
              }
            }, JSON.stringify({
              title: params.title,
              content: params.content,
              id: notification.id,
              metadata: params.metadata
            }));

            deliveryStatus = {
              ...deliveryStatus,
              push: { success: true, timestamp: new Date().toISOString() }
            };

          } catch (error) {
            console.error('Push notification failed:', error);
            if (error.statusCode === 410 || error.statusCode === 404) {
              await supabaseClient
                .from('push_notification_subscriptions')
                .delete()
                .eq('id', sub.id);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
      deliveryStatus = {
        ...deliveryStatus,
        push: { success: false, error: error.message, timestamp: new Date().toISOString() }
      };
    }
  }

  // Update notification with delivery status
  await supabaseClient
    .from('notifications')
    .update({
      delivery_status: deliveryStatus,
      delivery_attempts: notification.delivery_attempts + 1
    })
    .eq('id', notification.id);

  return new Response(
    JSON.stringify({ data: notification }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

interface NotificationData {
  recipientId: string;
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  categoryId?: string;
  metadata?: Record<string, any>;
}
