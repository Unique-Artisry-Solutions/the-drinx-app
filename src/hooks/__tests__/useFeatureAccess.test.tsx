
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { checkFeatureAccess, trackFeatureEvent } from '@/lib/features/api';
import { FEATURES } from '@/lib/features/registry';

// Mock the dependencies
vi.mock('@/contexts/auth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user', user_metadata: { user_type: 'individual' } }
  }))
}));

vi.mock('@/lib/features/api', () => ({
  checkFeatureAccess: vi.fn(),
  trackFeatureEvent: vi.fn()
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

  it('should grant access to features for admins', () => {
    vi.mock('@/contexts/auth', () => ({
      useAuth: vi.fn(() => ({
        user: { id: 'admin-user', user_metadata: { user_type: 'admin' } }
      }))
    }), { virtual: true });
    
    const { result } = renderHook(() => useFeatureAccess());
    
    const hasAccess = result.current.hasAccess(FEATURES.ADVANCED_ANALYTICS);
    expect(hasAccess).toBe(true);
  });

  it('should check access for non-admin users', async () => {
    vi.mocked(checkFeatureAccess).mockResolvedValue(true);
    
    const { result } = renderHook(() => useFeatureAccess());
    
    let accessResult: boolean | undefined;
    
    await act(async () => {
      accessResult = await result.current.checkAccess(FEATURES.BULK_MESSAGING);
    });
    
    expect(accessResult).toBe(true);
    expect(checkFeatureAccess).toHaveBeenCalledWith(FEATURES.BULK_MESSAGING);
  });

  it('should track feature usage', () => {
    const { result } = renderHook(() => useFeatureAccess());
    
    act(() => {
      result.current.trackFeatureUsage(FEATURES.SOCIAL_SHARING, 'click', { element: 'share-button' });
    });
    
    expect(trackFeatureEvent).toHaveBeenCalledWith(
      FEATURES.SOCIAL_SHARING,
      'click',
      { element: 'share-button' }
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
