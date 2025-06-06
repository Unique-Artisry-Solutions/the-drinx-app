
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Badge, LoyaltyMilestone, GamificationReward, FollowerAchievement, LoyaltyPoints, BadgeProgress, TierProgress } from '@/types/gamification';

export function useGamification(promoterId?: string) {
  const queryClient = useQueryClient();

  // Fetch badges
  const { data: badges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ['badges', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follower_badges')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      return data as Badge[];
    }
  });

  // Fetch loyalty milestones
  const { data: milestones = [], isLoading: milestonesLoading } = useQuery({
    queryKey: ['loyalty-milestones', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_milestones')
        .select('*')
        .eq('is_active', true)
        .order('tier_level', { ascending: true });

      if (error) throw error;
      return data as LoyaltyMilestone[];
    }
  });

  // Fetch gamification rewards
  const { data: rewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ['gamification-rewards', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gamification_rewards')
        .select('*')
        .eq('is_active', true)
        .order('cost_points', { ascending: true });

      if (error) throw error;
      return data as GamificationReward[];
    }
  });

  // Fetch follower achievements
  const fetchFollowerAchievements = async (followerId: string) => {
    const { data, error } = await supabase
      .from('follower_achievements')
      .select(`
        *,
        badge:follower_badges(*),
        milestone:loyalty_milestones(*)
      `)
      .eq('follower_id', followerId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data as FollowerAchievement[];
  };

  // Fetch loyalty points
  const fetchLoyaltyPoints = async (followerId: string) => {
    const { data, error } = await supabase
      .from('loyalty_points')
      .select('*')
      .eq('follower_id', followerId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as LoyaltyPoints | null;
  };

  // Award badge mutation
  const awardBadge = useMutation({
    mutationFn: async ({ followerId, badgeId }: { followerId: string; badgeId: string }) => {
      const badge = badges.find(b => b.id === badgeId);
      if (!badge) throw new Error('Badge not found');

      // Check if already earned
      const { data: existing } = await supabase
        .from('follower_achievements')
        .select('id')
        .eq('follower_id', followerId)
        .eq('badge_id', badgeId)
        .single();

      if (existing) throw new Error('Badge already earned');

      // Insert achievement
      const { error: achievementError } = await supabase
        .from('follower_achievements')
        .insert({
          follower_id: followerId,
          achievement_type: 'badge',
          badge_id: badgeId,
          points_earned: badge.points_reward
        });

      if (achievementError) throw achievementError;

      // Update follower stats
      const { error: followerError } = await supabase
        .from('promoter_followers')
        .update({
          total_badges_earned: supabase.raw('total_badges_earned + 1'),
          last_badge_earned_at: new Date().toISOString(),
          gamification_score: supabase.raw(`gamification_score + ${badge.points_reward}`)
        })
        .eq('id', followerId);

      if (followerError) throw followerError;

      // Update loyalty points
      const { error: pointsError } = await supabase
        .from('loyalty_points')
        .upsert({
          follower_id: followerId,
          current_points: supabase.raw(`current_points + ${badge.points_reward}`),
          lifetime_points: supabase.raw(`lifetime_points + ${badge.points_reward}`),
          last_earned_at: new Date().toISOString()
        });

      if (pointsError) throw pointsError;

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follower-achievements'] });
      queryClient.invalidateQueries({ queryKey: ['loyalty-points'] });
    }
  });

  // Process tier upgrade mutation
  const processTierUpgrade = useMutation({
    mutationFn: async (followerId: string) => {
      const { data: follower, error: followerError } = await supabase
        .from('promoter_followers')
        .select('*')
        .eq('id', followerId)
        .single();

      if (followerError) throw followerError;

      const loyaltyPoints = await fetchLoyaltyPoints(followerId);
      const currentTier = follower.loyalty_tier_level || 1;
      const followDays = Math.floor((Date.now() - new Date(follower.created_at).getTime()) / (1000 * 60 * 60 * 24));

      // Find next eligible tier
      const nextMilestone = milestones.find(m => 
        m.tier_level > currentTier &&
        (m.points_threshold === null || (loyaltyPoints?.lifetime_points || 0) >= m.points_threshold) &&
        (m.engagement_threshold === null || (follower.engagement_score || 0) >= m.engagement_threshold) &&
        (m.time_requirement_days === null || followDays >= m.time_requirement_days)
      );

      if (!nextMilestone) return false;

      // Update tier
      const { error: updateError } = await supabase
        .from('promoter_followers')
        .update({
          loyalty_tier_level: nextMilestone.tier_level,
          engagement_tier: getTierName(nextMilestone.tier_level),
          tier_updated_at: new Date().toISOString()
        })
        .eq('id', followerId);

      if (updateError) throw updateError;

      // Record achievement
      const { error: achievementError } = await supabase
        .from('follower_achievements')
        .insert({
          follower_id: followerId,
          achievement_type: 'tier_upgrade',
          milestone_id: nextMilestone.id,
          points_earned: 50 * nextMilestone.tier_level
        });

      if (achievementError) throw achievementError;

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follower-achievements'] });
      queryClient.invalidateQueries({ queryKey: ['promoter-followers'] });
    }
  });

  // Calculate badge progress
  const calculateBadgeProgress = (followerId: string, followerData: any): BadgeProgress[] => {
    return badges.map(badge => {
      const earned = false; // This would be checked against achievements
      let progress_percentage = 0;
      const current_progress: Record<string, any> = {};
      const missing_requirements: Record<string, any> = {};

      // Calculate progress based on badge category and requirements
      switch (badge.category) {
        case 'engagement':
          if (badge.name === 'Early Bird') {
            const engagements = followerData?.engagement_count || 0;
            progress_percentage = Math.min(100, (engagements / 5) * 100);
            current_progress.engagements = engagements;
            if (engagements < 5) missing_requirements.engagements_needed = 5 - engagements;
          }
          break;
        case 'loyalty':
          if (badge.name === 'Long-term Follower') {
            const followDays = followerData?.follow_days || 0;
            progress_percentage = Math.min(100, (followDays / 180) * 100);
            current_progress.follow_days = followDays;
            if (followDays < 180) missing_requirements.days_needed = 180 - followDays;
          }
          break;
        // Add more badge calculations here
      }

      return {
        badge,
        earned,
        progress_percentage,
        current_progress,
        missing_requirements
      };
    });
  };

  // Calculate tier progress
  const calculateTierProgress = (followerData: any, loyaltyPoints: LoyaltyPoints | null): TierProgress => {
    const currentTier = followerData?.loyalty_tier_level || 1;
    const currentMilestone = milestones.find(m => m.tier_level === currentTier);
    const nextMilestone = milestones.find(m => m.tier_level === currentTier + 1);

    const requirements_met: Record<string, boolean> = {};
    let progress_percentage = 0;

    if (nextMilestone) {
      const pointsReq = nextMilestone.points_threshold || 0;
      const engagementReq = nextMilestone.engagement_threshold || 0;
      const timeReq = nextMilestone.time_requirement_days || 0;

      const currentPoints = loyaltyPoints?.lifetime_points || 0;
      const currentEngagement = followerData?.engagement_score || 0;
      const followDays = followerData?.follow_days || 0;

      requirements_met.points = currentPoints >= pointsReq;
      requirements_met.engagement = currentEngagement >= engagementReq;
      requirements_met.time = followDays >= timeReq;

      // Calculate overall progress
      const metCount = Object.values(requirements_met).filter(Boolean).length;
      progress_percentage = (metCount / 3) * 100;
    }

    return {
      current_tier: currentTier,
      current_tier_name: currentMilestone?.milestone_name || 'Bronze Tier',
      next_tier: nextMilestone?.tier_level,
      next_tier_name: nextMilestone?.milestone_name,
      progress_percentage,
      requirements_met,
      points_to_next_tier: nextMilestone ? (nextMilestone.points_threshold || 0) - (loyaltyPoints?.lifetime_points || 0) : 0,
      days_to_next_tier: nextMilestone ? (nextMilestone.time_requirement_days || 0) - (followerData?.follow_days || 0) : 0
    };
  };

  const getTierName = (tierLevel: number): string => {
    const tierMap: Record<number, string> = {
      1: 'bronze',
      2: 'silver', 
      3: 'gold',
      4: 'platinum',
      5: 'diamond'
    };
    return tierMap[tierLevel] || 'bronze';
  };

  return {
    badges,
    milestones,
    rewards,
    badgesLoading,
    milestonesLoading,
    rewardsLoading,
    awardBadge,
    processTierUpgrade,
    fetchFollowerAchievements,
    fetchLoyaltyPoints,
    calculateBadgeProgress,
    calculateTierProgress
  };
}
