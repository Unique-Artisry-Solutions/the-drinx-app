
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeatureGate from '../FeatureGate';

describe('FeatureGate', () => {
  it('renders locked feature gate', () => {
    render(
      <FeatureGate feature="Premium Analytics" requiredPlan="Pro" isLocked={true} />
    );
    
    expect(screen.getByText('Premium Analytics Feature')).toBeInTheDocument();
    expect(screen.getByText('Requires Pro')).toBeInTheDocument();
  });

  it('renders children when not locked', () => {
    render(
      <FeatureGate feature="Premium Analytics" isLocked={false}>
        <div>Feature Content</div>
      </FeatureGate>
    );
    
    expect(screen.getByText('Feature Content')).toBeInTheDocument();
    expect(screen.queryByText('Premium Analytics Feature')).not.toBeInTheDocument();
  });
});
