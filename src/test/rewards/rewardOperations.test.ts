
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/lib/supabase';
import { rewardsApi } from '@/lib/rewards/api';
import { createMockQueryBuilder } from '../utils/supabaseTestUtils';
import { RewardOperationResponse } from '@/lib/rewards/types';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => createMockQueryBuilder()),
    rpc: vi.fn(),
  },
}));

describe('Reward Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addPoints', () => {
    it('should successfully add points to a user', async () => {
      // Mock the transaction insert
      vi.mocked(supabase.from).mockImplementation(() => ({
        insert: vi.fn().mockResolvedValue({
          data: { id: 'mock-transaction-id' },
          error: null
        }),
        // Add missing properties to satisfy TypeScript
        select: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        upsert: vi.fn(),
        delete: vi.fn(),
        url: '',
        headers: {},
        single: vi.fn(),
        maybeSingle: vi.fn(),
      } as any));

      // Mock the RPC call
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: { success: true },
        error: null
      } as any);

      const result = await rewardsApi.addPoints('user-123', 100, 'test', { test: true });
      
      expect(result.success).toBe(true);
      expect(vi.mocked(supabase.from)).toHaveBeenCalledWith('reward_transactions');
      expect(vi.mocked(supabase.rpc)).toHaveBeenCalledWith('update_user_points', {
        p_user_id: 'user-123',
        p_points: 100
      });
    });

    it('should handle transaction insert failure', async () => {
      // Mock the transaction insert failure
      vi.mocked(supabase.from).mockImplementation(() => ({
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Failed to insert' }
        }),
        // Add missing properties to satisfy TypeScript
        select: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        upsert: vi.fn(),
        delete: vi.fn(),
        url: '',
        headers: {},
        single: vi.fn(),
        maybeSingle: vi.fn(),
      } as any));

      const result = await rewardsApi.addPoints('user-123', 100, 'test');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to add points');
    });

    it('should handle RPC failure', async () => {
      // Mock the transaction insert success
      vi.mocked(supabase.from).mockImplementation(() => ({
        insert: vi.fn().mockResolvedValue({
          data: { id: 'mock-transaction-id' },
          error: null
        }),
        // Add missing properties to satisfy TypeScript
        select: vi.fn(),
        update: vi.fn(),
        eq: vi.fn(),
        upsert: vi.fn(),
        delete: vi.fn(),
        url: '',
        headers: {},
        single: vi.fn(),
        maybeSingle: vi.fn(),
      } as any));

      // Mock the RPC call failure
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: { message: 'RPC error' }
      } as any);

      const result = await rewardsApi.addPoints('user-123', 100, 'test');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to update points');
    });
  });

  describe('batchUpdatePoints', () => {
    it('should process batch operations successfully', async () => {
      const operations = [
        { userId: 'user-1', points: 100, source: 'test' },
        { userId: 'user-2', points: 200, source: 'test' }
      ];

      const mockResults = [
        { success: true, user_id: 'user-1', points_change: 100, new_balance: 100 },
        { success: true, user_id: 'user-2', points_change: 200, new_balance: 200 }
      ];

      // Mock the RPC call
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: mockResults,
        error: null
      } as any);

      const results = await rewardsApi.batchUpdatePoints(operations);
      
      expect(results.length).toBe(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(vi.mocked(supabase.rpc)).toHaveBeenCalledWith('batch_update_user_points', {
        p_operations: JSON.stringify(operations)
      });
      
      // Use type assertion here since we're returning extended information
      // from our API that isn't in the base RewardOperationResponse
      expect((results[0] as any).userId).toBe('user-1');
      expect((results[1] as any).userId).toBe('user-2');
    });

    it('should handle RPC failure in batch operations', async () => {
      const operations = [
        { userId: 'user-1', points: 100, source: 'test' },
        { userId: 'user-2', points: 200, source: 'test' }
      ];

      // Mock the RPC call failure
      vi.mocked(supabase.rpc).mockResolvedValue({
        data: null,
        error: { message: 'Batch update failed' }
      } as any);

      const results = await rewardsApi.batchUpdatePoints(operations);
      
      expect(results.length).toBe(2);
      expect(results[0].success).toBe(false);
      expect(results[0].error).toBe('Batch operation failed');
      expect(results[1].success).toBe(false);
      expect(results[1].error).toBe('Batch operation failed');
    });
  });
});
