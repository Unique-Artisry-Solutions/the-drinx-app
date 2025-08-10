
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts';
import { enforceRateLimit } from '../_shared/rateLimit.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);


interface MarketingEmailRequest {
  subject: string;
  htmlContent: string;
  recipients: string[];
  campaignId: string;
  eventId: string;
  trackingPixel?: boolean;
}

async function getAuthenticatedUser(req: Request): Promise<{ user: any | null; error?: string }> {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (authHeader.split(' ')[1] || '');
  if (!token) {
    return { user: null, error: 'Missing Authorization header' };
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return { user: null, error: 'Invalid or expired token' };
  }
  return { user: data.user };
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const config = getSecurityConfig();
  const cors = getCorsHeaders(origin, config);
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }
  if (!isOriginAllowed(origin, config)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  try {
    const { user, error: authError } = await getAuthenticatedUser(req);
    if (!user) {
      return new Response(
        JSON.stringify({ error: authError || 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...cors } }
      );
    }

    // Persistent rate limiting
    const rate = await enforceRateLimit(req, 'send-marketing-email', { userLimit: 20, ipLimit: 60, windowSeconds: 60 });
    if (!rate.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...cors, 'Retry-After': String(rate.retryAfter ?? 60) } }
      );
    }

    const { subject, htmlContent, recipients, campaignId, eventId, trackingPixel = true } = await req.json() as MarketingEmailRequest;

    if (!subject || !htmlContent || !recipients || recipients.length === 0) {
      throw new Error('Missing required fields');
    }

    // Add tracking pixel if requested
    let finalHtml = htmlContent;
    if (trackingPixel) {
      const trackingUrl = `${Deno.env.get('PROJECT_URL')}/api/track-email-open?cid=${campaignId}&eid=${eventId}`;
      finalHtml += `<img src="${trackingUrl}" width="1" height="1" alt="" style="display:none;" />`;
    }

    const emailResponse = await resend.emails.send({
      from: "Events <events@youreventapp.com>", // Update with your verified domain
      to: recipients,
      subject: subject,
      html: finalHtml,
      headers: {
        "X-Campaign-ID": campaignId,
        "X-Event-ID": eventId,
      },
      tags: [
        {
          name: "campaign_id",
          value: campaignId,
        },
        {
          name: "event_id",
          value: eventId,
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...cors,
      },
    });
  } catch (error: any) {
    console.error("Error in send-marketing-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      }
    );
  }
};

serve(handler);
