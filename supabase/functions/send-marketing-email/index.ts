
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MarketingEmailRequest {
  subject: string;
  htmlContent: string;
  recipients: string[];
  campaignId: string;
  eventId: string;
  trackingPixel?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, htmlContent, recipients, campaignId, eventId, trackingPixel = true } = 
      await req.json() as MarketingEmailRequest;

    if (!subject || !htmlContent || !recipients || recipients.length === 0) {
      throw new Error("Missing required fields");
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
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-marketing-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
