import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper: map persona "type" to a valid user_role enum
// We keep profiles.user_type as provided (including 'admin'), but user_roles.role must be one of the enum values.
function toValidUserRole(
  personaType: 'individual' | 'establishment' | 'promoter' | 'admin'
): 'individual' | 'establishment' | 'promoter' {
  return personaType === 'admin' ? 'individual' : personaType;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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
              display_name: persona.name,
              user_type: persona.type
            }
          })

          if (createError) {
            throw new Error(`Failed to create user ${persona.email}: ${createError.message}`)
          }

          userId = newUser.user.id
          console.log(`Created new user ${persona.email} with ID: ${userId}`)
        }

        await upsertPersonaArtifacts({
          email: persona.email,
          username: persona.username,
          name: persona.name,
          type: persona.type,
          userId
        })

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

async function upsertPersonaArtifacts(p: {
  email: string;
  username?: string;
  name?: string;
  type: 'individual' | 'establishment' | 'promoter' | 'admin';
  userId: string;
}) {
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

  // 1) Upsert profile: keep user_type = p.type (including 'admin'), but fail fast on error
  const { error: profileErr } = await supabaseClient
    .from('profiles')
    .upsert(
      {
        id: p.userId,
        username: p.username ?? p.email.split('@')[0],
        display_name: p.name ?? p.email,
        user_type: p.type,
      },
      { onConflict: 'id' }
    );

  if (profileErr) {
    console.error('Profile upsert error for', p.email, profileErr);
    throw new Error(`Profile upsert failed for ${p.email}: ${profileErr.message}`);
  }

  // 2) Upsert user_roles with a valid enum role (map 'admin' -> 'individual')
  const mappedRole = toValidUserRole(p.type);
  const { error: roleErr } = await supabaseClient
    .from('user_roles')
    .upsert(
      {
        user_id: p.userId,
        role: mappedRole,
        is_active: true,
      },
      { onConflict: 'user_id,role' }
    );

  if (roleErr) {
    console.error('User role upsert error for', p.email, roleErr);
    throw new Error(`User role upsert failed for ${p.email}: ${roleErr.message}`);
  }

  console.log(`Seeded persona: ${p.email} (type: ${p.type}, role: ${mappedRole})`);
}
