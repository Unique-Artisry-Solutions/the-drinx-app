// Enhanced input sanitization & validation helpers for Edge Functions

export function sanitizeString(value: string, maxLen = 2000): string {
  let s = value
  // Remove script tags first
  s = s.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
  // Remove event handler attributes like onclick="..."
  s = s.replace(/on[a-zA-Z]+\s*=\s*"[^"]*"/gi, '')
  s = s.replace(/on[a-zA-Z]+\s*=\s*'[^']*'/gi, '')
  s = s.replace(/on[a-zA-Z]+\s*=\s*[^\s>]+/gi, '')
  // Strip remaining HTML tags
  s = s.replace(/<[^>]*>/g, '')
  // Remove javascript: and data: urls
  s = s.replace(/javascript:/gi, '').replace(/data:/gi, '')
  // Trim and clamp length
  s = s.trim().slice(0, maxLen)
  return s
}

export function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') return sanitizeString(value)
  if (typeof value === 'number') {
    if (!isFinite(value) || isNaN(value)) throw new Error('Invalid numeric input')
    return value
  }
  if (typeof value === 'boolean' || value === null) return value
  if (Array.isArray(value)) return value.slice(0, 100).map(sanitizeValue)
  if (value && typeof value === 'object') return sanitizeObject(value as Record<string, unknown>)
  return value
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T, opts?: { allowlist?: string[] }): T {
  const out: Record<string, unknown> = {}
  const keys = Object.keys(obj)
  for (const k of keys) {
    if (opts?.allowlist && !opts.allowlist.includes(k)) continue
    out[k] = sanitizeValue((obj as any)[k])
  }
  return out as T
}

export function isSafeText(value: string): boolean {
  const blacklist = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /('|"|;|--|\/\*|\*\/)/,
    /(0x[0-9a-f]+)/i
  ]
  return !blacklist.some((re) => re.test(value))
}

export function validateBasicPayload(input: unknown, opts?: { maxKeys?: number }): { ok: boolean; error?: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'Invalid JSON payload' }
  }
  const keys = Object.keys(input as Record<string, unknown>)
  if (opts?.maxKeys && keys.length > opts.maxKeys) {
    return { ok: false, error: 'Too many fields' }
  }
  // Optionally, ensure strings are safe
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (typeof v === 'string' && !isSafeText(v)) {
      return { ok: false, error: `Unsafe text detected in field ${k}` }
    }
  }
  return { ok: true }
}
