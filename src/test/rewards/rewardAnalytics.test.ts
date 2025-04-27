
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rewardsApi } from '@/lib/rewards/api';
import { supabase } from '@/lib/supabase';
import { createMockQueryBuilder } from '../utils/supabaseTestUtils';

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
      const mockTransactions = [
        { transaction_type: 'earn', points: 100 },
        { transaction_type: 'earn', points: 50 },
        { transaction_type: 'redeem', points: 75 }
      ];

      const analytics = rewardsApi.processRewardAnalytics(mockTransactions);
      
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
      const mockTransactions = [
        { 
          transaction_type: 'earn', 
          points: 100,
          created_at: '2025-01-01T12:00:00Z'
        },
        {
          transaction_type: 'earn',
          points: 50,
          created_at: '2025-01-01T14:00:00Z'
        },
        {
          transaction_type: 'redeem',
          points: 75,
          created_at: '2025-01-02T12:00:00Z'
        }
      ];

      const timeSeriesData = rewardsApi.createTimeSeriesData(mockTransactions);
      
      expect(timeSeriesData).toHaveLength(2);
      expect(timeSeriesData[0].pointsEarned).toBe(150);
      expect(timeSeriesData[1].pointsRedeemed).toBe(75);
    });
  });
});
