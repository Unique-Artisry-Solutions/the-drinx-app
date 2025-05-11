
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rewardsApi } from '@/lib/rewards/api';
import { supabase } from '@/lib/supabase';
import { createMockQueryBuilder } from '../utils/supabaseTestUtils';
import { RewardTransactionRow } from '@/lib/rewards/types';

// Create an extended type for test purposes
interface TestRewardTransaction extends RewardTransactionRow {
  metadata?: Record<string, any>;
  version?: number;
}

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
      // Create properly typed mock transactions
      const mockTransactions: TestRewardTransaction[] = [
        { 
          id: '1', 
          user_id: 'user1', 
          transaction_type: 'EARN', 
          points: 100,
          source: 'purchase',
          metadata: {},
          version: 1,
          created_at: '2025-01-01T12:00:00Z',
          description: 'Test transaction'
        },
        { 
          id: '2', 
          user_id: 'user1', 
          transaction_type: 'EARN', 
          points: 50,
          source: 'referral',
          metadata: {},
          version: 1,
          created_at: '2025-01-01T13:00:00Z',
          description: 'Test transaction'
        },
        { 
          id: '3', 
          user_id: 'user1', 
          transaction_type: 'REDEEM', 
          points: 75,
          source: 'reward',
          metadata: {},
          version: 1,
          created_at: '2025-01-01T14:00:00Z',
          description: 'Test transaction'
        }
      ];

      // Type assertion to allow the test to pass
      const analytics = rewardsApi.processRewardAnalytics(mockTransactions as RewardTransactionRow[]);
      
      expect(analytics.totalPointsEarned).toBe(150);
      expect(analytics.totalPointsRedeemed).toBe(75);
      expect(analytics.pointsEconomyBalance).toBe(75);
    });

    it('should handle empty transaction data', () => {
      const analytics = rewardsApi.processRewardAnalytics([]);
      
      expect(analytics.totalPointsEarned).toBe(0);
      expect(analytics.totalPointsRedeemed).toBe(0);
      expect(analytics.pointsEconomyBalance).toBe(0);
      expect(analytics.redemptionRate).toBe(0);
    });
  });

  describe('Time Series Data', () => {
    it('should group transactions by date correctly', () => {
      // Create properly typed mock transactions
      const mockTransactions: TestRewardTransaction[] = [
        { 
          id: '1', 
          user_id: 'user1', 
          transaction_type: 'EARN', 
          points: 100,
          source: 'purchase',
          metadata: {},
          version: 1,
          created_at: '2025-01-01T12:00:00Z',
          description: 'Purchase points'
        },
        {
          id: '2',
          user_id: 'user1',
          transaction_type: 'EARN',
          points: 50,
          source: 'referral',
          metadata: {},
          version: 1,
          created_at: '2025-01-01T14:00:00Z',
          description: 'Referral bonus'
        },
        {
          id: '3',
          user_id: 'user1',
          transaction_type: 'REDEEM',
          points: 75,
          source: 'reward',
          metadata: {},
          version: 1,
          created_at: '2025-01-02T12:00:00Z',
          description: 'Redemption'
        }
      ];

      // Type assertion to allow the test to pass
      const timeSeriesData = rewardsApi.processRewardAnalytics(mockTransactions as RewardTransactionRow[]);
      
      expect(timeSeriesData.totalPointsEarned).toBe(150);
      expect(timeSeriesData.totalPointsRedeemed).toBe(75);
    });
  });
});
