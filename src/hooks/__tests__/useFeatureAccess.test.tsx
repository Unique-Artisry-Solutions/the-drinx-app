
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { FEATURES } from '@/lib/features/registry';
import { MockedFunction } from 'vitest';

// Mock the auth context
vi.mock('@/contexts/auth', () => ({
  useAuth: vi.fn(() => ({
    user: {
      id: 'user-id',
      user_metadata: { user_type: 'individual' }
    },
    session: null,
    isLoading: false,
    isEmailVerified: true,
    authStable: true,
    authError: null,
    // Add missing methods to match AuthContextType
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn(),
    refreshSession: vi.fn(),
    resetPassword: vi.fn(),
    recoverAuthState: vi.fn()
  }))
}));

// Mock the feature API module
vi.mock('@/lib/features/api', () => ({
  checkFeatureAccess: vi.fn().mockResolvedValue(false),
  trackFeatureEvent: vi.fn(),
}));

describe('useFeatureAccess', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should provide feature access functions', () => {
    const { result } = renderHook(() => useFeatureAccess());
    
    expect(result.current.hasAccess).toBeInstanceOf(Function);
    expect(result.current.checkAccess).toBeInstanceOf(Function);
    expect(result.current.trackFeatureUsage).toBeInstanceOf(Function);
  });
});
