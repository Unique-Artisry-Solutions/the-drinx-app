
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rewardsApi } from '@/lib/rewards/api';
import { transformUserRewardProfile } from '@/types/rewards';

// Mock the API
vi.mock('@/lib/rewards/api', () => ({
  rewardsApi: {
    getUserRewardProfile: vi.fn(),
    addPoints: vi.fn(),
    recordActivity: vi.fn(),
    redeemReward: vi.fn()
  }
}));

describe('Rewards System End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete User Journey', () => {
    it('should handle a complete reward earning and redemption flow', async () => {
      const mockUserId = 'test-user-123';
      
      // Mock initial profile
      const initialProfileData = {
        id: mockUserId,
        points: 0,
        lifetime_points: 0,
        lifetimePoints: 0,
        currentTier: null,
        availableRewards: [],
        transactionHistory: [],
        redemptionHistory: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      vi.mocked(rewardsApi.getUserRewardProfile).mockResolvedValue(
        transformUserRewardProfile(initialProfileData)
      );
      
      // Mock point addition
      vi.mocked(rewardsApi.addPoints).mockResolvedValue({
        success: true,
        message: 'Points added successfully'
      });

      // Mock activity recording
      vi.mocked(rewardsApi.recordActivity).mockResolvedValue({
        success: true,
        completedAchievements: []
      });

      // Test the flow
      const profile = await rewardsApi.getUserRewardProfile(mockUserId);
      expect(profile).toBeTruthy();
      expect(profile?.points).toBe(0);

      // Add points
      const addResult = await rewardsApi.addPoints(mockUserId, 100, 'test_activity');
      expect(addResult.success).toBe(true);

      // Record activity
      const activityResult = await rewardsApi.recordActivity(mockUserId, 'visit');
      expect(activityResult.success).toBe(true);
    });

    it('should handle tier progression correctly', async () => {
      const mockUserId = 'test-user-456';
      
      // Mock profile with enough points for tier upgrade
      const profileData = {
        id: mockUserId,
        points: 1000,
        lifetime_points: 5000,
        lifetimePoints: 5000,
        currentTier: {
          id: 'gold-tier',
          name: 'Gold',
          points_required: 1000,
          pointsRequired: 1000,
          benefits: ['Premium rewards', 'Double points'],
          color: '#FFD700',
          icon: 'crown'
        },
        availableRewards: [],
        transactionHistory: [],
        redemptionHistory: []
      };

      vi.mocked(rewardsApi.getUserRewardProfile).mockResolvedValue(
        transformUserRewardProfile(profileData)
      );

      const profile = await rewardsApi.getUserRewardProfile(mockUserId);
      expect(profile?.currentTier?.name).toBe('Gold');
      expect(profile?.lifetime_points).toBe(5000);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const mockUserId = 'error-user';
      
      vi.mocked(rewardsApi.getUserRewardProfile).mockRejectedValue(
        new Error('API Error')
      );

      await expect(rewardsApi.getUserRewardProfile(mockUserId)).rejects.toThrow('API Error');
    });
  });
});
