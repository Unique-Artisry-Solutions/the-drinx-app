
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { rewardsApi } from '@/lib/rewards/api';
import { UserRewardProfile } from '@/lib/rewards/types';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useRewardTracking } from '@/hooks/rewards/useRewardTracking';

export function useRewards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { track } = useAnalytics();
  const rewardTracking = useRewardTracking();
  const [isEnabled, setIsEnabled] = useState(false);
  const [rewardProfile, setRewardProfile] = useState<UserRewardProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFeatureFlag = async () => {
      const enabled = await rewardsApi.isRewardsEnabled();
      setIsEnabled(enabled);
      
      // Track program discovery event if enabled
      if (enabled && user?.id) {
        rewardTracking.trackFunnelStep('discovery', { 
          feature_enabled: true 
        });
      }
    };

    checkFeatureFlag();
  }, [user?.id]);

  useEffect(() => {
    const loadRewardProfile = async () => {
      if (!user?.id || !isEnabled) return;

      setIsLoading(true);
      const profile = await rewardsApi.getUserRewardProfile(user.id);
      setRewardProfile(profile);
      setIsLoading(false);
      
      // Track profile view
      rewardTracking.trackProfileView();
      
      // Track enrollment event if this appears to be the first profile load
      const isFirstEnrollmentLoad = !localStorage.getItem(`user_${user.id}_profile_loaded`);
      if (isFirstEnrollmentLoad) {
        localStorage.setItem(`user_${user.id}_profile_loaded`, 'true');
        
        // Set enrollment date for cohort tracking if not already set
        if (!localStorage.getItem(`user_${user.id}_enrollment_date`)) {
          localStorage.setItem(`user_${user.id}_enrollment_date`, new Date().toISOString());
          localStorage.setItem(`user_${user.id}_enrollment_cohort`, getMonthYearCohort());
          
          // Track enrollment event
          rewardTracking.trackFunnelStep('enrollment', {
            initial_tier: profile?.currentTier?.name || 'none',
            enrollment_cohort: getMonthYearCohort()
          });
        }
      }
    };

    loadRewardProfile();
  }, [user?.id, isEnabled]);

  const addPoints = async (points: number, source: string, metadata = {}) => {
    if (!user?.id) return;

    // Track points addition attempt
    track('reward_points_add_attempt', { points, source });
    
    const result = await rewardsApi.addPoints(user.id, points, source, metadata);
    
    if (result.success) {
      toast({
        title: "Points Added",
        description: `${points} points have been added to your account`,
      });
      
      // Track successful points addition
      track('reward_points_added', { points, source, success: true });
      
      // Track with enhanced reward tracking
      rewardTracking.trackPointsEarned(points, source, metadata);
      
      // Refresh profile
      const profile = await rewardsApi.getUserRewardProfile(user.id);
      
      // Check for tier changes
      if (rewardProfile?.currentTier?.id !== profile.currentTier?.id) {
        const previousTier = rewardProfile?.currentTier?.name ? 
          parseInt(rewardProfile.currentTier.name.split(' ')[1]) || 1 : 1;
        
        const newTier = profile.currentTier?.name ? 
          parseInt(profile.currentTier.name.split(' ')[1]) || 1 : 1;
        
        // Track tier change
        if (previousTier !== newTier) {
          rewardTracking.trackTierChange(previousTier, newTier, {
            points_trigger: points,
            source: source
          });
        }
      }
      
      setRewardProfile(profile);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add points",
        variant: "destructive",
      });
      
      // Track failed points addition
      track('reward_points_added', { points, source, success: false, error: result.error });
    }
  };

  const redeemReward = async (offeringId: string) => {
    if (!user?.id) return;

    // Get reward details for analytics
    const reward = rewardProfile?.availableRewards.find(r => r.id === offeringId);
    
    // Track analytics event
    track('reward_redemption_attempt', { 
      offering_id: offeringId,
      points_required: reward?.points_required || 0,
      reward_name: reward?.name || 'Unknown'
    });

    // Track with enhanced reward tracking
    if (reward) {
      rewardTracking.trackRewardViewed(offeringId, reward.name, {
        points_required: reward.points_required,
        redemption_attempt: true
      });
    }

    const result = await rewardsApi.redeemReward(user.id, offeringId);
    
    if (result.success) {
      toast({
        title: "Reward Redeemed",
        description: "Your reward has been redeemed successfully",
      });
      
      // Track successful redemption
      track('reward_redemption_complete', { 
        offering_id: offeringId,
        points_required: reward?.points_required || 0,
        reward_name: reward?.name || 'Unknown',
        success: true
      });
      
      // Track with enhanced reward tracking
      if (reward) {
        rewardTracking.trackRewardRedeemed(offeringId, reward.points_required, {
          reward_name: reward.name
        });
      }
      
      // Refresh profile
      const profile = await rewardsApi.getUserRewardProfile(user.id);
      setRewardProfile(profile);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to redeem reward",
        variant: "destructive",
      });
      
      // Track failed redemption
      track('reward_redemption_complete', { 
        offering_id: offeringId,
        points_required: reward?.points_required || 0,
        reward_name: reward?.name || 'Unknown',
        success: false,
        error: result.error
      });
      
      // Track abandoned redemption
      if (reward) {
        rewardTracking.trackAbandonedRedemption(offeringId, result.error || 'Unknown error');
      }
    }
  };
  
  // Expose the tracking hooks for direct use
  const trackRewardActivity = rewardTracking;

  return {
    isEnabled,
    isLoading,
    rewardProfile,
    addPoints,
    redeemReward,
    trackRewardActivity
  };
}

// Helper function for cohort naming
function getMonthYearCohort(): string {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month}-${year}`;
}
