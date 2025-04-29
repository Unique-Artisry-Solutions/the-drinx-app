
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

// Skip these tests in regular test runs as they're for load testing
describe.skip('Reward System Load Testing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up basic mocks
    vi.mocked(supabase.from).mockImplementation(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      // Add missing properties to satisfy TypeScript
      eq: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
      url: '',
      headers: {},
      single: vi.fn(),
      maybeSingle: vi.fn(),
    } as any));
    
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: { success: true },
      error: null
    } as any);
  });

  it('should handle high volume point additions (100 concurrent operations)', async () => {
    // Create 100 point addition operations
    const operations = Array.from({ length: 100 }, (_, i) => ({
      userId: `user-${i + 1}`,
      points: Math.floor(Math.random() * 100) + 1,
      source: 'load-test'
    }));
    
    // Track how many operations complete successfully
    let successful = 0;
    let failed = 0;
    
    // Process all operations concurrently
    const startTime = performance.now();
    
    const results = await Promise.all(
      operations.map(op => 
        rewardsApi.addPoints(op.userId, op.points, op.source)
          .then(result => {
            if (result.success) successful++;
            else failed++;
            return result;
          })
      )
    );
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgTimePerOperation = totalTime / operations.length;
    
    console.log(`Load test results:
      Total operations: ${operations.length}
      Successful: ${successful}
      Failed: ${failed}
      Total time: ${totalTime.toFixed(2)}ms
      Avg time per operation: ${avgTimePerOperation.toFixed(2)}ms
    `);
    
    expect(successful).toBeGreaterThan(0);
  });

  it('should handle simulated reward rush (many concurrent redemptions)', async () => {
    // Set up custom mocks for the redemption rush test
    const mockOffering = {
      id: 'limited-offer',
      name: 'Flash Sale Reward',
      points_required: 500,
      quantity_available: 50, // Only 50 available
      is_active: true
    };
    
    // Track redemption stats
    let successful = 0;
    let insufficientPoints = 0;
    let otherFailures = 0;
    
    // Mock a user points function that gives random point balances
    const getUserPoints = (userId: string) => {
      // 60% of users have enough points, 40% don't
      const hasEnoughPoints = Math.random() < 0.6;
      return hasEnoughPoints ? 600 : 300;
    };
    
    // Setup redemption mocks with quantity tracking
    let remainingQuantity = mockOffering.quantity_available;
    
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'reward_offerings') {
        return {
          select: vi.fn().mockImplementation(() => ({
            eq: vi.fn().mockImplementation(() => ({
              single: vi.fn().mockResolvedValue({
                data: { ...mockOffering, quantity_available: remainingQuantity },
                error: null
              })
            }))
          })),
          // Add missing properties to satisfy TypeScript
          insert: vi.fn(),
          update: vi.fn(),
          upsert: vi.fn(),
          delete: vi.fn(),
          url: '',
          headers: {},
          maybeSingle: vi.fn(),
        } as any;
      }
      
      if (table === 'user_rewards') {
        return {
          select: vi.fn().mockImplementation(() => ({
            eq: vi.fn().mockImplementation((_, userId) => ({
              single: vi.fn().mockResolvedValue({
                data: { 
                  points: getUserPoints(userId as string),
                  user_id: userId
                },
                error: null
              })
            }))
          })),
          // Add missing properties to satisfy TypeScript
          insert: vi.fn(),
          update: vi.fn(),
          upsert: vi.fn(),
          delete: vi.fn(),
          url: '',
          headers: {},
          maybeSingle: vi.fn(),
        } as any;
      }
      
      if (table === 'reward_redemptions') {
        return {
          insert: vi.fn().mockImplementation(() => {
            if (remainingQuantity > 0) {
              remainingQuantity--;
              return Promise.resolve({
                data: { id: `redemption-${Date.now()}` },
                error: null
              });
            } else {
              return Promise.resolve({
                data: null,
                error: { message: 'No more rewards available' }
              });
            }
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
        } as any;
      }
      
      return createMockQueryBuilder();
    });
    
    // Create 100 concurrent redemption requests
    const users = Array.from({ length: 100 }, (_, i) => `user-${i + 1}`);
    
    const startTime = performance.now();
    
    const results = await Promise.all(
      users.map(userId => 
        rewardsApi.redeemReward(userId, mockOffering.id)
          .then(result => {
            if (result.success) successful++;
            else if (result.error?.includes('Insufficient points')) insufficientPoints++;
            else otherFailures++;
            return result;
          })
      )
    );
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    console.log(`Reward rush test results:
      Total redemption attempts: ${users.length}
      Successful: ${successful}
      Failed (insufficient points): ${insufficientPoints}
      Failed (other reasons): ${otherFailures}
      Remaining inventory: ${remainingQuantity}
      Total time: ${totalTime.toFixed(2)}ms
    `);
    
    // We expect all the inventory to be gone
    expect(remainingQuantity).toBe(0);
    // And the number of successful redemptions should match initial quantity
    expect(successful).toBe(mockOffering.quantity_available);
  });
});
