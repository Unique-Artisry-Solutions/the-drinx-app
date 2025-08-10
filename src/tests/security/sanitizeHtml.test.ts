import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

describe('sanitizeHtml', () => {
  it('removes script tags and event handlers', () => {
    const dirty = `<img src=x onerror=alert(1)><script>alert('xss')</script><div>ok</div>`;
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('onerror');
    expect(clean).toContain('<div>ok</div>');
  });

  it('is safe with empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });
});
