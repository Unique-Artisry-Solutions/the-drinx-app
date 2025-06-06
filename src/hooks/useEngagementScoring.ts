
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EngagementTier {
  id: string;
  promoter_id?: string;
  tier_name: string;
  min_score: number;
  max_score: number;
  tier_benefits: string[];
  tier_color: string;
  tier_icon: string;
  is_active: boolean;
}

export interface EngagementHistory {
  id: string;
  follower_id: string;
  engagement_type: string;
  engagement_value: number;
  engagement_data: Record<string, any>;
  calculated_score: number;
  tier_at_time?: string;
  created_at: string;
}

export const useEngagementScoring = (promoterId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get engagement tiers
  const { data: tiers = [], isLoading: tiersLoading } = useQuery({
    queryKey: ['engagement-tiers', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('engagement_tier_thresholds')
        .select('*')
        .or(`promoter_id.eq.${promoterId},promoter_id.is.null`)
        .eq('is_active', true)
        .order('min_score');

      if (error) throw error;
      return data as EngagementTier[];
    },
    enabled: !!promoterId
  });

  // Get follower engagement scores
  const { data: followerScores = [], isLoading: scoresLoading } = useQuery({
    queryKey: ['follower-engagement-scores', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follower_engagement_scores')
        .select(`
          *,
          promoter_followers!inner(promoter_id)
        `)
        .eq('promoter_followers.promoter_id', promoterId);

      if (error) throw error;
      return data;
    },
    enabled: !!promoterId
  });

  // Record engagement event
  const recordEngagement = useMutation({
    mutationFn: async ({
      followerId,
      engagementType,
      engagementValue = 1,
      engagementData = {}
    }: {
      followerId: string;
      engagementType: string;
      engagementValue?: number;
      engagementData?: Record<string, any>;
    }) => {
      const { data, error } = await supabase
        .from('follower_engagement_history')
        .insert({
          follower_id: followerId,
          engagement_type: engagementType,
          engagement_value: engagementValue,
          engagement_data: engagementData,
          calculated_score: engagementValue * 10 // Simple scoring for now
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follower-engagement-scores'] });
      toast({
        title: "Engagement Recorded",
        description: "Follower engagement has been tracked successfully.",
      });
    },
    onError: (error) => {
      console.error('Error recording engagement:', error);
      toast({
        title: "Error",
        description: "Failed to record engagement. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Get engagement tier for a score
  const getTierForScore = (score: number): EngagementTier | null => {
    return tiers.find(tier => score >= tier.min_score && score <= tier.max_score) || null;
  };

  return {
    tiers,
    followerScores,
    isLoading: tiersLoading || scoresLoading,
    recordEngagement,
    getTierForScore
  };
};
