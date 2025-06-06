
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EngagementScore {
  id: string;
  follower_id: string;
  overall_score: number;
  activity_score: number;
  interaction_score: number;
  loyalty_score: number;
  recency_score: number;
  last_calculated_at: string;
  score_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface FollowerWithScore {
  id: string;
  promoter_id: string;
  subscriber_id: string;
  engagement_count: number;
  total_interactions: number;
  churn_risk_score: number;
  follower_tier: string;
  last_engagement_at?: string;
  discovery_source?: string;
  engagement_score?: EngagementScore;
}

export function useEngagementScoring(promoterId: string) {
  const queryClient = useQueryClient();

  // Get followers with their engagement scores
  const { data: followersWithScores, isLoading } = useQuery({
    queryKey: ['followers-engagement-scores', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select(`
          *,
          follower_engagement_scores(*)
        `)
        .eq('promoter_id', promoterId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FollowerWithScore[];
    },
    enabled: !!promoterId
  });

  // Calculate engagement score for a specific follower
  const calculateScore = useMutation({
    mutationFn: async (followerId: string) => {
      const { data, error } = await supabase.rpc('calculate_engagement_score', {
        p_follower_id: followerId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers-engagement-scores'] });
    }
  });

  // Bulk calculate scores for all followers
  const calculateAllScores = useMutation({
    mutationFn: async () => {
      if (!followersWithScores) return;

      const promises = followersWithScores.map(follower =>
        supabase.rpc('calculate_engagement_score', {
          p_follower_id: follower.id
        })
      );

      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers-engagement-scores'] });
    }
  });

  // Get engagement score distribution
  const scoreDistribution = followersWithScores?.reduce((acc, follower) => {
    const score = follower.engagement_score?.[0]?.overall_score || 0;
    
    if (score >= 80) acc.excellent = (acc.excellent || 0) + 1;
    else if (score >= 60) acc.good = (acc.good || 0) + 1;
    else if (score >= 40) acc.average = (acc.average || 0) + 1;
    else if (score >= 20) acc.poor = (acc.poor || 0) + 1;
    else acc.inactive = (acc.inactive || 0) + 1;
    
    return acc;
  }, {} as Record<string, number>);

  return {
    followersWithScores,
    isLoading,
    calculateScore,
    calculateAllScores,
    scoreDistribution
  };
}

// Hook for individual follower engagement tracking
export function useFollowerEngagement(followerId: string) {
  const queryClient = useQueryClient();

  const { data: engagementScore } = useQuery({
    queryKey: ['follower-engagement', followerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follower_engagement_scores')
        .select('*')
        .eq('follower_id', followerId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as EngagementScore | null;
    },
    enabled: !!followerId
  });

  const updateEngagement = useMutation({
    mutationFn: async (params: { 
      engagementType: string; 
      value?: number;
      metadata?: Record<string, any>;
    }) => {
      // First update the follower's engagement metrics
      const { error: updateError } = await supabase
        .from('promoter_followers')
        .update({
          last_engagement_at: new Date().toISOString(),
          engagement_count: supabase.sql`engagement_count + 1`,
          total_interactions: supabase.sql`total_interactions + ${params.value || 1}`
        })
        .eq('id', followerId);

      if (updateError) throw updateError;

      // Then recalculate the engagement score
      const { data, error } = await supabase.rpc('calculate_engagement_score', {
        p_follower_id: followerId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follower-engagement'] });
      queryClient.invalidateQueries({ queryKey: ['followers-engagement-scores'] });
    }
  });

  return {
    engagementScore,
    updateEngagement
  };
}
