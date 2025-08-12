
/* eslint-disable @typescript-eslint/no-explicit-any */
// Supabase Edge Function: seed-dev-data
// Actions:
// - health: quick status check
// - seed_personas: creates core dev users + profiles + roles (+ establishment)
// - seed_all: runs personas + establishments + cocktails + reviews + rewards + analytics
// - cleanup: clears dev-seeded data (and optionally deletes personas)
//
// Security:
// - Requires `x-seed-admin-token` header to match SEED_ADMIN_TOKEN
//
// Notes:
// - Uses service role key to perform admin operations safely
// - Relies on existing SQL functions for bulk seeding where available

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-seed-admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
// Support new secret name SERVICE_ROLE_KEY with fallback to SUPABASE_SERVICE_ROLE_KEY
const SERVICE_KEY = Deno.env.get('SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const SEED_ADMIN_TOKEN = Deno.env.get('SEED_ADMIN_TOKEN');

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Utilities
const json = (body: any, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { ...init, headers: { ...corsHeaders, ...(init.headers || {}) } });

const unauthorized = (message = 'Unauthorized') => json({ error: message }, { status: 401 });
const badRequest = (message: string) => json({ error: message }, { status: 400 });
const ok = (data: any) => json({ ok: true, ...data });

type Persona = {
  email: string;
  password: string;
  user_type: 'admin' | 'establishment' | 'individual' | 'promoter';
  username: string;
  name: string;
  phone: string;
};

const DEFAULT_PERSONAS: Persona[] = [
  {
    email: 'admin+dev@spiritless.com',
    password: 'Password123!',
    user_type: 'admin',
    username: 'devadmin',
    name: 'Dev Admin',
    phone: '+1555010001',
  },
  {
    email: 'establishment+dev@spiritless.com',
    password: 'Password123!',
    user_type: 'establishment',
    username: 'devestab',
    name: 'Dev Establishment',
    phone: '+1555010002',
  },
  {
    email: 'individual+dev@spiritless.com',
    password: 'Password123!',
    user_type: 'individual',
    username: 'devuser',
    name: 'Dev Individual',
    phone: '+1555010003',
  },
  {
    email: 'promoter+dev@spiritless.com',
    password: 'Password123!',
    user_type: 'promoter',
    username: 'devpromoter',
    name: 'Dev Promoter',
    phone: '+1555010004',
  },
];

async function findUserByEmail(email: string) {
  // Fallback to listing users to find by email (admin API lacks direct get-by-email)
  // We'll scan a few pages to locate the user if they already exist.
  const perPage = 100;
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < perPage) break;
  }
  return null;
}

async function getOrCreatePersona(p: Persona) {
  // Try to create; if already exists, fetch it
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: p.email,
    password: p.password,
    email_confirm: true,
    user_metadata: {
      user_type: p.user_type,
      username: p.username,
      name: p.name,
      phone: p.phone,
    },
  });

  let user = created?.user || null;
  if (createErr) {
    // Likely already exists — find by email
    const existing = await findUserByEmail(p.email);
    user = existing;
  }

  if (!user) {
    throw new Error(`Unable to create or find user for ${p.email}`);
  }

  // Upsert profile
  await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        username: p.username,
        display_name: p.name,
        user_type: p.user_type,
        phone: p.phone,
      },
      { onConflict: 'id' }
    );

  // Upsert user role (unique on user_id,role)
// Map 'admin' persona to a valid user_roles.role (use 'individual') while keeping profiles.user_type = 'admin'
const roleForUserRoles = p.user_type === 'admin' ? 'individual' : p.user_type;
const { error: roleErr } = await supabase
  .from('user_roles')
  .upsert(
    {
      user_id: user.id,
      role: roleForUserRoles,
      is_active: p.user_type === 'admin', // make admin active by default
    },
    { onConflict: 'user_id,role' }
  );
if (roleErr) {
  throw new Error(`Role upsert failed for ${p.email}: ${roleErr.message}`);
}

  // If establishment user, ensure at least one establishment exists for them
  if (p.user_type === 'establishment') {
    await supabase.rpc('seed_establishments', {
      p_owner_ids: [user.id],
      p_count: 1,
      p_seed_run_id: null,
    });
  }

  return user.id;
}

async function actionSeedPersonas(custom?: Partial<Persona>[]) {
  const personas: Persona[] =
    (custom && custom.length ? custom : DEFAULT_PERSONAS).map((x) => ({
      ...x,
      // enforce lowercase types for consistency
      user_type: x.user_type as Persona['user_type'],
    }));

  const results: { email: string; user_id: string }[] = [];
  for (const p of personas) {
    const id = await getOrCreatePersona(p);
    results.push({ email: p.email, user_id: id });
  }
  return ok({ personas: results });
}

