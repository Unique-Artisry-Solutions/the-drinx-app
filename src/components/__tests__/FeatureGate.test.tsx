
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureGate from '../FeatureGate';
import { FeatureProvider } from '@/contexts/FeatureContext';
import { FEATURES } from '@/lib/features/registry';

// Mock the feature context
vi.mock('@/contexts/FeatureContext', async () => {
  const actual = await vi.importActual('@/contexts/FeatureContext');
  return {
    ...actual,
    useFeatures: () => ({
      hasAccess: (featureId: string) => featureId !== FEATURES.PRIORITY_REGISTRATION,
      trackFeatureUsage: vi.fn(),
      loading: {},
      featureAccess: {},
      checkAccess: vi.fn()
    }),
  };
});

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
      <FeatureProvider>
        <FeatureGate feature={FEATURES.VENUE_DISCOVERY}>
          <div data-testid="protected-content">Protected Content</div>
        </FeatureGate>
      </FeatureProvider>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('renders fallback when user does not have access to the feature', () => {
    render(
      <FeatureProvider>
        <FeatureGate 
          feature={FEATURES.PRIORITY_REGISTRATION}
          fallback={<div data-testid="fallback-content">Fallback Content</div>}
        >
          <div data-testid="protected-content">Protected Content</div>
        </FeatureGate>
      </FeatureProvider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
  });

  it('renders upgrade prompt when user does not have access and no fallback provided', () => {
    render(
      <FeatureProvider>
        <FeatureGate feature={FEATURES.PRIORITY_REGISTRATION}>
          <div data-testid="protected-content">Protected Content</div>
        </FeatureGate>
      </FeatureProvider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText(/subscription upgrade/i)).toBeInTheDocument();
    expect(screen.getByText(/view pricing/i)).toBeInTheDocument();
  });

  it('renders nothing when user does not have access, no fallback, and upgrade prompt disabled', () => {
    render(
      <FeatureProvider>
        <FeatureGate 
          feature={FEATURES.PRIORITY_REGISTRATION}
          showUpgradePrompt={false}
        >
          <div data-testid="protected-content">Protected Content</div>
        </FeatureGate>
      </FeatureProvider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByText(/subscription upgrade/i)).not.toBeInTheDocument();
  });
});
