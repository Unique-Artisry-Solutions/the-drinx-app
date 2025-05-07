
import { useEffect } from 'react';
import { useStripe as useStripeLib } from '@stripe/react-stripe-js';
import { useStripe as useStripeContext } from '@/contexts/StripeContext';

/**
 * Hook for working with the payment provider (Stripe)
 * Handles initialization and provides status
 */
export function usePaymentProvider() {
  const { 
    enableStripe, 
    isStripeLoading, 
    isStripeEnabled 
  } = useStripeContext();
  const stripe = useStripeLib();
  
  // Enable Stripe when this hook is used
  useEffect(() => {
    enableStripe();
  }, [enableStripe]);
  
  return {
    stripe,
    isLoading: isStripeLoading,
    isEnabled: isStripeEnabled,
    isReady: isStripeEnabled && stripe !== null && !isStripeLoading
  };
}
