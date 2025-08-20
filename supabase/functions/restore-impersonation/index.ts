import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RestoreRequest {
  admin_user_id: string;
  admin_email?: string;
  fallback_method?: 'direct_auth' | 'magic_link' | 'session_refresh';
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

    const { admin_user_id, admin_email, fallback_method = 'magic_link' }: RestoreRequest = await req.json()
    
    console.log('🔄 Restoring impersonation for admin:', {
      admin_user_id,
      admin_email,
      fallback_method,
      timestamp: new Date().toISOString()
    })

    // Verify admin user exists and get current state
    const { data: adminUser, error: userError } = await supabaseClient.auth.admin.getUserById(admin_user_id)
    
    if (userError || !adminUser.user) {
      console.error('❌ Admin user not found:', userError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Admin user not found',
          fallback_available: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    console.log('✅ Admin user verified:', {
      id: adminUser.user.id,
      email: adminUser.user.email,
      last_sign_in: adminUser.user.last_sign_in_at
    })

    // Determine redirect URL based on request origin
    const origin = req.headers.get('origin') || req.headers.get('referer')
    let redirectTo = 'https://dvifibvzwunnpcsihpxq.supabase.co'
    
    if (origin) {
      const originUrl = new URL(origin)
      const isLovableApp = originUrl.hostname.includes('lovable.app')
      const isLovableProject = originUrl.hostname.includes('lovableproject.com')
      const isSandboxDev = originUrl.hostname.includes('sandbox.lovable.dev')
      
      if (isLovableApp || isLovableProject || isSandboxDev) {
        redirectTo = origin
      }
    }

    console.log('🌐 Determined redirect URL:', {
      origin,
      redirectTo,
      method: fallback_method
    })

    // Multiple restoration methods for reliability
    let restorationResult = null
    let errors = []

    // Method 1: Magic Link (Primary)
    if (fallback_method === 'magic_link' || fallback_method === 'direct_auth') {
      try {
        console.log('🔗 Attempting magic link restoration...')
        const { data: linkData, error: linkError } = await supabaseClient.auth.admin.generateLink({
          type: 'magiclink',
          email: adminUser.user.email!,
          options: {
            redirectTo: `${redirectTo}/admin/users`
          }
        })

        if (linkError) {
          console.error('❌ Magic link generation failed:', linkError)
          errors.push({ method: 'magic_link', error: linkError.message })
        } else {
          console.log('✅ Magic link generated successfully')
          restorationResult = {
            method: 'magic_link',
            action_link: linkData.properties?.action_link,
            redirect_to: redirectTo,
            admin_email: adminUser.user.email
          }
        }
      } catch (error) {
        console.error('❌ Magic link method failed:', error)
        errors.push({ method: 'magic_link', error: error.message })
      }
    }

    // Method 2: Session Refresh (Fallback)
    if (!restorationResult && (fallback_method === 'session_refresh' || errors.length > 0)) {
      try {
        console.log('🔄 Attempting session refresh restoration...')
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.admin.generateLink({
          type: 'recovery',
          email: adminUser.user.email!,
          options: {
            redirectTo: `${redirectTo}/admin/users`
          }
        })

        if (sessionError) {
          console.error('❌ Session refresh failed:', sessionError)
          errors.push({ method: 'session_refresh', error: sessionError.message })
        } else {
          console.log('✅ Session refresh link generated')
          restorationResult = {
            method: 'session_refresh',
            action_link: sessionData.properties?.action_link,
            redirect_to: redirectTo,
            admin_email: adminUser.user.email
          }
        }
      } catch (error) {
        console.error('❌ Session refresh method failed:', error)
        errors.push({ method: 'session_refresh', error: error.message })
      }
    }

    // Log restoration attempt for audit trail
    try {
      await supabaseClient.from('security_event_logs').insert({
        event_type: 'impersonation_restore',
        user_id: admin_user_id,
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown',
        details: {
          success: !!restorationResult,
          method: restorationResult?.method || 'failed',
          errors: errors,
          redirect_to: redirectTo,
          timestamp: new Date().toISOString()
        }
      })
    } catch (auditError) {
      console.warn('⚠️ Failed to log restoration attempt:', auditError)
    }

    if (restorationResult) {
      console.log('✅ Impersonation restoration successful:', {
        method: restorationResult.method,
        hasActionLink: !!restorationResult.action_link
      })

      return new Response(
        JSON.stringify({
          success: true,
          ...restorationResult,
          fallback_methods_available: ['magic_link', 'session_refresh'],
          manual_fallback_url: `${redirectTo}/admin/users`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.error('❌ All restoration methods failed:', errors)
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'All restoration methods failed',
          errors: errors,
          manual_fallback_url: `${redirectTo}/admin/users`,
          instructions: 'Please navigate to the admin panel manually and log in again'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Restoration function error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        manual_fallback_url: '/admin/users',
        instructions: 'Please navigate to the admin panel manually'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})