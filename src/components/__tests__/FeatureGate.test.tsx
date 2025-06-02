
import { render, screen } from '@testing-library/react';
import FeatureGate from '../FeatureGate';

// Mock the contexts and hooks
jest.mock('@/contexts/FeatureContext', () => ({
  useFeatures: () => ({
    features: { testFeature: true },
    isLoading: false
  })
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('FeatureGate', () => {
  it('renders children when feature is enabled', () => {
    render(
      <FeatureGate featureKey="testFeature">
        <div>Test Content</div>
      </FeatureGate>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
