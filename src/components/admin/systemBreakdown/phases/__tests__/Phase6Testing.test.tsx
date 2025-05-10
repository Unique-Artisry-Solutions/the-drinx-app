
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { screen } from '@/test/testing-library-extensions';
import Phase6Testing from '../Phase6Testing';

describe('Phase6Testing', () => {
  it('renders the phase title correctly', () => {
    render(<Phase6Testing />);
    
    // Using string instead of RegExp for screen.getByText
    expect(screen.getByText('Phase 6: Testing and Rollout')).toBeInTheDocument();
  });
  
  it('displays the correct status badge', () => {
    render(<Phase6Testing />);
    
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });
  
  it('renders test categories', () => {
    render(<Phase6Testing />);
    
    expect(screen.getByText('Promoter Authentication')).toBeInTheDocument();
    expect(screen.getByText('Communication System')).toBeInTheDocument();
    expect(screen.getByText('Event Management')).toBeInTheDocument();
    expect(screen.getByText('Analytics Reporting')).toBeInTheDocument();
    expect(screen.getByText('Brand Partnerships')).toBeInTheDocument();
  });
});
