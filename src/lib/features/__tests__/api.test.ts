
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkFeatureAccess, trackFeatureEvent, batchCheckFeatureAccess } from '../api';
import { FEATURES } from '../registry';
import { supabase } from '@/lib/supabase';

// Mock the Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    rpc: vi.fn(),
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(),
    })),
  },
}));

describe('Feature API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should deny feature access when user is not logged in', async () => {
    // Mock no session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    } as any);

    const result = await checkFeatureAccess(FEATURES.ADVANCED_ANALYTICS);
    expect(result).toBe(false);
  });

  it('should check feature access for authenticated user', async () => {
    // Mock authenticated session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123' },
        },
      },
      error: null,
    } as any);

    // Mock RPC call response
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: true,
      error: null,
    } as any);

    const result = await checkFeatureAccess(FEATURES.ADVANCED_ANALYTICS);
    expect(result).toBe(true);
    
    // Verify RPC was called correctly
    expect(supabase.rpc).toHaveBeenCalledWith(
      'check_feature_access',
      { p_feature_name: FEATURES.ADVANCED_ANALYTICS }
    );
  });

  it('should handle errors when checking feature access', async () => {
    // Mock authenticated session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123' },
        },
      },
      error: null,
    } as any);

    // Mock RPC call with error
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    } as any);

    const result = await checkFeatureAccess(FEATURES.ADVANCED_ANALYTICS);
    expect(result).toBe(false);
  });

  it('should track feature usage events', async () => {
    // Mock authenticated session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123' },
        },
      },
      error: null,
    } as any);

    // Mock feature lookup
    const mockFrom = vi.mocked(supabase.from);
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'feature-123' },
            error: null,
          }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({
        data: {},
        error: null,
      }),
    } as any);

    await trackFeatureEvent(FEATURES.ADVANCED_ANALYTICS, 'view', { page: 'dashboard' });
    
    // Verify feature lookup
    expect(supabase.from).toHaveBeenCalledWith('feature_flags');
    
    // Verify metrics insertion
    expect(supabase.from).toHaveBeenCalledWith('feature_metrics');
  });

  it('should batch check multiple features', async () => {
    // Mock authenticated session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123' },
        },
      },
      error: null,
    } as any);

    // Mock RPC call responses
    vi.mocked(supabase.rpc)
      .mockResolvedValueOnce({ data: true, error: null } as any)  // For first feature
      .mockResolvedValueOnce({ data: false, error: null } as any); // For second feature

    const result = await batchCheckFeatureAccess([
      FEATURES.ADVANCED_ANALYTICS,
      FEATURES.BULK_MESSAGING
    ]);
    
    expect(result).toEqual({
      [FEATURES.ADVANCED_ANALYTICS]: true,
      [FEATURES.BULK_MESSAGING]: false,
    });
  });
});
