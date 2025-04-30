
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { rewardsApi } from '@/lib/rewards/api';
import { UserRewardProfile, RewardTier, RewardTransaction } from '@/lib/rewards/types';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useRewardTracking } from '@/hooks/rewards/useRewardTracking';
import { isPreviewEnvironment } from '@/utils/environment';

// In-memory storage for preview environment
const previewStorage = new Map<string, string>();

// Safe localStorage wrapper that uses in-memory storage in preview environment
const safeStorage = {
  getItem: (key: string): string | null => {
    if (isPreviewEnvironment()) {
      return previewStorage.get(key) || null;
    }
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('localStorage.getItem error:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (isPreviewEnvironment()) {
      previewStorage.set(key, value);
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('localStorage.setItem error:', e);
    }
  }
};

// Helper function to get cohort name safely
function getMonthYearCohort(): string {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month}-${year}`;
}

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
      // Skip API calls in preview environment
      if (isPreviewEnvironment()) {
        setIsEnabled(true);
        setIsLoading(false);
        return;
      }
      
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
      // In preview mode, use mock data
      if (isPreviewEnvironment()) {
        // Set mock reward profile for preview with proper types
        setRewardProfile({
          points: 150,
          lifetimePoints: 250,
          currentTier: {
            id: 'tier-1',
            name: 'Level 1',
            description: 'Starting tier',
            points_required: 0,
            benefits: [],
            icon: 'star',
            color: '#FFA500',
            establishment_id: 'default',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          availableRewards: [
            {
              id: 'reward-1',
              name: 'Free Mocktail',
              description: 'Get a free mocktail at any participating venue',
              points_required: 100,
              quantity_available: 10,
              is_active: true,
              image_url: '/mocktail.jpg',
              expiration_days: 30,
              category: 'drinks',
              expires_in: 5,
              establishment_id: 'default'  // Added the required establishment_id property
            }
          ],
          transactionHistory: [
            {
              id: 'trans-1',
              user_id: 'user-1',
              date: new Date().toISOString(),
              points: 50,
              type: 'earn',
              source: 'check-in',
              description: 'Check-in at Coolbar'
            }
          ],
          redemptionHistory: []
        });
        setIsLoading(false);
        return;
      }
      
      if (!user?.id || !isEnabled) return;

      setIsLoading(true);
      try {
        const profile = await rewardsApi.getUserRewardProfile(user.id);
        setRewardProfile(profile);
      
        // Track profile view
        rewardTracking.trackProfileView();
      
        // Track enrollment event if this appears to be the first profile load
        const isFirstEnrollmentLoad = !safeStorage.getItem(`user_${user.id}_profile_loaded`);
        if (isFirstEnrollmentLoad) {
          safeStorage.setItem(`user_${user.id}_profile_loaded`, 'true');
        
          // Set enrollment date for cohort tracking if not already set
          if (!safeStorage.getItem(`user_${user.id}_enrollment_date`)) {
            safeStorage.setItem(`user_${user.id}_enrollment_date`, new Date().toISOString());
            safeStorage.setItem(`user_${user.id}_enrollment_cohort`, getMonthYearCohort());
          
            // Track enrollment event
            rewardTracking.trackFunnelStep('enrollment', {
              initial_tier: profile?.currentTier?.name || 'none',
              enrollment_cohort: getMonthYearCohort()
            });
          }
        }
      } catch (error) {
        console.error('Error loading reward profile:', error);
        // Provide a fallback profile in case of error
        // This way the UI won't break even if the API fails
        setRewardProfile({
          points: 0,
          lifetimePoints: 0,
          currentTier: {
            id: 'tier-1',
            name: 'Level 1',
            description: 'Starting tier',
            points_required: 0,
            benefits: [],
            icon: 'star',
            color: '#FFA500',
            establishment_id: 'default',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          availableRewards: [],
          transactionHistory: [],
          redemptionHistory: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRewardProfile();
  }, [user?.id, isEnabled]);

  const addPoints = async (points: number, source: string, metadata = {}) => {
    if (!user?.id) return;
    
    // Skip API calls in preview environment
    if (isPreviewEnvironment()) {
      toast({
        title: "Points Added (Preview)",
        description: `${points} points would be added in production`,
      });
      return { success: true };
    }

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
    
    return result;
  };

  const redeemReward = async (offeringId: string) => {
    if (!user?.id) return;
    
    // Skip API calls in preview environment
    if (isPreviewEnvironment()) {
      toast({
        title: "Reward Redeemed (Preview)",
        description: `Reward would be redeemed in production`,
      });
      return { success: true };
    }

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
    
    return result;
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
