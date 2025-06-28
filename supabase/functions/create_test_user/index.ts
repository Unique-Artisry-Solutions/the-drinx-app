
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, userType, displayName } = await req.json()

    // Create the user
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      throw authError
    }

    const userId = authData.user.id

    // Create profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: userId,
        email,
        display_name: displayName || email.split('@')[0],
        username: email.split('@')[0],
        user_type: userType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
