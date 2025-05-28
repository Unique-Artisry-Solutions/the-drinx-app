
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processRewardAnalytics } from '@/lib/rewards/api/analytics';
import { supabase } from '@/lib/supabase';
import { createMockQueryBuilder } from '../utils/supabaseTestUtils';
import { RewardTransaction } from '@/types/rewards';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => createMockQueryBuilder()),
  },
}));

describe('Reward Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Data Processing', () => {
    it('should calculate metrics correctly', () => {
      const mockTransactions: RewardTransaction[] = [
        { 
          id: '1', 
          user_id: 'user1', 
          userId: 'user1',
          transaction_type: 'earn',
          type: 'earned',
          points: 100,
          pointsAmount: 100,
          source: 'purchase',
          timestamp: '2025-01-01T12:00:00Z',
          date: '2025-01-01T12:00:00Z',
          created_at: '2025-01-01T12:00:00Z',
          description: 'Test transaction',
          metadata: {}
        },
        { 
          id: '2', 
          user_id: 'user1',
          userId: 'user1',
          transaction_type: 'earn',
          type: 'earned',
          points: 50,
          pointsAmount: 50,
          source: 'referral',
          timestamp: '2025-01-01T13:00:00Z',
          date: '2025-01-01T13:00:00Z',
          created_at: '2025-01-01T13:00:00Z',
          description: 'Test transaction',
          metadata: {}
        },
        { 
          id: '3', 
          user_id: 'user1',
          userId: 'user1',
          transaction_type: 'redeem',
          type: 'redeemed',
          points: 75,
          pointsAmount: 75,
          source: 'reward',
          timestamp: '2025-01-01T14:00:00Z',
          date: '2025-01-01T14:00:00Z',
          created_at: '2025-01-01T14:00:00Z',
          description: 'Test transaction',
          metadata: {}
        }
      ];

      const analytics = processRewardAnalytics(mockTransactions);
      
      expect(analytics.totalPointsEarned).toBe(150);
      expect(analytics.totalPointsRedeemed).toBe(75);
      expect(analytics.pointsEconomyBalance).toBe(75);
    });

    it('should handle empty transaction data', () => {
      const analytics = processRewardAnalytics([]);
      
      expect(analytics.totalPointsEarned).toBe(0);
      expect(analytics.totalPointsRedeemed).toBe(0);
      expect(analytics.pointsEconomyBalance).toBe(0);
      expect(analytics.redemptionRate).toBe(0);
    });
  });

  describe('Time Series Data', () => {
    it('should group transactions by date correctly', () => {
      const mockTransactions: RewardTransaction[] = [
        { 
          id: '1', 
          user_id: 'user1',
          userId: 'user1',
          transaction_type: 'earn',
          type: 'earned',
          points: 100,
          pointsAmount: 100,
          source: 'purchase',
          timestamp: '2025-01-01T12:00:00Z',
          date: '2025-01-01T12:00:00Z',
          created_at: '2025-01-01T12:00:00Z',
          description: 'Purchase points',
          metadata: {}
        },
        {
          id: '2',
          user_id: 'user1',
          userId: 'user1',
          transaction_type: 'earn',
          type: 'earned',
          points: 50,
          pointsAmount: 50,
          source: 'referral',
          timestamp: '2025-01-01T14:00:00Z',
          date: '2025-01-01T14:00:00Z',
          created_at: '2025-01-01T14:00:00Z',
          description: 'Referral bonus',
          metadata: {}
        },
        {
          id: '3',
          user_id: 'user1',
          userId: 'user1', 
          transaction_type: 'redeem',
          type: 'redeemed',
          points: 75,
          pointsAmount: 75,
          source: 'reward',
          timestamp: '2025-01-02T12:00:00Z',
          date: '2025-01-02T12:00:00Z',
          created_at: '2025-01-02T12:00:00Z',
          description: 'Redemption',
          metadata: {}
        }
      ];

      const analytics = processRewardAnalytics(mockTransactions);
      
      expect(analytics.totalPointsEarned).toBe(150);
      expect(analytics.totalPointsRedeemed).toBe(75);
    });
  });
});
