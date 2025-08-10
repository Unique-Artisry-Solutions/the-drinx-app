import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { getSecurityConfig, isOriginAllowed, getCorsHeaders, checkRateLimit } from '../../../supabase/functions/_shared/security.ts';

const ORIGIN_OK = 'https://dvifibvzwunnpcsihpxq.lovableproject.com';
const ORIGIN_BAD = 'https://evil.com';

describe('share-to-social edge function security', () => {
  it('CORS: allows trusted origin and rejects others', () => {
    const cfg = getSecurityConfig('production');
    expect(isOriginAllowed(ORIGIN_OK, cfg)).toBe(true);
    expect(isOriginAllowed(ORIGIN_BAD, cfg)).toBe(false);

    const allowed = getCorsHeaders(ORIGIN_OK, cfg);
    expect(allowed['Access-Control-Allow-Origin']).toBe(ORIGIN_OK);

    const denied = getCorsHeaders(ORIGIN_BAD, cfg);
    expect(denied['Access-Control-Allow-Origin']).toBe('null');
  });

  it('Rate limit: allows first two, blocks third within window', () => {
    const id = `share-to-social-${Date.now()}`;
    const first = checkRateLimit(id, 1, 2);
    const second = checkRateLimit(id, 1, 2);
    const third = checkRateLimit(id, 1, 2);
    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.remainingRequests).toBe(0);
  });

  it('Auth: source includes explicit missing auth handling', () => {
    const src = fs.readFileSync('supabase/functions/share-to-social/index.ts', 'utf8');
    expect(src).toMatch(/Missing Authorization header/);
    expect(src).toMatch(/Invalid or expired token/);
  });
});
