
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

describe('Reward Redemption Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully redeem a reward when user has enough points', async () => {
    const userId = 'user-123';
    const offeringId = 'offering-123';
    
    // Mock the offering
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              id: offeringId,
              name: 'Test Reward',
              points_required: 100,
              is_active: true
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
    } as any));

    // Mock the user reward (points check)
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({
            data: { 
              points: 200,  // User has enough points
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
    } as any));

    // Mock the redemption creation
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      insert: vi.fn().mockResolvedValue({
        data: { id: 'redemption-123' },
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

    // Mock the point deduction
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: { success: true },
      error: null
    } as any);

    const result = await rewardsApi.redeemReward(userId, offeringId);
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('redeemed successfully');
  });

  it('should fail redemption when user has insufficient points', async () => {
    const userId = 'user-123';
    const offeringId = 'offering-123';
    
    // Mock the offering
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({
            data: {
              id: offeringId,
              name: 'Test Reward',
              points_required: 500,
              is_active: true
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
    } as any));

    // Mock the user reward (points check)
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({
            data: { 
              points: 200,  // User doesn't have enough points
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
    } as any));

    const result = await rewardsApi.redeemReward(userId, offeringId);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Insufficient points');
  });

  it('should fail redemption when offering does not exist', async () => {
    const userId = 'user-123';
    const offeringId = 'offering-nonexistent';
    
    // Mock the offering (not found)
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' }
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
    } as any));

    const result = await rewardsApi.redeemReward(userId, offeringId);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Reward offering not found');
  });
});
