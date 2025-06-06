
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
  conversion_score: number;
  recommended_tier: string;
  score_breakdown: Record<string, any>;
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

export interface EngagementRule {
  id: string;
  promoter_id: string | null;
  rule_name: string;
  signal_type: 'activity' | 'interaction' | 'loyalty' | 'recency' | 'conversion';
  base_weight: number;
  current_weight: number;
  conditions: Record<string, any>;
  score_formula: Record<string, any>;
  is_active: boolean;
}

export interface EngagementTierThreshold {
  id: string;
  promoter_id: string | null;
  tier_name: 'bronze' | 'silver' | 'gold' | 'platinum';
  min_score: number;
  max_score: number | null;
  benefits: string[];
  color_code: string;
  is_active: boolean;
}

interface FollowerWithEngagementScore {
  id: string;
  promoter_id: string;
  subscriber_id: string;
  engagement_count: number;
  total_interactions: number;
  engagement_score: number;
  engagement_tier: string;
  score_last_updated: string;
  tier_updated_at: string;
  last_engagement_at?: string;
  follower_tier: string;
  created_at: string;
}

export function useEngagementScoring(promoterId: string) {
  const queryClient = useQueryClient();

  // Get followers with their engagement scores
  const { data: followersWithScores, isLoading } = useQuery({
    queryKey: ['followers-engagement-scores', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('*')
        .eq('promoter_id', promoterId)
        .order('engagement_score', { ascending: false });

      if (error) throw error;
      return data as FollowerWithEngagementScore[];
    },
    enabled: !!promoterId
  });

  // Get engagement scoring rules
  const { data: scoringRules } = useQuery({
    queryKey: ['engagement-scoring-rules', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagement_scoring_rules')
        .select('*')
        .or(`promoter_id.eq.${promoterId},promoter_id.is.null`)
        .eq('is_active', true)
        .order('signal_type');

      if (error) throw error;
      return data as EngagementRule[];
    },
    enabled: !!promoterId
  });

  // Get tier thresholds
  const { data: tierThresholds } = useQuery({
    queryKey: ['engagement-tier-thresholds', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagement_tier_thresholds')
        .select('*')
        .or(`promoter_id.eq.${promoterId},promoter_id.is.null`)
        .eq('is_active', true)
        .order('min_score');

      if (error) throw error;
      return data as EngagementTierThreshold[];
    },
    enabled: !!promoterId
  });

  // Calculate engagement score for a specific follower
  const calculateScore = useMutation({
    mutationFn: async (followerId: string) => {
      const { data, error } = await supabase.rpc('calculate_comprehensive_engagement_score', {
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
        supabase.rpc('calculate_comprehensive_engagement_score', {
          p_follower_id: follower.id
        })
      );

      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers-engagement-scores'] });
    }
  });

  // Update scoring rule weights
  const updateScoringRule = useMutation({
    mutationFn: async (params: { ruleId: string; updates: Partial<EngagementRule> }) => {
      const { data, error } = await supabase
        .from('engagement_scoring_rules')
        .update(params.updates)
        .eq('id', params.ruleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engagement-scoring-rules'] });
    }
  });

  // Update tier thresholds
  const updateTierThreshold = useMutation({
    mutationFn: async (params: { thresholdId: string; updates: Partial<EngagementTierThreshold> }) => {
      const { data, error } = await supabase
        .from('engagement_tier_thresholds')
        .update(params.updates)
        .eq('id', params.thresholdId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engagement-tier-thresholds'] });
    }
  });

  // Get engagement score distribution
  const scoreDistribution = followersWithScores?.reduce((acc, follower) => {
    const score = follower.engagement_score || 0;
    
    if (score >= 75) acc.platinum = (acc.platinum || 0) + 1;
    else if (score >= 50) acc.gold = (acc.gold || 0) + 1;
    else if (score >= 25) acc.silver = (acc.silver || 0) + 1;
    else acc.bronze = (acc.bronze || 0) + 1;
    
    return acc;
  }, {} as Record<string, number>);

  // Get tier distribution
  const tierDistribution = followersWithScores?.reduce((acc, follower) => {
    const tier = follower.engagement_tier || 'bronze';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    followersWithScores,
    scoringRules,
    tierThresholds,
    isLoading,
    calculateScore,
    calculateAllScores,
    updateScoringRule,
    updateTierThreshold,
    scoreDistribution,
    tierDistribution
  };
}

// Hook for individual follower engagement tracking with real-time updates
export function useFollowerEngagement(followerId: string) {
  const queryClient = useQueryClient();

  const { data: followerScore } = useQuery({
    queryKey: ['follower-engagement', followerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('*')
        .eq('id', followerId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as FollowerWithEngagementScore | null;
    },
    enabled: !!followerId
  });

  // Get engagement history for this follower
  const { data: engagementHistory } = useQuery({
    queryKey: ['follower-engagement-history', followerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follower_engagement_history')
        .select('*')
        .eq('follower_id', followerId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    enabled: !!followerId
  });

  const updateEngagement = useMutation({
    mutationFn: async (params: { 
      engagementType: string; 
      value?: number;
      metadata?: Record<string, any>;
    }) => {
      // Update follower engagement metrics
      const { error: updateError } = await supabase
        .from('promoter_followers')
        .update({
          last_engagement_at: new Date().toISOString(),
          engagement_count: (followerScore?.engagement_count || 0) + 1,
          total_interactions: (followerScore?.total_interactions || 0) + (params.value || 1)
        })
        .eq('id', followerId);

      if (updateError) throw updateError;

      // The trigger will automatically recalculate the engagement score
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follower-engagement'] });
      queryClient.invalidateQueries({ queryKey: ['followers-engagement-scores'] });
    }
  });

  return {
    followerScore,
    engagementHistory,
    updateEngagement
  };
}
