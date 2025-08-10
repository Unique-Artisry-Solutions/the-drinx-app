// Shared logging utilities for Edge Functions (Deno)
// - HTTP request logging: http_request_logs
// - Payment audit logging: payment_audit_logs
// - Security events: security_event_logs

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Admin client (service role)
function getAdminClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

// Try to resolve user from Authorization header using anon auth client
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

function getIp(req: Request): string {
  const raw = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || ''
  const ip = raw.split(',')[0].trim()
  return ip || 'unknown'
}

function getUserAgent(req: Request): string | null {
  return req.headers.get('user-agent')
}

// Remove sensitive headers
function sanitizeHeaders(h: Headers): Record<string, string> {
  const redacted = new Set([
    'authorization',
    'cookie',
    'x-api-key',
    'x-supabase-key',
  ])
  const allowed: Record<string, string> = {}
  for (const [k, v] of h.entries()) {
    const key = k.toLowerCase()
    if (redacted.has(key)) continue
    allowed[key] = v
  }
  return allowed
}

// Summarize body JSON safely (drop secrets)
function summarizeBodyJson(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const obj = body as Record<string, unknown>
  const deny = new Set(['card', 'paymentMethod', 'paymentMethodId', 'client_secret', 'authorization', 'password', 'token', 'secret'])
  const summary: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (deny.has(k)) continue
    // only keep primitives and shallow objects/arrays with limited depth
    if (v === null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      summary[k] = v
    } else if (Array.isArray(v)) {
      summary[k] = '[array]'
    } else if (typeof v === 'object') {
      summary[k] = '[object]'
    }
  }
  return summary
}

// Hash helper to correlate payload without storing sensitive data
async function hashJson(value: unknown): Promise<string | null> {
  try {
    const str = JSON.stringify(value)
    const data = new TextEncoder().encode(str)
    const digest = await crypto.subtle.digest('SHA-256', data)
    const bytes = Array.from(new Uint8Array(digest))
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return null
  }
}

export type HttpLogContext = {
  requestId: string
  startMs: number
  ip: string
  userAgent: string | null
  userId: string | null
  functionName: string
}

export async function logHttpStart(req: Request, functionName: string): Promise<HttpLogContext> {
  const admin = getAdminClient()
  const url = new URL(req.url)
  const requestId = req.headers.get('x-request-id') ?? crypto.randomUUID()
  const ip = getIp(req)
  const userAgent = getUserAgent(req)
  const userId = await getUserIdFromRequest(req)
  const queryParams = Object.fromEntries(url.searchParams.entries())
  const requestHeaders = sanitizeHeaders(req.headers)

  // Safely attempt to read a clone of the JSON body (non-fatal if fails)
  let bodySummary: Record<string, unknown> | null = null
  let bodyHash: string | null = null
  try {
    const cloned = req.clone()
    const json = await cloned.json()
    bodySummary = summarizeBodyJson(json)
    bodyHash = await hashJson(json)
  } catch {
    // ignore parsing errors for non-JSON or empty bodies
  }

  await admin.from('http_request_logs').insert({
    request_id: requestId,
    function_name: functionName,
    method: req.method,
    path: url.pathname,
    query_params: queryParams,
    request_headers: requestHeaders,
    body_summary: bodySummary,
    body_hash: bodyHash,
    user_id: userId,
    ip_address: ip,
    user_agent: userAgent,
  })

  return {
    requestId,
    startMs: Date.now(),
    ip,
    userAgent,
    userId,
    functionName
  }
}

export async function logHttpEnd(ctx: HttpLogContext, statusCode: number, responseHeaders?: HeadersInit) {
  const admin = getAdminClient()
  const duration = Math.max(0, Date.now() - ctx.startMs)
  let headersObj: Record<string, string> | null = null
  if (responseHeaders) {
    try {
      const h = new Headers(responseHeaders as any)
      headersObj = sanitizeHeaders(h)
    } catch {
      headersObj = null
    }
  }
  await admin.from('http_request_logs')
    .update({
      status_code: statusCode,
      response_headers: headersObj,
      response_time_ms: duration
    })
    .eq('request_id', ctx.requestId)
}

type PaymentAuditParams = {
  requestId: string
  userId?: string | null
  ip?: string | null
  userAgent?: string | null
  paymentMethodId?: string | null
  amount?: number | null
  currency?: string | null
  status: 'initiated' | 'processing' | 'succeeded' | 'failed' | 'cancelled'
  errorCode?: string | null
  errorMessage?: string | null
  stripePaymentIntentId?: string | null
  processingTimeMs?: number | null
  securityFlags?: string[] | null
}

export async function logPaymentAudit(params: PaymentAuditParams) {
  const admin = getAdminClient()
  await admin.from('payment_audit_logs').insert({
    request_id: params.requestId,
    user_id: params.userId ?? null,
    ip_address: params.ip ?? null,
    user_agent: params.userAgent ?? null,
    payment_method_id: params.paymentMethodId ?? null,
    amount: params.amount ?? null,
    currency: params.currency ?? null,
    status: params.status,
    error_code: params.errorCode ?? null,
    error_message: params.errorMessage ?? null,
    stripe_payment_intent_id: params.stripePaymentIntentId ?? null,
    processing_time_ms: params.processingTimeMs ?? null,
    security_flags: params.securityFlags ?? [],
  })
}

export async function logSecurityEvent(req: Request, eventType: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, unknown>) {
  const admin = getAdminClient()
  const userId = await getUserIdFromRequest(req)
  const ip = getIp(req)
  const ua = getUserAgent(req)
  const url = new URL(req.url)
  await admin.from('security_event_logs').insert({
    event_type: eventType,
    severity,
    ip_address: ip,
    user_agent: ua,
    user_id: userId,
    endpoint: url.pathname,
    request_headers: sanitizeHeaders(req.headers),
    details: details ?? {},
  })
}
