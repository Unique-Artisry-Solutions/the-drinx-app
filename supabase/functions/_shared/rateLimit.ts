// Persistent Rate Limiting utilities (Supabase-based)
// Applies per-IP and per-user limits with simple fixed window strategy

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface RateLimitOptions {
  windowSeconds?: number;
  userLimit: number;
  ipLimit: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number; // seconds
  reason?: 'ip' | 'user';
}

function getIp(req: Request): string {
  const raw = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
  const ip = raw.split(',')[0].trim()
  return ip || 'unknown';
}

async function getUserIdFromRequest(req: Request): Promise<string | null> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
      auth: { persistSession: false }
    })
    const { data } = await authClient.auth.getUser()
    return data.user?.id ?? null
  } catch {
    return null
  }
}

function getWindowKey(windowSeconds: number): { key: string; windowStart: Date; retryAfterSec: number } {
  const nowMs = Date.now()
  const ws = windowSeconds * 1000
  const bucket = Math.floor(nowMs / ws)
  const windowStart = new Date(bucket * ws)
  const nextReset = (bucket + 1) * ws
  return { key: `${windowSeconds}:${bucket}`, windowStart, retryAfterSec: Math.ceil((nextReset - nowMs) / 1000) }
}

export async function enforceRateLimit(req: Request, endpoint: string, opts: RateLimitOptions): Promise<RateLimitResult> {
  const { windowSeconds = 60, userLimit, ipLimit } = opts
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

  const ip = getIp(req)
  const userId = await getUserIdFromRequest(req)
  const { key: windowKey, windowStart, retryAfterSec } = getWindowKey(windowSeconds)

  // Helper to upsert/increment counter
  async function bumpCounter(params: { user_id: string | null; ip: string; limit: number }): Promise<{ count: number; limit: number }> {
    // Check existing
    const { data: existing } = await admin
      .from('security_rate_limits')
      .select('id,count,limit')
      .eq('endpoint', endpoint)
      .eq('ip', params.ip)
      .eq('window_key', windowKey)
      .eq('user_id', params.user_id)
      .maybeSingle()

    if (!existing) {
      const insertRes = await admin
        .from('security_rate_limits')
        .insert({
          endpoint,
          user_id: params.user_id,
          ip: params.ip,
          window_key: windowKey,
          window_start: windowStart.toISOString(),
          count: 1,
          limit: params.limit
        })
        .select('count,limit')
        .single()
      return { count: insertRes.data?.count ?? 1, limit: params.limit }
    } else {
      const newCount = (existing.count ?? 0) + 1
      const updateRes = await admin
        .from('security_rate_limits')
        .update({ count: newCount })
        .eq('id', existing.id)
        .select('count,limit')
        .single()
      return { count: updateRes.data?.count ?? newCount, limit: updateRes.data?.limit ?? params.limit }
    }
  }

  // IP-based
  const ipRes = await bumpCounter({ user_id: null, ip, limit: ipLimit })
  if (ipRes.count > ipRes.limit) {
    await admin.from('security_rate_limit_violations').insert({
      endpoint,
      user_id: userId,
      ip,
      count: ipRes.count,
      limit: ipRes.limit,
      metadata: { type: 'ip', windowSeconds }
    })
    return { allowed: false, retryAfter: retryAfterSec, reason: 'ip' }
  }

  // User-based (only if user present)
  if (userId) {
    const userRes = await bumpCounter({ user_id: userId, ip, limit: userLimit })
    if (userRes.count > userRes.limit) {
      await admin.from('security_rate_limit_violations').insert({
        endpoint,
        user_id: userId,
        ip,
        count: userRes.count,
        limit: userRes.limit,
        metadata: { type: 'user', windowSeconds }
      })
      return { allowed: false, retryAfter: retryAfterSec, reason: 'user' }
    }
  }

  return { allowed: true }
}
