
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface JourneyEvent {
  id: string;
  follower_id: string;
  event_type: 'discovery' | 'first_follow' | 'engagement' | 'conversion' | 'churn_risk';
  event_data: Record<string, any>;
  source_page?: string;
  referrer_url?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

interface TrackJourneyEventParams {
  followerId: string;
  eventType: string;
  eventData?: Record<string, any>;
  sourcePage?: string;
  referrerUrl?: string;
}

export function useFollowerJourney(followerId?: string) {
  const queryClient = useQueryClient();

  // Get journey events for a specific follower
  const { data: journeyEvents, isLoading } = useQuery({
    queryKey: ['follower-journey', followerId],
    queryFn: async () => {
      if (!followerId) return [];
      
      const { data, error } = await supabase
        .from('follower_journey_events')
        .select('*')
        .eq('follower_id', followerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JourneyEvent[];
    },
    enabled: !!followerId
  });

  // Track a new journey event
  const trackEvent = useMutation({
    mutationFn: async (params: TrackJourneyEventParams) => {
      const { data, error } = await supabase.rpc('track_follower_journey_event', {
        p_follower_id: params.followerId,
        p_event_type: params.eventType,
        p_event_data: params.eventData || {},
        p_source_page: params.sourcePage,
        p_referrer_url: params.referrerUrl,
        p_user_agent: navigator.userAgent
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follower-journey'] });
    }
  });

  return {
    journeyEvents,
    isLoading,
    trackEvent
  };
}

// Hook for promoter to get journey analytics
export function usePromoterJourneyAnalytics(promoterId: string) {
  return useQuery({
    queryKey: ['promoter-journey-analytics', promoterId],
    queryFn: async () => {
      // Get discovery source breakdown
      const { data: discoveryData, error: discoveryError } = await supabase
        .from('promoter_followers')
        .select('discovery_source')
        .eq('promoter_id', promoterId)
        .not('discovery_source', 'is', null);

      if (discoveryError) throw discoveryError;

      // Count discovery sources
      const sourceBreakdown = discoveryData.reduce((acc: Record<string, number>, item) => {
        const source = item.discovery_source || 'unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {});

      // Get recent journey events
      const { data: recentEvents, error: eventsError } = await supabase
        .from('follower_journey_events')
        .select(`
          *,
          promoter_followers!inner(promoter_id)
        `)
        .eq('promoter_followers.promoter_id', promoterId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      return {
        sourceBreakdown,
        recentEvents: recentEvents || [],
        totalEvents: recentEvents?.length || 0
      };
    },
    enabled: !!promoterId
  });
}
