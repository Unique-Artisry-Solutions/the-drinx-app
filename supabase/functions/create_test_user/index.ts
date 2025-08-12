
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'

serve(async (req) => {
  const origin = req.headers.get('origin');
  const env = origin && (origin.includes('localhost') || origin.includes('127.0.0.1')) ? 'development' : 'production';
  const securityConfig = getSecurityConfig(env);
  const secureHeaders = getCorsHeaders(origin, securityConfig);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: secureHeaders })
  }

  if (!isOriginAllowed(origin, securityConfig)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: { ...secureHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, userType, displayName } = await req.json()

    // Create the user
    const localPart = (email || '').split('@')[0];
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        user_type: userType,
        name: displayName || localPart,
        username: localPart
      }
    })

    if (authError) {
      throw authError
    }

    const userId = authData.user.id

    // Profile creation handled by DB trigger (public.handle_new_user)

    // Create type-specific records
    if (userType === 'establishment') {
      const { error: estError } = await supabaseClient
        .from('establishments')
        .insert({
          id: userId,
          name: `Test ${displayName || 'Establishment'}`,
          description: 'Test establishment for MVP validation',
          address: '123 Test Street, Test City, TC 12345',
          phone: '555-0100',
          email: email,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (estError) {
        console.error('Establishment creation error:', estError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userId,
        message: `Test ${userType} user created successfully` 
      }),
      { 
        headers: { ...secureHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...secureHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
