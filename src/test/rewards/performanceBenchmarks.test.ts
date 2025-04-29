
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

// Define benchmark thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  SINGLE_POINT_OPERATION: 50,
  BATCH_POINT_OPERATION: 100,
  REDEMPTION_OPERATION: 75,
  PROFILE_FETCH: 40
};

describe('Reward System Performance Benchmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up basic mocks that return quickly
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({
            data: { id: 'mock-id', points: 500 },
            error: null
          })
        }))
      })),
      insert: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
      // Add missing properties to satisfy TypeScript
      update: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
      url: '',
      headers: {},
      maybeSingle: vi.fn(),
    } as any));

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: { success: true },
      error: null
    } as any);
  });

  it('should add points within performance threshold', async () => {
    const startTime = performance.now();
    
    await rewardsApi.addPoints('user-123', 100, 'benchmark');
    
    const endTime = performance.now();
    const operationTime = endTime - startTime;
    
    expect(operationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_POINT_OPERATION);
  });

  it('should process batch operations within performance threshold', async () => {
    // Mock batch operations for 10 users
    const operations = Array.from({ length: 10 }, (_, i) => ({
      userId: `user-${i + 1}`,
      points: 100,
      source: 'benchmark'
    }));
    
    // Mock RPC response
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: operations.map((op, i) => ({
        success: true,
        user_id: op.userId,
        points_change: op.points,
        new_balance: (i + 1) * 100
      })),
      error: null
    } as any);
    
    const startTime = performance.now();
    
    await rewardsApi.batchUpdatePoints(operations);
    
    const endTime = performance.now();
    const operationTime = endTime - startTime;
    
    expect(operationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.BATCH_POINT_OPERATION);
  });

  it('should fetch user profile within performance threshold', async () => {
    // Set up more complex mock for profile fetch
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({
        data: [
          { 
            id: 'user-reward-1',
            user_id: 'user-123',
            points: 500,
            lifetime_points: 1500,
            current_tier_id: 'tier-2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString() 
          }
        ],
        error: null
      }),
      // Add missing properties to satisfy TypeScript
      insert: vi.fn(),
      update: vi.fn(),
      eq: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
      url: '',
      headers: {},
      single: vi.fn(),
      maybeSingle: vi.fn(),
    } as any));
    
    const startTime = performance.now();
    
    await rewardsApi.getUserRewardProfile('user-123');
    
    const endTime = performance.now();
    const operationTime = endTime - startTime;
    
    expect(operationTime).toBeLessThan(PERFORMANCE_THRESHOLDS.PROFILE_FETCH);
  });
});
