
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { createHmac } from "https://deno.land/std@0.220.1/crypto/mod.ts";
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts';


// Twitter/X API configuration
const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");
  return signature;
}

function generateOAuthHeader(method: string, url: string): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    API_SECRET!,
    ACCESS_TOKEN_SECRET!
  );

  const signedOAuthParams = {
    ...oauthParams,
    oauth_signature: signature,
  };

  const entries = Object.entries(signedOAuthParams).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    "OAuth " +
    entries
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}

async function tweetPost(content: string): Promise<any> {
  const url = `https://api.x.com/2/tweets`;
  const method = "POST";
  const params = { text: content };

  const oauthHeader = generateOAuthHeader(method, url);

  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${responseText}`
    );
  }

  return await response.json();
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SocialShareRequest {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram';
  content: string;
  url: string;
  campaignId: string;
  eventId: string;
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');
  const config = getSecurityConfig();
  const cors = getCorsHeaders(origin, config);
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }
  if (!isOriginAllowed(origin, config)) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } });
  }

  try {
    const { platform, content, url, campaignId, eventId } = 
      await req.json() as SocialShareRequest;

    let response;
    let success = false;
    let platformResponse = null;

    // Platform-specific sharing implementation
    switch (platform) {
      case 'twitter':
        if (!API_KEY || !API_SECRET || !ACCESS_TOKEN || !ACCESS_TOKEN_SECRET) {
          throw new Error("Twitter API credentials are not configured");
        }
        const tweetContent = `${content} ${url}`;
        platformResponse = await tweetPost(tweetContent);
        success = true;
        break;
      
      case 'facebook':
        // Placeholder for Facebook API integration
        // Would require Facebook Graph API implementation
        platformResponse = { message: "Facebook sharing simulated - API integration pending" };
        success = true;
        break;
      
      case 'linkedin':
        // Placeholder for LinkedIn API integration
        // Would require LinkedIn Marketing API implementation
        platformResponse = { message: "LinkedIn sharing simulated - API integration pending" };
        success = true;
        break;
      
      case 'instagram':
        // Instagram usually requires mobile API or Facebook Graph API with specific permissions
        platformResponse = { message: "Instagram sharing simulated - API integration pending" };
        success = true;
        break;
      
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    // Track sharing in campaign metrics
    if (success) {
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

      // Update metrics with new share count for this platform
      const currentMetrics = campaign?.metrics || {};
      const platformShares = currentMetrics[`${platform}_shares`] || 0;
      
      const updatedMetrics = {
        ...currentMetrics,
        [`${platform}_shares`]: platformShares + 1,
        total_shares: (currentMetrics.total_shares || 0) + 1,
        last_share: new Date().toISOString(),
      };

      // Save updated metrics
      const { error: updateError } = await supabase
        .from('event_marketing_campaigns')
        .update({ metrics: updatedMetrics })
        .eq('id', campaignId);

      if (updateError) {
        console.error('Error updating campaign metrics:', updateError);
      }
    }

    return new Response(JSON.stringify({ 
      success, 
      platform, 
      platformResponse,
      message: `Content shared to ${platform} successfully` 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...cors,
      },
    });
  } catch (error: any) {
    console.error(`Error sharing to social media:`, error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      }
    );
  }
};

serve(handler);
