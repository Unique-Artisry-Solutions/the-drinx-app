import { describe, it, expect } from 'vitest';
import { redactSensitive } from '@/lib/logging/redact';

describe('redactSensitive', () => {
  it('redacts emails', () => {
    const input = { email: 'user@example.com', message: 'Contact me at user@example.com' };
    const out = redactSensitive(input);
    expect(out.email).toBe('[REDACTED]');
    expect(out.message).not.toContain('user@example.com');
  });

  it('redacts tokens and passwords', () => {
    const input = { token: 'abc123', password: 'supersecret' };
    const out = redactSensitive(input);
    expect(out.token).toBe('[REDACTED]');
    expect(out.password).toBe('[REDACTED]');
  });

  it('redacts credit card-like numbers in strings', () => {
    const input = { note: 'card 4242424242424242 exp 12/29' };
    const out = redactSensitive(input);
    expect(out.note).not.toContain('4242424242424242');
  });

  it('handles nested structures', () => {
    const input = { a: { b: { apiKey: 'xyz' } }, arr: [{ authorization: 'Bearer token' }] };
    const out = redactSensitive(input);
    expect(out.a.b.apiKey).toBe('[REDACTED]');
    expect(out.arr[0].authorization).toBe('[REDACTED]');
  });
});
