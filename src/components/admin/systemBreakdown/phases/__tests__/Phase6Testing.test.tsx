
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Phase6Testing from '../Phase6Testing';

describe('Phase6Testing', () => {
  it('renders the component title', () => {
    render(<Phase6Testing />);
    expect(screen.getByText(/Phase 6: Testing and Rollout/)).toBeInTheDocument();
  });

  it('displays all test categories', () => {
    render(<Phase6Testing />);
    expect(screen.getByText('Unit Tests')).toBeInTheDocument();
    expect(screen.getByText('Integration Tests')).toBeInTheDocument();
    expect(screen.getByText('E2E Tests')).toBeInTheDocument();
    expect(screen.getByText('Performance Tests')).toBeInTheDocument();
    expect(screen.getByText('Security Tests')).toBeInTheDocument();
  });

  it('shows the overall testing progress', () => {
    render(<Phase6Testing />);
    expect(screen.getByText('Overall Testing Progress')).toBeInTheDocument();
  });

  it('displays the rollout status section', () => {
    render(<Phase6Testing />);
    expect(screen.getByText('Rollout Status')).toBeInTheDocument();
    expect(screen.getByText('Pre-release Testing')).toBeInTheDocument();
  });
});
