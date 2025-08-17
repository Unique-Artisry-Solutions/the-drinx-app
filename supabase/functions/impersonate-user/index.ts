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
    // CRITICAL: Ensure consistent domain to prevent cross-domain token loss
    const origin = req.headers.get('origin') || req.headers.get('referer')
    const userAgent = req.headers.get('user-agent') || ''
    
    // CRITICAL: Always use lovable.app domain for magic links to prevent cross-domain issues
    let redirectTo = 'https://id-preview--f6fbe853-0047-490f-9d7f-c7bab9534659.lovable.app'
    
    console.log(`🔍 Impersonation domain detection:`, {
      origin,
      userAgent: userAgent.substring(0, 100) + '...',
      allHeaders: Object.fromEntries(req.headers.entries())
    })
    
    if (origin) {
      try {
        const url = new URL(origin)
        console.log(`🌐 Parsed origin URL:`, {
          hostname: url.hostname,
          origin: url.origin,
          isLovableApp: url.hostname.includes('lovable.app'),
          isLovableProject: url.hostname.includes('lovableproject.com')
        })
        
        // CRITICAL: Always use lovable.app for consistent domain behavior
        if (url.hostname.includes('lovable.app')) {
          redirectTo = url.origin
          console.log(`✅ Using lovable.app domain for impersonation: ${redirectTo}`)
        } else {
          // For any other domain (including lovableproject.com), force lovable.app
          console.log(`🔄 Forcing lovable.app redirect from ${url.hostname} to prevent cross-domain token loss`)
          // redirectTo already set to lovable.app default
        }
      } catch (e) {
        console.error(`❌ Failed to parse origin: ${e}`)
        console.log(`Using default lovable.app redirect: ${redirectTo}`)
      }
    } else {
      console.log(`⚠️  No origin header found, using default lovable.app redirect: ${redirectTo}`)
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

    // Extract domain from the magic link for validation
    const magicLinkUrl = data.properties?.action_link || ''
    const linkDomain = magicLinkUrl ? new URL(magicLinkUrl).hostname : 'unknown'
    
    return new Response(
      JSON.stringify({ 
        hasActionLink: !!data.properties?.action_link,
        actionLink: data.properties?.action_link,
        redirectTo: redirectTo,
        targetEmail: targetUser.user.email,
        linkDomain: linkDomain
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