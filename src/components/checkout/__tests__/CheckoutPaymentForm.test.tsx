import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CheckoutPaymentForm from '../CheckoutPaymentForm';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

// Mock Stripe hooks
vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: vi.fn(),
  useElements: vi.fn(),
  CardElement: vi.fn(() => <div data-testid="card-element">Mock Card Element</div>),
}));

// Mock StripeContext
vi.mock('@/contexts/StripeContext', () => ({
  useStripe: vi.fn(() => ({
    enableStripe: vi.fn(),
    isStripeLoading: false,
  })),
}));

const mockStripe = {
  createPaymentMethod: vi.fn(),
};

const mockElements = {
  getElement: vi.fn(),
};

describe('CheckoutPaymentForm', () => {
  const mockOnPaymentMethodChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useStripe as any).mockReturnValue(mockStripe);
    (useElements as any).mockReturnValue(mockElements);
  });

  it('renders payment form correctly', () => {
    const { container } = render(
      <CheckoutPaymentForm onPaymentMethodChange={mockOnPaymentMethodChange} />
    );
    
    expect(container.textContent).toContain('Payment Details');
    expect(container.textContent).toContain('Card Details');
    expect(container.textContent).toContain('Your card information is processed securely by Stripe.');
  });

  it('displays error message when provided', () => {
    const { container } = render(
      <CheckoutPaymentForm 
        onPaymentMethodChange={mockOnPaymentMethodChange} 
        error="Payment failed" 
      />
    );
    
    expect(container.textContent).toContain('Payment failed');
  });

  it('shows loading state when Stripe is loading', () => {
    // Mock loading state
    vi.mocked(vi.mocked(require('@/contexts/StripeContext')).useStripe).mockReturnValue({
      enableStripe: vi.fn(),
      isStripeLoading: true,
    });

    const { container } = render(
      <CheckoutPaymentForm onPaymentMethodChange={mockOnPaymentMethodChange} />
    );
    
    expect(container.textContent).toContain('Loading payment processor...');
  });
});