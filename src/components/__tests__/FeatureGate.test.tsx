import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FeatureGate, useFeatureToggle } from '@/components/FeatureGate';
import { FEATURES } from '@/lib/features/registry';
import { screen, renderHook } from '@/test/testing-library-extensions';

// Mock the features context
vi.mock('@/contexts/FeatureContext', () => ({
  useFeatures: vi.fn(() => ({
    hasAccess: vi.fn((featureId) => featureId === FEATURES.SOCIAL_SHARING),
    trackFeatureUsage: vi.fn()
  }))
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('FeatureGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user has access to the feature', () => {
    render(
      <FeatureGate feature={FEATURES.SOCIAL_SHARING}>
        <div data-testid="protected-content">Protected Content</div>
      </FeatureGate>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders fallback when user does not have access', () => {
    render(
      <FeatureGate 
        feature={FEATURES.ADVANCED_ANALYTICS}
        fallback={<div data-testid="fallback-content">Fallback Content</div>}
      >
        <div>Protected Content</div>
      </FeatureGate>
    );

    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
    expect(screen.getByText('Fallback Content')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders upgrade prompt when no fallback provided and user lacks access', () => {
    render(
      <FeatureGate feature={FEATURES.ADVANCED_ANALYTICS}>
        <div>Protected Content</div>
      </FeatureGate>
    );

    expect(screen.getByText(/This feature requires a subscription upgrade/i)).toBeInTheDocument();
    expect(screen.getByText('View Pricing')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders nothing when showUpgradePrompt is false and no fallback', () => {
    render(
      <FeatureGate 
        feature={FEATURES.ADVANCED_ANALYTICS}
        showUpgradePrompt={false}
      >
        <div>Protected Content</div>
      </FeatureGate>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByText(/This feature requires a subscription upgrade/i)).not.toBeInTheDocument();
    expect(screen.queryByText('View Pricing')).not.toBeInTheDocument();
  });
});

describe('useFeatureToggle', () => {
  it('conditionally executes callbacks based on feature access', () => {
    const { result } = renderHook(() => useFeatureToggle(FEATURES.SOCIAL_SHARING));
    
    const callbackMock = vi.fn();
    const fallbackMock = vi.fn();
    
    // User has access to SOCIAL_SHARING according to our mock
    result.current.whenEnabled(callbackMock, fallbackMock);
    
    expect(callbackMock).toHaveBeenCalled();
    expect(fallbackMock).not.toHaveBeenCalled();
  });

  it('executes fallback when user lacks feature access', () => {
    const { result } = renderHook(() => useFeatureToggle(FEATURES.ADVANCED_ANALYTICS));
    
    const callbackMock = vi.fn();
    const fallbackMock = vi.fn();
    
    // User does not have access to ADVANCED_ANALYTICS according to our mock
    result.current.whenEnabled(callbackMock, fallbackMock);
    
    expect(callbackMock).not.toHaveBeenCalled();
    expect(fallbackMock).toHaveBeenCalled();
  });
});
