import { describe, it, expect } from 'vitest';
import { getSecurityConfig, isOriginAllowed, getCorsHeaders, checkRateLimit } from '../../../supabase/functions/_shared/security.ts';

describe('CORS and Security Utils', () => {
  it('allows trusted origins and rejects others', () => {
    const cfg = getSecurityConfig('production');
    expect(isOriginAllowed('https://dvifibvzwunnpcsihpxq.lovableproject.com', cfg)).toBe(true);
    expect(isOriginAllowed('https://sub.example.com', cfg)).toBe(false);
    expect(isOriginAllowed(null as any, cfg)).toBe(false);
  });

  it('builds correct CORS headers', () => {
    const cfg = getSecurityConfig('production');
    const origin = 'https://dvifibvzwunnpcsihpxq.lovableproject.com';
    const headers = getCorsHeaders(origin, cfg);
    expect(headers['Access-Control-Allow-Origin']).toBe(origin);

    const disallowed = getCorsHeaders('https://evil.com', cfg);
    expect(disallowed['Access-Control-Allow-Origin']).toBe('null');
  });

  it('enforces simple in-memory rate limits', () => {
    const id = `test-${Date.now()}`;
    const first = checkRateLimit(id, 1, 2);
    const second = checkRateLimit(id, 1, 2);
    const third = checkRateLimit(id, 1, 2);
    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.remainingRequests).toBe(0);
  });
});
