
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { FEATURES } from '../registry';
import { checkFeatureAccess, trackFeatureEvent, batchCheckFeatureAccess } from '../api';
import { supabase } from '@/lib/supabase';
import { clearFeatureAccessCache, getCachedFeatureAccess } from '../cache';

// E2E test file that simulates end-to-end scenarios for the feature access system

// Mock Supabase for testing
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
    },
    rpc: vi.fn(),
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(),
          single: vi.fn()
        })),
      })),
      insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

describe('Feature Access System: End-to-End Tests', () => {
  const TEST_USER_ID = 'test-e2e-user';
  const TEST_ADMIN_ID = 'test-e2e-admin';

  beforeAll(() => {
    clearFeatureAccessCache();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  // Helper function to simulate login as a specific user
  const loginAs = async (userId: string, isAdmin: boolean = false) => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          user: { 
            id: userId,
            user_metadata: { user_type: isAdmin ? 'admin' : 'individual' }
          },
        },
      },
      error: null,
    } as any);
  };

  describe('User Journey: New Free Tier User', () => {
    beforeAll(async () => {
      await loginAs('new-free-user');
      clearFeatureAccessCache();
    });

    it('should have access only to free tier features', async () => {
      vi.mocked(supabase.rpc)
        .mockResolvedValueOnce({ data: true, error: null } as any)   // SOCIAL_SHARING is enabled
        .mockResolvedValueOnce({ data: false, error: null } as any); // ADVANCED_ANALYTICS is disabled

      // Basic feature that should be enabled for free tier
      const hasSocialSharing = await checkFeatureAccess(FEATURES.SOCIAL_SHARING);
      expect(hasSocialSharing).toBe(true);
      
      // Premium feature that should be disabled for free tier
      const hasAdvancedAnalytics = await checkFeatureAccess(FEATURES.ADVANCED_ANALYTICS);
      expect(hasAdvancedAnalytics).toBe(false);
    });

    it('should track feature access attempts', async () => {
      // Mock the feature lookup
      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'feature_flags') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'feature-123' },
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
          insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
        } as any;
      });

      await trackFeatureEvent(FEATURES.ADVANCED_ANALYTICS, 'attempt_access');
      
      // Verify metrics were logged
      expect(supabase.from).toHaveBeenCalledWith('feature_metrics');
    });
  });

  describe('User Journey: Premium Tier User', () => {
    beforeAll(async () => {
      await loginAs('premium-user');
      clearFeatureAccessCache();
    });

    it('should have access to both free and premium features', async () => {
      vi.mocked(supabase.rpc)
        .mockResolvedValue({ data: true, error: null } as any); // All features enabled

      const results = await batchCheckFeatureAccess([
        FEATURES.SOCIAL_SHARING,
        FEATURES.ADVANCED_ANALYTICS,
        FEATURES.BULK_MESSAGING
      ]);
      
      expect(results[FEATURES.SOCIAL_SHARING]).toBe(true);
      expect(results[FEATURES.ADVANCED_ANALYTICS]).toBe(true);
      expect(results[FEATURES.BULK_MESSAGING]).toBe(true);
    });
  });

  describe('User Journey: Admin User', () => {
    beforeAll(async () => {
      await loginAs('admin-user', true);
      clearFeatureAccessCache();
    });

    it('should have access to all features automatically', async () => {
      // Admin user should have access without even hitting the API
      const results = await batchCheckFeatureAccess([
        FEATURES.ADVANCED_ANALYTICS,
        FEATURES.CUSTOM_BRANDING
      ]);
      
      expect(results[FEATURES.ADVANCED_ANALYTICS]).toBe(true);
      expect(results[FEATURES.CUSTOM_BRANDING]).toBe(true);
      
      // Verify the API was not called for admin users
      expect(supabase.rpc).not.toHaveBeenCalled();
    });
  });

  describe('Caching Behavior', () => {
    beforeAll(async () => {
      await loginAs('cache-test-user');
      clearFeatureAccessCache();
    });

    it('should cache feature access results', async () => {
      vi.mocked(supabase.rpc).mockResolvedValue({ data: true, error: null } as any);
      
      // First call should hit the API
      await checkFeatureAccess(FEATURES.BULK_MESSAGING);
      expect(supabase.rpc).toHaveBeenCalledTimes(1);
      
      // Reset the mock to verify no more calls
      vi.mocked(supabase.rpc).mockReset();
      vi.mocked(supabase.rpc).mockResolvedValue({ data: true, error: null } as any);
      
      // Second call should use cache
      await checkFeatureAccess(FEATURES.BULK_MESSAGING);
      expect(supabase.rpc).not.toHaveBeenCalled();
      
      // Verify we can read from cache directly
      const cachedValue = getCachedFeatureAccess('cache-test-user', FEATURES.BULK_MESSAGING);
      expect(cachedValue).toBe(true);
    });

    it('should clear cache on logout', async () => {
      // First set some cached values
      vi.mocked(supabase.rpc).mockResolvedValue({ data: true, error: null } as any);
      await checkFeatureAccess(FEATURES.SOCIAL_SHARING);
      
      // Simulate logout
      const mockAuthChangeCallback = vi.mocked(supabase.auth.onAuthStateChange).mock.calls[0][1];
      mockAuthChangeCallback('SIGNED_OUT', { user: null, session: null });
      
      // Cache should be cleared
      const cachedValue = getCachedFeatureAccess('cache-test-user', FEATURES.SOCIAL_SHARING);
      expect(cachedValue).toBe(null);
    });
  });
});
