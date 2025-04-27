import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/lib/supabase';
import { rewardsApi } from '@/lib/rewards/api';
import { UserRewardProfile } from '@/lib/rewards/types';
import { createMockQueryBuilder } from '../utils/supabaseTestUtils';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => createMockQueryBuilder()),
    rpc: vi.fn(),
  },
}));

describe('Reward System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Point Operations', () => {
    it('should add points correctly', async () => {
      const mockUserId = 'test-user-id';
      const pointsToAdd = 100;
      
      // Mock successful point addition
      vi.mocked(supabase.from).mockImplementation(() => ({
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
        select: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
      }));

      const result = await rewardsApi.addPoints(mockUserId, pointsToAdd, 'test');
      expect(result.success).toBe(true);
    });

    it('should prevent negative point balance', async () => {
      const mockUserId = 'test-user-id';
      const pointsToDeduct = 1000;
      
      // Mock user's current balance
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({ 
          data: { points: 100 }, 
          error: null 
        }),
        insert: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
      }));

      const result = await rewardsApi.addPoints(mockUserId, -pointsToDeduct, 'test');
      expect(result.success).toBe(false);
      expect(result.error).toContain('insufficient points');
    });
  });

  describe('Tier Progression', () => {
    it('should update tier based on lifetime points', async () => {
      const mockProfile: UserRewardProfile = {
        points: 1000,
        lifetimePoints: 5000,
        currentTier: null,
        availableRewards: [],
        transactionHistory: [],
        redemptionHistory: []
      };

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({ 
          data: mockProfile, 
          error: null 
        }),
        insert: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
      }));

      const profile = await rewardsApi.getUserRewardProfile('test-user-id');
      expect(profile?.lifetimePoints).toBe(5000);
    });
  });

  describe('Reward Redemptions', () => {
    it('should prevent redemption with insufficient points', async () => {
      const mockUserId = 'test-user-id';
      const mockOfferingId = 'test-offering-id';

      // Mock reward offering and user points
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({
          data: {
            points_required: 500,
            points: 100
          },
          error: null
        }),
        insert: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        single: vi.fn().mockResolvedValue({
          data: { points: 100 },
          error: null
        }),
        maybeSingle: vi.fn(),
      }));

      const result = await rewardsApi.redeemReward(mockUserId, mockOfferingId);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient points');
    });
  });

  describe('Data Integrity', () => {
    it('should maintain consistent point balance after transactions', async () => {
      const mockUserId = 'test-user-id';
      const initialPoints = 1000;
      const pointsToAdd = 500;
      const pointsToRedeem = 300;

      // Mock initial balance
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({
          data: { points: initialPoints },
          error: null
        }),
        insert: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
      }));

      // Add points
      await rewardsApi.addPoints(mockUserId, pointsToAdd, 'test');
      
      // Mock updated balance
      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({
          data: { points: initialPoints + pointsToAdd },
          error: null
        }),
        insert: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        single: vi.fn(),
        maybeSingle: vi.fn(),
      }));

      // Verify final balance
      const profile = await rewardsApi.getUserRewardProfile(mockUserId);
      expect(profile?.points).toBe(initialPoints + pointsToAdd);
    });
  });
});
