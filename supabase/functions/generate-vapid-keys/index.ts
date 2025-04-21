
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as webpush from 'https://esm.sh/web-push@3.6.6'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const vapidKeys = webpush.generateVAPIDKeys();
    
    console.log('Generated VAPID Keys:', {
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey
    });

    return new Response(
      JSON.stringify(vapidKeys), 
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
