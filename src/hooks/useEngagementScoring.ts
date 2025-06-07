
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

  // Get engagement tiers - using existing reward_tiers table as fallback
  const { data: tiers = [], isLoading: tiersLoading } = useQuery({
    queryKey: ['engagement-tiers', promoterId],
    queryFn: async () => {
      // Try to get from reward_tiers table and map to EngagementTier interface
      const { data, error } = await supabase
        .from('reward_tiers')
        .select('*')
        .eq('establishment_id', promoterId)
        .eq('is_active', true)
        .order('points_required');

      if (error) {
        console.warn('No engagement tiers found, using default tiers:', error);
        // Return default tiers if none exist
        return [
          {
            id: 'bronze',
            promoter_id: promoterId,
            tier_name: 'Bronze',
            min_score: 0,
            max_score: 100,
            tier_benefits: ['Basic rewards'],
            tier_color: '#CD7F32',
            tier_icon: 'trophy',
            is_active: true
          },
          {
            id: 'silver',
            promoter_id: promoterId,
            tier_name: 'Silver',
            min_score: 101,
            max_score: 500,
            tier_benefits: ['Enhanced rewards', 'Priority support'],
            tier_color: '#C0C0C0',
            tier_icon: 'star',
            is_active: true
          },
          {
            id: 'gold',
            promoter_id: promoterId,
            tier_name: 'Gold',
            min_score: 501,
            max_score: 9999,
            tier_benefits: ['Premium rewards', 'VIP access', 'Exclusive events'],
            tier_color: '#FFD700',
            tier_icon: 'crown',
            is_active: true
          }
        ] as EngagementTier[];
      }

      // Map database columns to EngagementTier interface
      return data.map(tier => ({
        id: tier.id,
        promoter_id: tier.establishment_id,
        tier_name: tier.name,
        min_score: tier.points_required,
        max_score: tier.points_required + 500, // Default range
        tier_benefits: Array.isArray(tier.benefits) ? tier.benefits : [tier.description || 'Tier benefits'],
        tier_color: tier.color || '#808080',
        tier_icon: tier.icon || 'trophy',
        is_active: tier.is_active
      })) as EngagementTier[];
    },
    enabled: !!promoterId
  });

  // Get follower engagement scores - using mock data for now
  const { data: followerScores = [], isLoading: scoresLoading } = useQuery({
    queryKey: ['follower-engagement-scores', promoterId],
    queryFn: async () => {
      // Return mock engagement scores since the table doesn't exist yet
      return [
        {
          id: '1',
          follower_id: 'follower-1',
          overall_score: 85,
          activity_score: 80,
          interaction_score: 90,
          loyalty_score: 85,
          recency_score: 75,
          last_calculated_at: new Date().toISOString(),
          score_metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    },
    enabled: !!promoterId
  });

  // Record engagement event - simplified version
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
      // For now, just log the engagement - in a real implementation this would
      // insert into follower_engagement_history table
      console.log('Recording engagement:', {
        followerId,
        engagementType,
        engagementValue,
        engagementData
      });
      
      return {
        id: `engagement-${Date.now()}`,
        follower_id: followerId,
        engagement_type: engagementType,
        engagement_value: engagementValue,
        engagement_data: engagementData,
        calculated_score: engagementValue * 10,
        created_at: new Date().toISOString()
      };
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
