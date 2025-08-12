import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-seed-admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
}

// Helper: map persona "type" to a valid user_role enum
// We keep profiles.user_type as provided (including 'admin'), but user_roles.role must be one of the enum values.
function toValidUserRole(
  personaType: 'individual' | 'establishment' | 'promoter' | 'admin'
): 'individual' | 'establishment' | 'promoter' {
  return personaType === 'admin' ? 'individual' : personaType;
}

serve(async (req) => {
  // Basic request logging for CORS/debug
  console.log(`[seed-dev-data] method=${req.method} origin=${req.headers.get('origin') || 'no-origin'}`)
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Optional admin token enforcement: if SEED_ADMIN_TOKEN is set, require matching header
    const requiredToken = Deno.env.get('SEED_ADMIN_TOKEN') || '';
    const providedToken = req.headers.get('x-seed-admin-token') || '';
    if (requiredToken && providedToken !== requiredToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Define test personas
    const personas = [
      {
        email: 'admin@spiritless.com',
        password: 'admin123',
        username: 'admin',
        name: 'System Admin',
        type: 'admin' as const
      },
      {
        email: 'user@spiritless.com',
        password: 'user123',
        username: 'testuser',
        name: 'Test User',
        type: 'individual' as const
      },
      {
        email: 'establishment@spiritless.com',
        password: 'establishment123',
        username: 'testestablishment',
        name: 'Test Establishment',
        type: 'establishment' as const
      },
      {
        email: 'promoter@spiritless.com',
        password: 'promoter123',
        username: 'testpromoter',
        name: 'Test Promoter',
        type: 'promoter' as const
      }
    ]

    const results = []

    for (const persona of personas) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabaseClient.auth.admin.listUsers()
        const userExists = existingUser.users.find(u => u.email === persona.email)

        let userId: string

        if (userExists) {
          userId = userExists.id
          console.log(`User ${persona.email} already exists with ID: ${userId}`)
        } else {
          // Create new user
          const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
            email: persona.email,
            password: persona.password,
            email_confirm: true,
            user_metadata: {
              username: persona.username,
              name: persona.name,
              user_type: persona.type
            }
          })

          if (createError) {
            throw new Error(`Failed to create user ${persona.email}: ${createError.message}`)
          }

          userId = newUser.user.id
          console.log(`Created new user ${persona.email} with ID: ${userId}`)
        }

        // Profile and user_roles are now handled by DB trigger (public.handle_new_user)
        // No manual upsert needed here

        // Ensure establishment exists for establishment persona
        if (persona.type === 'establishment') {
          const { data: existingEst } = await supabaseClient
            .from('establishments')
            .select('id')
            .eq('owner_id', userId)
            .maybeSingle();

          if (!existingEst) {
            const { error: estInsertErr } = await supabaseClient
              .from('establishments')
              .insert({
                name: persona.name || 'Seed Establishment',
                owner_id: userId,
                address: '123 Seed St, Test City',
                latitude: 40.72,
                longitude: -74.00,
                cocktail_count: 0,
                phone: '+1-555-0110',
                website: 'https://seed-establishment.dev'
              });
            if (estInsertErr) {
              console.error('Establishment insert error:', estInsertErr);
            }
          }
        }
        results.push({
          email: persona.email,
          type: persona.type,
          status: 'success',
          userId
        })

      } catch (error) {
        console.error(`Error processing persona ${persona.email}:`, error)
        results.push({
          email: persona.email,
          type: persona.type,
          status: 'error',
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Dev data seeding completed',
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Seeding error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// (removed) Manual profile/role upsert. Relying on signup trigger to create profile
// and assign a valid user_role automatically based on user_metadata.user_type.

