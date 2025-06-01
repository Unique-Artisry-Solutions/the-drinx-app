
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FeatureGate from '../FeatureGate';

// Mock the auth context
const mockAuthContext = {
  user: null,
  isLoading: false,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signUp: () => Promise.resolve()
};

// Mock the feature tier hook
const mockFeatureTierHook = {
  hasFeatureAccess: () => true,
  userTier: 'free' as const
};

jest.mock('@/contexts/auth', () => ({
  useAuth: () => mockAuthContext
}));

jest.mock('@/hooks/useFeatureTier', () => ({
  useFeatureTier: () => mockFeatureTierHook
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() })
}));

describe('FeatureGate', () => {
  it('renders children when user has access', () => {
    const { getByText } = render(
      <FeatureGate feature="test-feature" requiredTier="free">
        <div>Test Content</div>
      </FeatureGate>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('renders upgrade prompt when user lacks access', () => {
    // Override the hook to return false for access
    jest.spyOn(require('@/hooks/useFeatureTier'), 'useFeatureTier').mockReturnValue({
      hasFeatureAccess: () => false,
      userTier: 'free'
    });

    const { getByText } = render(
      <FeatureGate feature="premium-feature" requiredTier="premium">
        <div>Premium Content</div>
      </FeatureGate>
    );
    
    expect(getByText('Premium Feature Required')).toBeInTheDocument();
  });
});
