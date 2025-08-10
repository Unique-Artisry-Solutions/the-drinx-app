import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getCorsHeaders, getSecurityConfig } from '../_shared/security.ts'

// Simple health page to quickly see environment-specific security config in effect
serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const env = origin && (origin.includes('localhost') || origin.includes('127.0.0.1')) ? 'development' : 'production';
  const headers = getCorsHeaders(origin, getSecurityConfig(env));
  if (req.method === 'OPTIONS') return new Response('ok', { headers });

  return new Response(JSON.stringify({ ok: true, env }), { headers: { ...headers, 'Content-Type': 'application/json' } });
});
