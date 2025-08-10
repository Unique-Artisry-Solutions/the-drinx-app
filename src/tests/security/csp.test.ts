import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('CSP meta tag', () => {
  it('index.html includes a CSP meta with default-src self', () => {
    const html = fs.readFileSync('index.html', 'utf8');
    expect(html).toMatch(/Content-Security-Policy/);
    expect(html).toMatch(/default-src 'self'/);
  });
});
