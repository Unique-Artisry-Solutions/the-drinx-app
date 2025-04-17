
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  // Handle CORS preflight requests
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

async function handleCreateNotification(params: NotificationData) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Get user's notification preferences
  const { data: preferences } = await supabaseClient
    .from('notification_preferences')
    .select('*')
    .eq('user_id', params.recipientId)
    .eq('category_id', params.categoryId)
    .single()

  // Create in-app notification
  const { data, error } = await supabaseClient
    .from('notifications')
    .insert({
      recipient_id: params.recipientId,
      title: params.title,
      content: params.content,
      priority: params.priority || 'medium',
      category_id: params.categoryId,
      metadata: params.metadata || {}
    })
    .select()
    .single()

  if (error) throw error

  // Handle email notifications if enabled
  if (preferences?.channels?.includes('email')) {
    // Here you would integrate with your email service
    console.log('Email notification should be sent:', params)
  }

  // Handle push notifications if enabled
  if (preferences?.channels?.includes('push')) {
    // Here you would integrate with your push notification service
    console.log('Push notification should be sent:', params)
  }

  return new Response(
    JSON.stringify({ data }),
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
