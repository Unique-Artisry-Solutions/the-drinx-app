
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Set up CORS headers for browser clients
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get the request body
  let body
  try {
    body = await req.json()
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Extract feature name from request
  const { featureName, userId } = body

  if (!featureName) {
    return new Response(JSON.stringify({ error: 'Feature name is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      // Use full URL from environment variable
      Deno.env.get('SUPABASE_URL') ?? '',
      // Use service role key for admin access
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from auth context if no userId is provided
    let targetUserId = userId
    if (!targetUserId) {
      // Get user ID from auth context
      const {
        data: { user },
      } = await supabaseClient.auth.getUser()
      targetUserId = user?.id
    }

    // If still no user ID, return false (not authorized)
    if (!targetUserId) {
      return new Response(JSON.stringify({ hasAccess: false }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Call the database function to check feature access
    const { data, error } = await supabaseClient.rpc('check_feature_access', {
      p_feature_name: featureName,
      p_user_id: targetUserId,
    })

    if (error) {
      console.error('Error checking feature access:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Log access for auditing
    console.log(`Feature access check: ${featureName} for user ${targetUserId}: ${data}`)

    // Track this feature access attempt
    try {
      const { data: featureData } = await supabaseClient
        .from('feature_flags')
        .select('id')
        .eq('name', featureName)
        .single()

      if (featureData?.id) {
        await supabaseClient.from('feature_metrics').insert({
          feature_id: featureData.id,
          user_id: targetUserId,
          event_type: 'access_check',
          event_data: { 
            authorized: !!data,
            source: 'edge_function',
          },
        })
      }
    } catch (trackingError) {
      console.error('Error tracking feature access:', trackingError)
      // Don't fail the request if tracking fails
    }

    return new Response(JSON.stringify({ hasAccess: !!data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
