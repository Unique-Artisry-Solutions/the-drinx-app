import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RewardAnalyticsData {
  establishment_id: string;
  total_points_earned: number;
  total_points_redeemed: number;
  active_users: number;
  avg_transaction_value: number;
  period_start: string;
  period_end: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create authenticated supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message)
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { action } = await req.json()

    switch (action) {
      case 'getRewardAnalytics': {
        console.log('Fetching reward analytics for user:', user.id)
        
        // Call the admin-protected RPC function
        const { data: analyticsData, error: analyticsError } = await supabaseClient
          .rpc('get_reward_analytics')
        
        if (analyticsError) {
          console.error('Failed to fetch reward analytics:', analyticsError.message)
          
          // Check if it's an access denied error
          if (analyticsError.message.includes('Access denied') || 
              analyticsError.message.includes('Admin privileges required')) {
            return new Response(
              JSON.stringify({ error: 'Admin privileges required' }),
              { 
                status: 403, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
          
          return new Response(
            JSON.stringify({ error: 'Failed to fetch analytics data' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log(`Successfully fetched ${analyticsData?.length || 0} analytics records`)
        
        return new Response(
          JSON.stringify({ data: analyticsData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'refreshMaterializedViews': {
        console.log('Refreshing materialized views for user:', user.id)
        
        // Call the admin-protected refresh function
        const { error: refreshError } = await supabaseClient
          .rpc('refresh_reward_analytics_materialized')
        
        if (refreshError) {
          console.error('Failed to refresh materialized views:', refreshError.message)
          
          if (refreshError.message.includes('Access denied') || 
              refreshError.message.includes('Admin privileges required')) {
            return new Response(
              JSON.stringify({ error: 'Admin privileges required' }),
              { 
                status: 403, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }
          
          return new Response(
            JSON.stringify({ error: 'Failed to refresh materialized views' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        console.log('Materialized views refreshed successfully')
        
        return new Response(
          JSON.stringify({ success: true, message: 'Materialized views refreshed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'checkAccess': {
        // Try to call the analytics function to check if user has access
        const { error: accessError } = await supabaseClient
          .rpc('get_reward_analytics')
        
        const hasAccess = !accessError || 
          (!accessError.message.includes('Access denied') && 
           !accessError.message.includes('Admin privileges required'))
        
        return new Response(
          JSON.stringify({ hasAccess }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }

  } catch (error) {
    console.error('Unexpected error in secure-analytics function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})