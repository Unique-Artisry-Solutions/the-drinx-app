
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate VAPID keys function using the Web Crypto API
const generateVAPIDKeys = () => {
  // Generate the public/private ECDSA key pair
  const vapidKeys = crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256"
    },
    true,
    ["sign", "verify"]
  ).then(async (keyPair) => {
    // Export the public key as raw point data
    const publicKey = await crypto.subtle.exportKey("raw", keyPair.publicKey);
    // Export the private key in PKCS#8 format
    const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    
    // Convert ArrayBuffers to base64url strings
    const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKey)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    return {
      publicKey: publicKeyBase64,
      privateKey: privateKeyBase64
    };
  });

  return vapidKeys;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Generate VAPID keys directly instead of using the web-push library
    const vapidKeys = await generateVAPIDKeys();
    
    console.log('Generated VAPID Keys:', {
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey
    });

    return new Response(
      JSON.stringify({
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error generating VAPID keys:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
