
/**
 * Utility for parsing UTM parameters from URLs, specifically for campaign-segment tracking
 */

/**
 * Campaign tracking parameter interface
 */
export interface CampaignParameters {
  source?: string;
  medium?: string;
  campaign?: string;
  segment?: string;
  variant?: 'a' | 'b'; // A/B testing variant
  content?: string;
  term?: string;
}

/**
 * Parse UTM parameters from a URL
 * @param url The URL to parse, or uses current window location if not provided
 * @returns Parsed campaign parameters
 */
export const parseCampaignParameters = (url?: string): CampaignParameters => {
  const targetUrl = url || window.location.href;
  const urlObj = new URL(targetUrl);
  const params = new URLSearchParams(urlObj.search);
  
  return {
    source: params.get('utm_source')?.toLowerCase() || undefined,
    medium: params.get('utm_medium')?.toLowerCase() || undefined,
    campaign: params.get('utm_campaign') || undefined, // Keep case for campaign IDs
    segment: params.get('utm_segment') || undefined, // Keep case for segment IDs
    variant: (params.get('utm_variant')?.toLowerCase() as 'a' | 'b') || undefined,
    content: params.get('utm_content') || undefined,
    term: params.get('utm_term')?.toLowerCase() || undefined
  };
};

/**
 * Track a campaign interaction based on URL parameters
 * @param interactionType The type of interaction to track ('impression', 'click', 'conversion')
 * @param trackInteractionCallback Callback function to record the interaction
 */
export const trackCampaignFromUrl = (
  interactionType: 'impression' | 'click' | 'conversion',
  trackInteractionCallback: (
    campaignId: string, 
    interactionType: string, 
    value?: number, 
    segmentId?: string, 
    variant?: 'A' | 'B'
  ) => void
): void => {
  const params = parseCampaignParameters();
  
  // Only track if we have a campaign ID
  if (params.campaign) {
    const campaignId = params.campaign;
    const segmentId = params.segment;
    const variant = params.variant ? (params.variant.toUpperCase() as 'A' | 'B') : undefined;
    
    // Track the interaction
    trackInteractionCallback(campaignId, interactionType, 1, segmentId, variant);
    
    // Log for debugging
    console.log(`Tracked campaign interaction: ${interactionType}`, { campaignId, segmentId, variant });
  }
};

/**
 * Append campaign parameters to a URL
 * @param baseUrl The base URL to append parameters to
 * @param params The campaign parameters to append
 * @returns URL with appended parameters
 */
export const appendCampaignParameters = (
  baseUrl: string,
  params: CampaignParameters
): string => {
  const url = new URL(baseUrl);
  const searchParams = new URLSearchParams(url.search);
  
  // Add each parameter if it exists
  if (params.source) searchParams.set('utm_source', params.source);
  if (params.medium) searchParams.set('utm_medium', params.medium);
  if (params.campaign) searchParams.set('utm_campaign', params.campaign);
  if (params.segment) searchParams.set('utm_segment', params.segment);
  if (params.variant) searchParams.set('utm_variant', params.variant);
  if (params.content) searchParams.set('utm_content', params.content);
  if (params.term) searchParams.set('utm_term', params.term);
  
  // Set the search string on the URL
  url.search = searchParams.toString();
  
  return url.toString();
};

/**
 * Attach campaign tracking to links on a page
 * This is useful for automatically adding campaign parameters to all external links
 * @param campaignId The campaign ID to track
 * @param segmentId Optional segment ID for targeted tracking
 */
export const attachCampaignTrackingToLinks = (
  campaignId: string, 
  segmentId?: string,
  variant?: 'a' | 'b'
): void => {
  // Get all links on the page
  const links = document.querySelectorAll('a[href]');
  
  // Prepare the parameters
  const params: CampaignParameters = {
    source: 'spiritless',
    medium: 'website',
    campaign: campaignId
  };
  
  // Add segment if provided
  if (segmentId) {
    params.segment = segmentId;
  }
  
  // Add variant if provided
  if (variant) {
    params.variant = variant;
  }
  
  // Attach parameters to each link
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      try {
        // Only modify absolute URLs or URLs that start with / (relative to domain)
        if (href.startsWith('http') || href.startsWith('/')) {
          const absoluteUrl = href.startsWith('/') 
            ? `${window.location.origin}${href}` 
            : href;
          
          const newUrl = appendCampaignParameters(absoluteUrl, params);
          link.setAttribute('href', newUrl);
        }
      } catch (error) {
        console.error('Error attaching campaign parameters to link:', error);
      }
    }
  });
};
