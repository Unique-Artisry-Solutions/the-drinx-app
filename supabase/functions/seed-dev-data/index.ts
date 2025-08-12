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

    // Parse action from request body
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }
    const action: 'health' | 'seed_personas' | 'seed_all' | 'cleanup' = body?.action ?? 'seed_personas';

    // Define test personas
    const personas = [
      {
        email: 'admin@spiritless.com',
        password: 'admin123',
        username: 'admin',
        name: 'System Admin',
        type: 'admin' as const,
      },
      {
        email: 'user@spiritless.com',
        password: 'user123',
        username: 'testuser',
        name: 'Test User',
        type: 'individual' as const,
      },
      {
        email: 'establishment@spiritless.com',
        password: 'establishment123',
        username: 'testestablishment',
        name: 'Test Establishment',
        type: 'establishment' as const,
      },
      {
        email: 'promoter@spiritless.com',
        password: 'promoter123',
        username: 'testpromoter',
        name: 'Test Promoter',
        type: 'promoter' as const,
      },
    ];

    // Helper to seed personas (idempotent)
    const seedPersonas = async () => {
      const results: Array<{ email: string; type: string; status: string; userId?: string; error?: string }>= [];
      const idsByType: Record<string, string> = {};

      const { data: list } = await supabaseClient.auth.admin.listUsers();

      for (const persona of personas) {
        try {
          const existing = list?.users?.find((u) => u.email === persona.email);
          let userId: string;
          if (existing) {
            userId = existing.id;
            console.log(`[seed] user exists ${persona.email} -> ${userId}`);
          } else {
            const { data: created, error: createErr } = await supabaseClient.auth.admin.createUser({
              email: persona.email,
              password: persona.password,
              email_confirm: true,
              user_metadata: {
                username: persona.username,
                name: persona.name,
                user_type: persona.type,
              },
            });
            if (createErr) throw new Error(createErr.message);
            userId = created.user.id;
            console.log(`[seed] created user ${persona.email} -> ${userId}`);
          }

          // Ensure establishment exists for establishment persona
          if (persona.type === 'establishment') {
            const { data: existingEst } = await supabaseClient
              .from('establishments')
              .select('id')
              .eq('owner_id', userId)
              .maybeSingle();
            if (!existingEst) {
              const { error: estErr } = await supabaseClient.from('establishments').insert({
                name: persona.name || 'Seed Establishment',
                owner_id: userId,
                address: '123 Seed St, Test City',
                latitude: 40.72,
                longitude: -74.0,
                cocktail_count: 0,
                phone: '+1-555-0110',
                website: 'https://seed-establishment.dev',
              });
              if (estErr) console.error('[seed] establishment insert error', estErr);
            }
          }

          results.push({ email: persona.email, type: persona.type, status: 'success', userId });
          idsByType[persona.type] = userId;
        } catch (e: any) {
          console.error(`[seed] persona error ${persona.email}`, e);
          results.push({ email: persona.email, type: persona.type, status: 'error', error: e?.message || 'error' });
        }
      }

      return { results, idsByType };
    };

    // Health check
    if (action === 'health') {
      const { count, error } = await supabaseClient
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      if (error) console.warn('[seed] health profiles count error', error);
      return new Response(
        JSON.stringify({ ok: true, service: 'seed-dev-data', profiles_count: count ?? 0, message: 'healthy' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      );
    }

    // Cleanup all previously seeded rows tracked in dev_seed_records
    if (action === 'cleanup') {
      const { data, error } = await supabaseClient.rpc('clear_dev_seed', { p_seed_run_id: null });
      if (error) {
        return new Response(
          JSON.stringify({ success: false, action, error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
        );
      }
      return new Response(
        JSON.stringify({ success: true, action, result: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      );
    }

    // Seed personas only
    if (action === 'seed_personas') {
      const { results } = await seedPersonas();
      return new Response(
        JSON.stringify({ success: true, message: 'Personas seeded', results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      );
    }

    // Seed everything (personas + sample data)
    if (action === 'seed_all') {
      const { results, idsByType } = await seedPersonas();

      // Start a seed run to track created rows for easy cleanup
      const { data: run, error: runErr } = await supabaseClient
        .from('dev_seed_registry')
        .insert({ params: { action: 'seed_all' } })
        .select('id')
        .single();
      if (runErr) {
        console.error('[seed] failed to create seed run', runErr);
      }
      const seedRunId: string | null = run?.id ?? null;

      const summary: Record<string, unknown> = { seedRunId };

      // 1) Establishments
      const ownerIds: string[] = idsByType['establishment'] ? [idsByType['establishment']] : [];
      let establishmentIds: string[] = [];
      if (ownerIds.length > 0) {
        const { data: estIds, error: estErr } = await supabaseClient.rpc('seed_establishments', {
          p_owner_ids: ownerIds,
          p_count: 12,
          p_seed_run_id: seedRunId,
        });
        if (estErr) {
          console.error('[seed] seed_establishments error', estErr);
        } else if (Array.isArray(estIds)) {
          establishmentIds = estIds as string[];
          summary.establishments = establishmentIds.length;
        }
      }

      // 2) Cocktails
      let cocktailIds: string[] = [];
      if (establishmentIds.length > 0) {
        const { data: cIds, error: cErr } = await supabaseClient.rpc('seed_cocktails_for_establishments', {
          p_establishment_ids: establishmentIds,
          p_min_per: 3,
          p_max_per: 6,
          p_seed_run_id: seedRunId,
        });
        if (cErr) {
          console.error('[seed] seed_cocktails_for_establishments error', cErr);
        } else if (Array.isArray(cIds)) {
          cocktailIds = cIds as string[];
          summary.cocktails = cocktailIds.length;
        }
      }

      // 3) Reviews
      const reviewerIds = [idsByType['individual'], idsByType['promoter']].filter(Boolean) as string[];
      if (reviewerIds.length > 0 && cocktailIds.length > 0) {
        const { data: reviewCount, error: rErr } = await supabaseClient.rpc('seed_reviews', {
          p_user_ids: reviewerIds,
          p_cocktail_ids: cocktailIds,
          p_total: 80,
          p_seed_run_id: seedRunId,
        });
        if (rErr) {
          console.error('[seed] seed_reviews error', rErr);
        } else {
          summary.reviews = reviewCount ?? 0;
        }
      }

      // 4) Rewards activity
      if (reviewerIds.length > 0) {
        const { data: rewardsData, error: rwErr } = await supabaseClient.rpc('seed_rewards_activity', {
          p_user_ids: reviewerIds,
          p_establishment_ids: establishmentIds,
          p_events_per_user: 6,
          p_seed_run_id: seedRunId,
        });
        if (rwErr) {
          console.error('[seed] seed_rewards_activity error', rwErr);
        } else {
          summary.rewards = rewardsData ?? {};
        }
      }

      // 5) Analytics
      const analyticsUsers = [idsByType['individual'], idsByType['promoter'], idsByType['admin']].filter(Boolean) as string[];
      if (analyticsUsers.length > 0) {
        const { data: analyticsData, error: aErr } = await supabaseClient.rpc('seed_analytics', {
          p_user_ids: analyticsUsers,
          p_days: 30,
          p_seed_run_id: seedRunId,
        });
        if (aErr) {
          console.error('[seed] seed_analytics error', aErr);
        } else {
          summary.analytics = analyticsData ?? {};
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Seed all completed', personas: results, summary }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
      );
    }

    // Default fallback
    return new Response(
      JSON.stringify({ success: false, error: 'Unknown action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    );

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

