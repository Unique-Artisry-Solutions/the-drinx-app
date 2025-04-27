
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/lib/supabase';
import { rewardsApi } from '@/lib/rewards/api';
import { createMockQueryBuilder } from '../utils/supabaseTestUtils';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => createMockQueryBuilder()),
    rpc: vi.fn(),
  },
}));

describe('Reward Rules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rule Processing', () => {
    it('should process conditions correctly', async () => {
      const mockRule = {
        id: 'test-rule',
        name: 'Test Rule',
        conditions: {
          type: 'purchase',
          amount: 50
        },
        points: 100
      };

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({
          data: mockRule,
          error: null
        }),
        insert: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        // Add missing properties to satisfy TypeScript
        upsert: vi.fn(),
        delete: vi.fn(),
        url: '',
        headers: {},
        single: vi.fn(),
        maybeSingle: vi.fn(),
      } as any));

      const event = {
        type: 'purchase',
        amount: 75
      };

      // Track event to trigger rule processing
      const result = await rewardsApi.trackRewardEvent('purchase', 'test-user-id', event);
      expect(result).toBe(true);
    });

    it('should handle multiple rule matches', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          name: 'Rule 1',
          conditions: { type: 'visit' },
          points: 50
        },
        {
          id: 'rule-2',
          name: 'Rule 2',
          conditions: { type: 'visit', isWeekend: true },
          points: 100
        }
      ];

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: vi.fn().mockResolvedValue({
          data: mockRules,
          error: null
        }),
        insert: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        // Add missing properties to satisfy TypeScript
        upsert: vi.fn(),
        delete: vi.fn(),
        url: '',
        headers: {},
        single: vi.fn(),
        maybeSingle: vi.fn(),
      } as any));

      const event = {
        type: 'visit',
        isWeekend: true
      };

      // Track event that matches multiple rules
      const result = await rewardsApi.trackRewardEvent('visit', 'test-user-id', event);
      expect(result).toBe(true);
    });
  });
});
