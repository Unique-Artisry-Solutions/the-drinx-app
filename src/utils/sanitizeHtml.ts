import DOMPurify from 'dompurify';

// Centralized HTML sanitization for any dynamic HTML rendering
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}
