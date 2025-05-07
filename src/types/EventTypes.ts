
// Define event-related types

export interface EventMarketingCampaign {
  id: string;
  name: string;
  description: string;
  campaign_type: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  metrics: Record<string, any>;
  target_audience: Record<string, any>;
  event_id: string;
}

export interface ABTestResult {
  variants: Array<{
    id: string;
    name: string;
    conversionRate: number;
    traffic?: number;
  }>;
  winner: string | null;
  variantA?: {
    id: string;
    name: string;
    conversionRate: number;
    traffic?: number;
  };
  variantB?: {
    id: string;
    name: string;
    conversionRate: number;
    traffic?: number;
  };
  improvement: number;
  significantResult: boolean;
}

export interface ReferralSource {
  source: string;
  name: string;
  count: number;
  visits: number;
  percentage: number;
  conversionRate: number;
  conversions: number;
}

export interface TicketAnalyticsData {
  typeName: string;
  sold: number;
  available?: number;
  total?: number;
  revenue?: number;
  percentage?: number;
}
