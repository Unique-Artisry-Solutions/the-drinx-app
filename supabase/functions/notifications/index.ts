import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0"
import webpush from 'https://esm.sh/web-push@3.6.6'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationData {
  recipientId: string;
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  categoryId?: string;
  metadata?: Record<string, any>;
}

interface UpdateNotificationParams {
  notificationId: string;
  isRead?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, params } = await req.json()

    switch (action) {
      case 'createNotification':
        return await handleCreateNotification(params)
      case 'updateNotification':
        return await handleUpdateNotification(params)
      case 'getNotifications':
        return await handleGetNotifications(params)
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

webpush.setVapidDetails(
  'mailto:' + Deno.env.get('VAPID_MAILTO'),
  Deno.env.get('VAPID_PUBLIC_KEY') || '',
  Deno.env.get('VAPID_PRIVATE_KEY') || ''
);

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

  // Handle email notifications if enabled
  if (preferences?.channels?.includes('email') && userProfile?.email) {
    try {
      await resend.emails.send({
        from: 'notifications@yourdomain.com',
        to: userProfile.email,
        subject: params.title,
        html: `
          <h2>${params.title}</h2>
          <p>${params.content}</p>
          ${params.metadata?.actionUrl ? `<p><a href="${params.metadata.actionUrl}">Take Action</a></p>` : ''}
        `,
      });

      deliveryStatus = {
        ...deliveryStatus,
        email: { success: true, timestamp: new Date().toISOString() }
      };
    } catch (error) {
      console.error('Error sending email:', error);
      deliveryStatus = {
        ...deliveryStatus,
        email: { success: false, error: error.message, timestamp: new Date().toISOString() }
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

  // Log delivery attempt
  await supabaseClient
    .from('notification_delivery_logs')
    .insert({
      notification_id: notification.id,
      delivery_type: Object.keys(deliveryStatus).join(','),
      status: Object.values(deliveryStatus).every((d: any) => d.success) ? 'success' : 'partial_failure',
      error_message: Object.values(deliveryStatus)
        .filter((d: any) => !d.success)
        .map((d: any) => d.error)
        .join(', ') || null
    });

  return new Response(
    JSON.stringify({ data: notification }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

async function handleUpdateNotification(params: UpdateNotificationParams) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data, error } = await supabaseClient
    .from('notifications')
    .update({ is_read: params.isRead })
    .eq('id', params.notificationId)
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ data }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

async function handleGetNotifications(params: { userId: string }) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  const { data, error } = await supabaseClient
    .from('notifications')
    .select(`
      *,
      notification_categories (
        name,
        description
      )
    `)
    .eq('recipient_id', params.userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return new Response(
    JSON.stringify({ data }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}
