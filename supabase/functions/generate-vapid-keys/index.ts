
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'

serve(async (req) => {
  const origin = req.headers.get('origin');
  const env = origin && (origin.includes('localhost') || origin.includes('127.0.0.1')) ? 'development' : 'production';
  const securityConfig = getSecurityConfig(env);
  const secureHeaders = getCorsHeaders(origin, securityConfig);
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: secureHeaders });
  }

  try {
    // Manual implementation of VAPID key generation since web-push may have issues in Deno
    // Using the Web Crypto API which is supported in Deno
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      true,
      ['sign', 'verify']
    );
    
    // Export the public key
    const publicKeyBuffer = await crypto.subtle.exportKey(
      'raw',
      keyPair.publicKey
    );
    
    // Export the private key
    const privateKeyBuffer = await crypto.subtle.exportKey(
      'pkcs8',
      keyPair.privateKey
    );
    
    // Convert the keys to base64 URL-safe strings
    const publicKey = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    const privateKey = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    console.log('Generated VAPID Keys successfully');
    
    return new Response(
      JSON.stringify({ 
        publicKey, 
        privateKey 
      }), 
      { 
        headers: { ...secureHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error generating VAPID keys:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...secureHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
