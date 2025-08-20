import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'

interface RequestBody {
  target_user_id?: string;
  test_link?: boolean;
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

    const { target_user_id, test_link = false }: RequestBody = await req.json()
    
    console.log('Impersonation diagnostics started')
    
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      supabase_url: Deno.env.get('SUPABASE_URL'),
      request_origin: req.headers.get('origin'),
      request_referer: req.headers.get('referer'),
      environment: 'edge-function',
    }

    // Get current request origin to determine redirect URL
    const origin = req.headers.get('origin') || req.headers.get('referer')
    let redirectTo = 'https://f6fbe853-0047-490f-9d7f-c7bab9534659.lovableproject.com'
    
    if (origin) {
      try {
        const url = new URL(origin)
        redirectTo = url.origin
        diagnostics.detected_redirect_url = redirectTo
      } catch (e) {
        diagnostics.redirect_url_error = e.message
      }
    }
    
    diagnostics.calculated_redirect_url = redirectTo

    if (target_user_id) {
      console.log(`Checking user: ${target_user_id}`)
      
      // Check if user exists
      const { data: targetUser, error: userError } = await supabaseClient.auth.admin.getUserById(target_user_id)
      
      diagnostics.target_user = {
        id: target_user_id,
        exists: !userError && !!targetUser.user,
        email: targetUser.user?.email,
        error: userError?.message
      }

      if (test_link && targetUser.user?.email) {
        console.log('Testing magic link generation...')
        
        const { data: linkData, error: linkError } = await supabaseClient.auth.admin.generateLink({
          type: 'magiclink',
          email: targetUser.user.email,
          options: {
            redirectTo: redirectTo
          }
        })

        diagnostics.magic_link_test = {
          success: !linkError,
          error: linkError?.message,
          has_action_link: !!linkData?.properties?.action_link,
          redirect_configured: redirectTo
        }
      }
    }

    // Check auth settings (basic info)
    const { data: settings, error: settingsError } = await supabaseClient.auth.admin.listUsers()
    
    diagnostics.auth_admin_access = {
      success: !settingsError,
      error: settingsError?.message,
      user_count: settings?.users?.length ?? 0
    }

    console.log('Diagnostics completed:', diagnostics)

    return new Response(
      JSON.stringify(diagnostics),
      { 
        status: 200,
        headers: { ...secureHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Diagnostics error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Diagnostics failed',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { status: 500, headers: { ...secureHeaders, 'Content-Type': 'application/json' } }
    )
  }
})