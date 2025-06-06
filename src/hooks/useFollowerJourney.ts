
import { useQuery } from '@tanstack/react-query';

export interface PromoterJourneyAnalytics {
  totalEvents: number;
  sourceBreakdown: Record<string, number>;
  recentEvents: Array<{
    event_type: string;
    created_at: string;
    event_data: any;
  }>;
  conversionRates: {
    discovery_to_interest: number;
    interest_to_engagement: number;
    engagement_to_follow: number;
    follow_to_premium: number;
  };
}

export const usePromoterJourneyAnalytics = (promoterId: string) => {
  return useQuery({
    queryKey: ['promoter-journey-analytics', promoterId],
    queryFn: async (): Promise<PromoterJourneyAnalytics> => {
      // Mock data for now - in a real app this would query the database
      return {
        totalEvents: 1500,
        sourceBreakdown: {
          social_media: 450,
          direct_search: 320,
          word_of_mouth: 280,
          event_discovery: 200,
          partner_referral: 150,
          other: 100
        },
        recentEvents: [
          {
            event_type: 'page_view',
            created_at: new Date().toISOString(),
            event_data: { page: 'profile' }
          },
          {
            event_type: 'follow',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            event_data: { source: 'social_media' }
          }
        ],
        conversionRates: {
          discovery_to_interest: 65,
          interest_to_engagement: 65,
          engagement_to_follow: 67,
          follow_to_premium: 30
        }
      };
    },
    enabled: !!promoterId
  });
};
