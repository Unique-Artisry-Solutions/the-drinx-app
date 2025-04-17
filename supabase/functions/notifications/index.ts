
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateNotificationParams {
  recipientId: string;
  categoryId?: string;
  title: string;
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

interface UpdateNotificationParams {
  notificationId: string;
  isRead?: boolean;
}

interface GetNotificationsParams {
  userId: string;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

interface UpdatePreferencesParams {
  userId: string;
  categoryId: string;
  isEnabled: boolean;
  channels: string[];
}

serve(async (req) => {
  const supabaseClient = createClient(
    "https://dvifibvzwunnpcsihpxq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWZpYnZ6d3VubnBjc2locHhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNzM4MDcsImV4cCI6MjA1ODg0OTgwN30.8nsPh_YwHjoFDJ2_IMQY9tkM9NHVLmu6oFf5Tnwa2FA"
  )

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, params } = await req.json()

    switch (action) {
      case 'createNotification':
        return await handleCreateNotification(supabaseClient, params)
      case 'updateNotification':
        return await handleUpdateNotification(supabaseClient, params)
      case 'getNotifications':
        return await handleGetNotifications(supabaseClient, params)
      case 'updatePreferences':
        return await handleUpdatePreferences(supabaseClient, params)
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

async function handleCreateNotification(supabaseClient, params: CreateNotificationParams) {
  const { data, error } = await supabaseClient
    .from('notifications')
    .insert({
      recipient_id: params.recipientId,
      category_id: params.categoryId,
      title: params.title,
      content: params.content,
      priority: params.priority || 'medium',
      metadata: params.metadata || {}
    })
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

async function handleUpdateNotification(supabaseClient, params: UpdateNotificationParams) {
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

async function handleGetNotifications(supabaseClient, params: GetNotificationsParams) {
  let query = supabaseClient
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

  if (params.isRead !== undefined) {
    query = query.eq('is_read', params.isRead)
  }

  if (params.limit) {
    query = query.limit(params.limit)
  }

  if (params.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) throw error

  return new Response(
    JSON.stringify({ data }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  )
}

async function handleUpdatePreferences(supabaseClient, params: UpdatePreferencesParams) {
  const { data, error } = await supabaseClient
    .from('notification_preferences')
    .upsert({
      user_id: params.userId,
      category_id: params.categoryId,
      is_enabled: params.isEnabled,
      channels: params.channels
    })
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
