
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkFeatureAccess, batchCheckFeatureAccess } from '../api';
import { FEATURES } from '../registry';
import { supabase } from '@/lib/supabase';
import { getCachedFeatureAccess, cacheFeatureAccess, clearFeatureAccessCache } from '../cache';

// Mock the Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
    rpc: vi.fn(),
  },
}));

// Performance tests for feature access system
describe('Feature Access Performance Tests', () => {
  const TEST_USER_ID = 'test-performance-user';
  
  beforeEach(() => {
    vi.resetAllMocks();
    clearFeatureAccessCache();
    
    // Mock authenticated session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: { id: TEST_USER_ID },
        },
      },
      error: null,
    } as any);
  });

  it('should use cache for repeated feature access checks', async () => {
    // Mock RPC call for first check
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: true,
      error: null,
    } as any);
    
    // First check should make an API call
    const firstResult = await checkFeatureAccess(FEATURES.ADVANCED_ANALYTICS);
    expect(firstResult).toBe(true);
    expect(supabase.rpc).toHaveBeenCalledTimes(1);
    
    // Reset mock to verify no more calls
    vi.mocked(supabase.rpc).mockReset();
    
    // Second check should use cache
    const secondResult = await checkFeatureAccess(FEATURES.ADVANCED_ANALYTICS);
    expect(secondResult).toBe(true);
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it('should batch feature access checks efficiently', async () => {
    // Pre-cache some features
    cacheFeatureAccess(TEST_USER_ID, FEATURES.SOCIAL_SHARING, true);
    cacheFeatureAccess(TEST_USER_ID, FEATURES.PRIORITY_SUPPORT, false);
    
    // Mock RPC call for uncached features
    vi.mocked(supabase.rpc)
      .mockResolvedValueOnce({ data: true, error: null } as any)  // BULK_MESSAGING
      .mockResolvedValueOnce({ data: false, error: null } as any); // CUSTOM_BRANDING
    
    // Check multiple features at once
    const result = await batchCheckFeatureAccess([
      FEATURES.SOCIAL_SHARING,      // cached: true
      FEATURES.PRIORITY_SUPPORT,    // cached: false
      FEATURES.BULK_MESSAGING,      // uncached: true
      FEATURES.CUSTOM_BRANDING,     // uncached: false
    ]);
    
    // Verify results
    expect(result).toEqual({
      [FEATURES.SOCIAL_SHARING]: true,
      [FEATURES.PRIORITY_SUPPORT]: false,
      [FEATURES.BULK_MESSAGING]: true,
      [FEATURES.CUSTOM_BRANDING]: false,
    });
    
    // Verify we only made API calls for uncached features
    expect(supabase.rpc).toHaveBeenCalledTimes(2);
  });

  it('should handle high volume of feature checks efficiently', async () => {
    // Mock RPC to always return true
    vi.mocked(supabase.rpc).mockResolvedValue({ data: true, error: null } as any);
    
    // Track execution time
    const start = Date.now();
    
    // Make 100 feature checks
    const featureIds = Object.values(FEATURES);
    const promises = [];
    
    for (let i = 0; i < 100; i++) {
      const featureId = featureIds[i % featureIds.length];
      promises.push(checkFeatureAccess(featureId));
    }
    
    const results = await Promise.all(promises);
    const duration = Date.now() - start;
    
    // All checks should succeed
    expect(results.every(Boolean)).toBe(true);
    
    // Due to caching, we should have made far fewer API calls than checks
    const expectedMaxCalls = featureIds.length; // At most one call per unique feature
    expect(vi.mocked(supabase.rpc).mock.calls.length).toBeLessThanOrEqual(expectedMaxCalls);
    
    // Log performance metrics
    console.log(`Performance test completed in ${duration}ms with ${vi.mocked(supabase.rpc).mock.calls.length} API calls for 100 feature checks`);
  });
});