async function actionSeedAll() {
  // 1) Ensure personas exist
  const personasResult = await actionSeedPersonas();
  const personas = (await personasResult.json()) as any; // Not accessible here; we returned Response. Recompute ids.

  // Re-fetch IDs for known persona emails
  const personaEmails = DEFAULT_PERSONAS.map((p) => p.email);
  const users = await Promise.all(personaEmails.map((e) => findUserByEmail(e)));
  const ids = users.filter(Boolean).map((u: any) => u.id) as string[];

  const establishmentUser = await findUserByEmail('establishment+dev@spiritless.com');
  const ownerId = establishmentUser?.id as string | undefined;

  // 2) Seed establishments
  let establishmentIds: string[] = [];
  if (ownerId) {
    const { data: estIds, error: estErr } = await supabase.rpc('seed_establishments', {
      p_owner_ids: [ownerId],
      p_count: 12,
      p_seed_run_id: null,
    });
    if (estErr) throw estErr;
    establishmentIds = estIds || [];
  }

  // 3) Seed cocktails for establishments
  let cocktailIds: string[] = [];
  if (establishmentIds.length > 0) {
    const { data: cocktails, error: cocktailsErr } = await supabase.rpc('seed_cocktails_for_establishments', {
      p_establishment_ids: establishmentIds,
      p_min_per: 3,
      p_max_per: 6,
      p_seed_run_id: null,
    });
    if (cocktailsErr) throw cocktailsErr;
    cocktailIds = cocktails || [];
  }

  // 4) Seed reviews
  let totalReviews = 0;
  if (ids.length > 0 && cocktailIds.length > 0) {
    const { data: reviewsCount, error: reviewsErr } = await supabase.rpc('seed_reviews', {
      p_user_ids: ids,
      p_cocktail_ids: cocktailIds,
      p_total: 120,
      p_seed_run_id: null,
    });
    if (reviewsErr) throw reviewsErr;
    totalReviews = reviewsCount || 0;
  }

  // 5) Seed rewards activity
  let rewardsSummary: any = null;
  if (ids.length > 0) {
    const { data: rewards, error: rewardsErr } = await supabase.rpc('seed_rewards_activity', {
      p_user_ids: ids,
      p_establishment_ids: establishmentIds.length ? establishmentIds : null,
      p_events_per_user: 6,
      p_seed_run_id: null,
    });
    if (rewardsErr) throw rewardsErr;
    rewardsSummary = rewards;
  }

  // 6) Seed analytics
  let analyticsSummary: any = null;
  if (ids.length > 0) {
    const { data: analytics, error: analyticsErr } = await supabase.rpc('seed_analytics', {
      p_user_ids: ids,
      p_event_ids: null,
      p_days: 30,
      p_seed_run_id: null,
    });
    if (analyticsErr) throw analyticsErr;
    analyticsSummary = analytics;
  }

  return ok({
    users: ids.length,
    establishments: establishmentIds.length,
    cocktails: cocktailIds.length,
    reviews_created: totalReviews,
    rewards_summary: rewardsSummary,
    analytics_summary: analyticsSummary,
  });
}

async function actionCleanup(params: { remove_users?: boolean } = {}) {
  // Clear dev-seeded records tracked by seed functions
  const { data: cleared, error: clearErr } = await supabase.rpc('clear_dev_seed', { p_seed_run_id: null });
  if (clearErr) throw clearErr;

  let removedUsers = 0;
  if (params.remove_users) {
    for (const p of DEFAULT_PERSONAS) {
      const u = await findUserByEmail(p.email);
      if (u?.id) {
        await supabase.auth.admin.deleteUser(u.id);
        removedUsers++;
      }
    }
  }

  return ok({ cleared, removed_users: removedUsers });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check admin token
  const token = req.headers.get('x-seed-admin-token');
  if (!SEED_ADMIN_TOKEN || token !== SEED_ADMIN_TOKEN) {
    return unauthorized('Missing or invalid x-seed-admin-token');
  }

  // Validate service role key presence early for clearer errors
  if (!SERVICE_KEY) {
    return json({ error: 'Missing service role key. Add SERVICE_ROLE_KEY (recommended) or SUPABASE_SERVICE_ROLE_KEY in Edge Function secrets.' }, { status: 500 });
  }

  let payload: { action?: string; params?: any } = {};
  try {
    payload = await req.json();
  } catch {
    // no body is fine (e.g., health)
  }

  const action = payload.action || 'health';

  try {
    switch (action) {
      case 'health':
        return ok({ status: 'ok' });
      case 'seed_personas':
        return await actionSeedPersonas(payload.params?.personas);
      case 'seed_all':
        return await actionSeedAll();
      case 'cleanup':
        return await actionCleanup(payload.params || {});
      default:
        return badRequest(`Unknown action: ${action}`);
    }
  } catch (err: any) {
    console.error('seed-dev-data error:', err);
    return json({ error: err?.message || 'Internal Error' }, { status: 500 });
  }
});
