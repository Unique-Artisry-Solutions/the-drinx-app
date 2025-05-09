
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { FEATURES } from '@/lib/features/registry';
import * as featureApi from '@/lib/features/api';
import type { MockedFunction } from 'vitest';
import * as authContext from '@/contexts/auth';
import type { AuthContextType } from '@/contexts/auth/types';
import { User } from '@supabase/supabase-js';

// Mock the auth context
vi.mock('@/contexts/auth', () => ({
  useAuth: vi.fn()
}));

// Mock the feature API module - Create properly typed mocks
vi.mock('@/lib/features/api', () => ({
  checkFeatureAccess: vi.fn().mockResolvedValue(false),
  trackFeatureEvent: vi.fn(),
}));

// Get typed references to the mocked functions
const mockCheckFeatureAccess = featureApi.checkFeatureAccess as MockedFunction<typeof featureApi.checkFeatureAccess>;
const mockTrackFeatureEvent = featureApi.trackFeatureEvent as MockedFunction<typeof featureApi.trackFeatureEvent>;
const mockUseAuth = authContext.useAuth as MockedFunction<typeof authContext.useAuth>;

// Helper function to create a complete mock auth context
const createMockAuthContext = (userType: 'individual' | 'admin'): AuthContextType => {
  const userId = userType === 'admin' ? 'admin-user' : 'test-user';
  const email = userType === 'admin' ? 'admin@example.com' : 'test@example.com';
  
  const user = {
    id: userId,
    user_metadata: { user_type: userType },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    email,
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: '',
    factors: null
  } as User;
  
  return {
    user,
    session: null,
    isLoading: false,
    isEmailVerified: true,
    authStable: true,
    authError: null,
    signIn: vi.fn().mockResolvedValue({ error: null, data: {} }),
    signUp: vi.fn().mockResolvedValue({ error: null, data: {} }),
    signOut: vi.fn().mockResolvedValue(undefined),
    refreshSession: vi.fn().mockResolvedValue({ isEmailVerified: true }),
    recoverAuthState: vi.fn().mockResolvedValue(true)
  };
};

describe('useFeatureAccess', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset useAuth to default mock implementation (individual user)
    mockUseAuth.mockImplementation(() => createMockAuthContext('individual'));
  });

  it('should provide feature access functions', () => {
    const { result } = renderHook(() => useFeatureAccess());
    
    expect(result.current.hasAccess).toBeInstanceOf(Function);
    expect(result.current.checkAccess).toBeInstanceOf(Function);
    expect(result.current.trackFeatureUsage).toBeInstanceOf(Function);
  });

  it('should grant access to features for admins', () => {
    // Instead of re-mocking the module, temporarily change the implementation
    mockUseAuth.mockImplementationOnce(() => createMockAuthContext('admin'));
    
    const { result } = renderHook(() => useFeatureAccess());
    
    const hasAccess = result.current.hasAccess(FEATURES.ADVANCED_ANALYTICS);
    expect(hasAccess).toBe(true);
  });

  it('should check access for non-admin users', async () => {
    mockCheckFeatureAccess.mockResolvedValue(true);
    
    const { result } = renderHook(() => useFeatureAccess());
    
    let accessResult: boolean | undefined;
    
    await act(async () => {
      accessResult = await result.current.checkAccess(FEATURES.BULK_MESSAGING);
    });
    
    expect(accessResult).toBe(true);
    expect(mockCheckFeatureAccess).toHaveBeenCalledWith(FEATURES.BULK_MESSAGING);
  });

  it('should track feature usage', () => {
    const { result } = renderHook(() => useFeatureAccess());
    
    act(() => {
      // Call with only two arguments to match the implementation
      result.current.trackFeatureUsage(FEATURES.SOCIAL_SHARING, 'click');
    });
    
    // Expect only two arguments in the call
    expect(mockTrackFeatureEvent).toHaveBeenCalledWith(
      FEATURES.SOCIAL_SHARING,
      'click'
    );
  });

  it('should use default feature status when access is not checked yet', () => {
    const { result } = renderHook(() => useFeatureAccess());
    
    // Social sharing is enabled by default in the registry
    const hasSocialAccess = result.current.hasAccess(FEATURES.SOCIAL_SHARING);
    expect(hasSocialAccess).toBe(true);
    
    // Advanced analytics is disabled by default in the registry
    const hasAnalyticsAccess = result.current.hasAccess(FEATURES.ADVANCED_ANALYTICS);
    expect(hasAnalyticsAccess).toBe(false);
  });
});
