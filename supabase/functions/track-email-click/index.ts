
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const campaignId = url.searchParams.get('cid');
  const eventId = url.searchParams.get('eid');
  const destination = url.searchParams.get('url');
  
  if (!campaignId || !eventId || !destination) {
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

    // Update metrics with new click count
    const currentMetrics = campaign?.metrics || {};
    const updatedMetrics = {
      ...currentMetrics,
      clicks: (currentMetrics.clicks || 0) + 1,
      last_click: new Date().toISOString(),
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

    // Redirect to the destination URL
    return new Response(null, {
      status: 302,
      headers: {
        'Location': decodeURIComponent(destination)
      }
    });
  } catch (error: any) {
    console.error('Failed to track email click:', error);
    
    // Still redirect to avoid disrupting the user experience
    return new Response(null, {
      status: 302,
      headers: {
        'Location': decodeURIComponent(destination || '/')
      }
    });
  }
};

serve(handler);
