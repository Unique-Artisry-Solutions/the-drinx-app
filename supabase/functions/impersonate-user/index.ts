import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'

interface RequestBody {
  target_user_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  const origin = req.headers.get('origin')
  const securityConfig = getSecurityConfig('production')
  const secureHeaders = getCorsHeaders(origin, securityConfig)
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: secureHeaders })
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
        { status: 400, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Impersonation request for user: ${target_user_id}`)

    // Get current request origin to determine the correct redirect URL
    // CRITICAL: Use EXACT same domain as request origin to prevent cross-domain token loss
    const origin = req.headers.get('origin') || req.headers.get('referer')
    const userAgent = req.headers.get('user-agent') || ''
    
    // Default fallback (should rarely be used)
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
          isLovableProject: url.hostname.includes('lovableproject.com'),
          isSandboxDev: url.hostname.includes('sandbox.lovable.dev')
        })
        
        // CRITICAL: Use the EXACT same domain format as the request origin
        // This prevents cross-domain redirects that cause token loss
        if (url.hostname.includes('lovable.app') || 
            url.hostname.includes('lovableproject.com') || 
            url.hostname.includes('sandbox.lovable.dev')) {
          redirectTo = url.origin
          console.log(`✅ Using exact origin domain for impersonation: ${redirectTo}`)
        } else {
          console.log(`⚠️  Unknown domain ${url.hostname}, using fallback: ${redirectTo}`)
        }
      } catch (e) {
        console.error(`❌ Failed to parse origin: ${e}`)
        console.log(`Using fallback redirect: ${redirectTo}`)
      }
    } else {
      console.log(`⚠️  No origin header found, using fallback redirect: ${redirectTo}`)
    }

    // Verify the target user exists
    const { data: targetUser, error: userError } = await supabaseClient.auth.admin.getUserById(target_user_id)
    
    if (userError || !targetUser.user) {
      console.error('User lookup error:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found or inaccessible' }),
        { status: 404, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Target user found: ${targetUser.user.email}`)

    // Generate magic link for the target user with establishment dashboard redirect
    const establishmentRedirectTo = `${redirectTo}/establishment/dashboard`
    console.log(`🔗 Generating magic link with redirect: ${establishmentRedirectTo}`)
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email!,
      options: {
        redirectTo: establishmentRedirectTo
      }
    })

    if (error) {
      console.error('❌ Magic link generation error:', error)
      console.log('❌ Supabase client configuration:', {
        url: Deno.env.get('SUPABASE_URL') ? 'SET' : 'MISSING',
        serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? 'SET' : 'MISSING'
      })
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate impersonation link',
          details: error.message,
          supabaseConfig: {
            url: !!Deno.env.get('SUPABASE_URL'),
            serviceKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
          }
        }),
        { status: 500, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const actionLink = data.properties?.action_link
    console.log(`✅ Magic link generation result:`, {
      hasActionLink: !!actionLink,
      actionLinkLength: actionLink ? actionLink.length : 0,
      redirectTo: redirectTo,
      dataKeys: Object.keys(data),
      propertiesKeys: data.properties ? Object.keys(data.properties) : 'NO_PROPERTIES'
    })

    if (!actionLink) {
      console.error('❌ No action link in response data:', data)
      return new Response(
        JSON.stringify({ 
          error: 'Magic link generation failed - no action link returned',
          debugData: data
        }),
        { status: 500, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`✅ Magic link generated successfully for ${targetUser.user.email}`)
    console.log(`🔗 Action link: ${actionLink.substring(0, 100)}...`)

    // Extract domain from the magic link for validation
    const linkDomain = new URL(actionLink).hostname
    
    return new Response(
      JSON.stringify({ 
        hasActionLink: true,
        action_link: actionLink,
        redirect_to: establishmentRedirectTo,
        target_email: targetUser.user.email,
        linkDomain: linkDomain,
        target_user_id: target_user_id
      }),
      { 
        status: 200,
        headers: { ...secureHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Impersonation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
    )
  }
})