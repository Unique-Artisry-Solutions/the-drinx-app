
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const campaignId = url.searchParams.get('cid');
  const eventId = url.searchParams.get('eid');
  
  if (!campaignId || !eventId) {
    return new Response('Invalid tracking parameters', { status: 400 });
  }

  try {
    // Get current metrics
    const { data: campaign, error: fetchError } = await supabase
      .from('event_marketing_campaigns')
      .select('metrics')
      .eq('id', campaignId)
      .single();

    if (fetchError) {
      console.error('Error fetching campaign metrics:', fetchError);
      throw fetchError;
    }

    // Update metrics with new open count
    const currentMetrics = campaign?.metrics || {};
    const updatedMetrics = {
      ...currentMetrics,
      opens: (currentMetrics.opens || 0) + 1,
      last_open: new Date().toISOString(),
    };

    // Save updated metrics
    const { error: updateError } = await supabase
      .from('event_marketing_campaigns')
      .update({ metrics: updatedMetrics })
      .eq('id', campaignId);

    if (updateError) {
      console.error('Error updating campaign metrics:', updateError);
      throw updateError;
    }

    // Return a tiny transparent 1x1 pixel GIF
    const TRANSPARENT_GIF = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const binaryGif = Uint8Array.from(atob(TRANSPARENT_GIF), c => c.charCodeAt(0));
    
    return new Response(binaryGif, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Failed to track email open:', error);
    
    // Still return a pixel so the error doesn't affect email display
    const TRANSPARENT_GIF = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const binaryGif = Uint8Array.from(atob(TRANSPARENT_GIF), c => c.charCodeAt(0));
    
    return new Response(binaryGif, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
      },
    });
  }
};

serve(handler);
