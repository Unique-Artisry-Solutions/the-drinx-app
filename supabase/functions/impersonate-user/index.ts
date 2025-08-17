import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  target_user_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { target_user_id }: RequestBody = await req.json()
    
    if (!target_user_id) {
      return new Response(
        JSON.stringify({ error: 'target_user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Impersonation request for user: ${target_user_id}`)

    // Get current request origin to determine the correct redirect URL
    // Prioritize lovable.app domain to stay within the same browser context
    const origin = req.headers.get('origin') || req.headers.get('referer')
    let redirectTo = 'https://f6fbe853-0047-490f-9d7f-c7bab9534659.lovableproject.com'
    
    if (origin) {
      try {
        const url = new URL(origin)
        // If the origin is from lovable.app (preview environment), use it directly
        if (url.hostname.includes('lovable.app')) {
          redirectTo = url.origin
          console.log(`Using lovable.app domain for impersonation: ${redirectTo}`)
        } else {
          // For other domains, still use the origin but log for debugging
          redirectTo = url.origin
          console.log(`Using origin-based redirect: ${redirectTo}`)
        }
      } catch (e) {
        console.log(`Failed to parse origin, using default: ${redirectTo}`)
      }
    } else {
      console.log(`No origin header found, using default redirect: ${redirectTo}`)
    }

    // Verify the target user exists
    const { data: targetUser, error: userError } = await supabaseClient.auth.admin.getUserById(target_user_id)
    
    if (userError || !targetUser.user) {
      console.error('User lookup error:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found or inaccessible' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Target user found: ${targetUser.user.email}`)

    // Generate magic link for the target user
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email!,
      options: {
        redirectTo: redirectTo
      }
    })

    if (error) {
      console.error('Magic link generation error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate impersonation link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Magic link generated successfully for ${targetUser.user.email}`)
    console.log(`Redirect URL: ${redirectTo}`)

    return new Response(
      JSON.stringify({ 
        action_link: data.properties?.action_link,
        redirect_to: redirectTo,
        target_email: targetUser.user.email 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Impersonation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})