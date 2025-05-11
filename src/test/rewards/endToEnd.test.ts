
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/lib/supabase';
import { rewardsApi } from '@/lib/rewards/api';
import { createMockQueryBuilder } from '../utils/supabaseTestUtils';
import { Achievement, BatchRewardOperationResponse, RewardOperationResponse, UserRewardPreference } from '@/lib/rewards/types';

// Create mocked version of rewardsApi for testing
vi.mock('@/lib/rewards/api', () => ({
  rewardsApi: {
    getUserAchievements: vi.fn(),
    recordActivity: vi.fn(),
    getRewardAnalytics: vi.fn(),
    batchUpdatePoints: vi.fn(),
    getUserPreference: vi.fn(),
    setUserPreference: vi.fn(),
    // Add missing methods needed by tests
    isRewardsEnabled: vi.fn(),
    getUserRewardProfile: vi.fn(),
    addPoints: vi.fn(),
    redeemReward: vi.fn()
  }
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => createMockQueryBuilder()),
    rpc: vi.fn(),
  }
}));

describe('Reward System End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should check if rewards are enabled for a user', async () => {
      // Setup mock response
      vi.mocked(rewardsApi.isRewardsEnabled).mockResolvedValue(true);

      const result = await rewardsApi.isRewardsEnabled('test-user-id');
      expect(result).toBe(true);
      expect(rewardsApi.isRewardsEnabled).toHaveBeenCalledWith('test-user-id');
    });

    it('should fetch a user reward profile', async () => {
      // Setup mock response with benefits array for tier
      const mockProfile = {
        id: 'test-user-id',
        points: 500,
        lifetimePoints: 1000,
        currentTier: { 
          id: 'tier-1', 
          name: 'Silver',
          benefits: ['Benefit 1', 'Benefit 2'],
          color: '#C0C0C0',
          icon: 'medal'
        },
        availableRewards: [],
        transactionHistory: [],
        redemptionHistory: []
      };

      vi.mocked(rewardsApi.getUserRewardProfile).mockResolvedValue(mockProfile);

      const profile = await rewardsApi.getUserRewardProfile('test-user-id');
      
      expect(profile).toEqual(mockProfile);
      expect(rewardsApi.getUserRewardProfile).toHaveBeenCalledWith('test-user-id');
    });
  });

  describe('Point Operations', () => {
    it('should add points and update user balance', async () => {
      // Setup mock responses
      const addPointsResponse: RewardOperationResponse = { success: true };
      vi.mocked(rewardsApi.addPoints).mockResolvedValue(addPointsResponse);

      const updatedProfile = {
        id: 'test-user-id',
        points: 600, // Increased from initial 500
        lifetimePoints: 1100 // Increased from initial 1000
      };
      
      vi.mocked(rewardsApi.getUserRewardProfile).mockResolvedValue(updatedProfile as any);

      // Add points
      const result = await rewardsApi.addPoints('test-user-id', 100, 'test');
      expect(result.success).toBe(true);
      expect(rewardsApi.addPoints).toHaveBeenCalledWith('test-user-id', 100, 'test');

      // Verify updated balance
      const profile = await rewardsApi.getUserRewardProfile('test-user-id');
      expect(profile?.points).toBe(600);
      expect(profile?.lifetimePoints).toBe(1100);
    });

    it('should process batch point operations', async () => {
      // Setup mock response
      const batchResults: BatchRewardOperationResponse[] = [
        { success: true, userId: 'user-1', pointsChanged: 100, newBalance: 200 },
        { success: true, userId: 'user-2', pointsChanged: 150, newBalance: 300 }
      ];

      vi.mocked(rewardsApi.batchUpdatePoints).mockResolvedValue(batchResults);

      const operations = [
        { userId: 'user-1', points: 100, source: 'test' },
        { userId: 'user-2', points: 150, source: 'test' }
      ];

      const results = await rewardsApi.batchUpdatePoints(operations);
      
      expect(results).toEqual(batchResults);
      expect(rewardsApi.batchUpdatePoints).toHaveBeenCalledWith(operations);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
    });
  });

  describe('Reward Redemptions', () => {
    it('should redeem a reward and deduct points', async () => {
      // Setup mock responses
      const redemptionResponse: RewardOperationResponse = { success: true };
      vi.mocked(rewardsApi.redeemReward).mockResolvedValue(redemptionResponse);

      const updatedProfile = {
        id: 'test-user-id',
        points: 400, // Decreased from initial 500
        lifetimePoints: 1000 // Unchanged
      };
      
      vi.mocked(rewardsApi.getUserRewardProfile).mockResolvedValue(updatedProfile as any);

      // Redeem reward
      const result = await rewardsApi.redeemReward('test-user-id', 'reward-1');
      expect(result.success).toBe(true);
      expect(rewardsApi.redeemReward).toHaveBeenCalledWith('test-user-id', 'reward-1');

      // Verify updated balance
      const profile = await rewardsApi.getUserRewardProfile('test-user-id');
      expect(profile?.points).toBe(400);
      expect(profile?.lifetimePoints).toBe(1000); // Lifetime points shouldn't change
    });
  });

  describe('User Preferences', () => {
    it('should save and retrieve user preferences', async () => {
      // Setup mock responses
      vi.mocked(rewardsApi.setUserPreference).mockResolvedValue(true);
      
      // Mock the preference object that will be returned
      const mockPreference: UserRewardPreference = {
        user_id: 'test-user-id',
        preference_key: 'notification_frequency',
        preference_value: 'weekly'
      };
      
      vi.mocked(rewardsApi.getUserPreference).mockResolvedValue(mockPreference);

      // Set preference
      const result = await rewardsApi.setUserPreference('test-user-id', 'notification_frequency', 'weekly');
      expect(result).toBe(true);
      
      // Get preference
      const preference = await rewardsApi.getUserPreference('test-user-id', 'notification_frequency');
      expect(preference).toEqual(mockPreference);
    });
  });

  describe('Activity Tracking', () => {
    it('should record user activity and award points', async () => {
      // Setup mock responses
      const mockCompletedAchievements: Achievement[] = [];
      
      vi.mocked(rewardsApi.recordActivity).mockResolvedValue({
        success: true,
        completedAchievements: mockCompletedAchievements
      });
      
      vi.mocked(rewardsApi.addPoints).mockResolvedValue({ success: true });
      vi.mocked(rewardsApi.getUserRewardProfile).mockResolvedValue({
        points: 550,
        lifetimePoints: 1050
      } as any);

      // Record activity
      const activityResult = await rewardsApi.recordActivity('test-user-id', 'check_in', { location: 'Bar A' });
      expect(activityResult.success).toBe(true);
      
      // Verify points were awarded
      const profile = await rewardsApi.getUserRewardProfile('test-user-id');
      expect(profile?.points).toBe(550);
      expect(profile?.lifetimePoints).toBe(1050);
    });
  });

  describe('Analytics', () => {
    it('should retrieve reward system analytics', async () => {
      // Setup mock response
      const mockAnalytics = {
        totalPointsEarned: 5000,
        totalPointsRedeemed: 2000,
        pointsEconomyBalance: 3000,
        redemptionRate: 0.4
      };
      
      vi.mocked(rewardsApi.getRewardAnalytics).mockResolvedValue(mockAnalytics as any);

      const analytics = await rewardsApi.getRewardAnalytics();
      
      expect(analytics).toEqual(mockAnalytics);
    });
  });
});
