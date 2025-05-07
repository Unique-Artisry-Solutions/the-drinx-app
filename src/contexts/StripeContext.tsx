
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLazyInitialization } from '@/utils/lazyProviderInitialization';

// Use the publishable key (this should be your test key during development)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Oy5r1Dcc0BrG91w9JDzn7MIS4hpUqWYlhI4CjWVK1VJZx3Jmor21GRONDBnhPptv6eGKZyb2w4P30gTW4491zbh00vN4VQEIU';

// Context to track Stripe loading state
interface StripeContextType {
  stripePromise: Promise<Stripe | null> | null;
  isStripeLoading: boolean;
  isStripeEnabled: boolean;
  enableStripe: () => void;
}

const defaultContextValue: StripeContextType = {
  stripePromise: null,
  isStripeLoading: false,
  isStripeEnabled: false,
  enableStripe: () => {},
};

const StripeContext = createContext<StripeContextType>(defaultContextValue);

export const useStripe = () => useContext(StripeContext);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to track whether Stripe should be initialized
  const [isStripeEnabled, setIsStripeEnabled] = useState(false);
  
  // Lazy initialization of Stripe
  const [stripePromise, isStripeLoading] = useLazyInitialization<Promise<Stripe | null>>(
    () => {
      console.log('🔄 Initializing Stripe...');
      return loadStripe(STRIPE_PUBLISHABLE_KEY);
    }, 
    [isStripeEnabled]
  );
  
  // Function to enable Stripe when needed
  const enableStripe = () => {
    if (!isStripeEnabled) {
      console.log('🔄 Enabling Stripe');
      setIsStripeEnabled(true);
    }
  };
  
  // Auto-enable Stripe on pages that likely need it
  useEffect(() => {
    const currentPath = window.location.pathname;
    // Only initialize Stripe on paths that need it
    if (
      currentPath.includes('/checkout') || 
      currentPath.includes('/payment') ||
      currentPath.includes('/purchase')
    ) {
      enableStripe();
    }
  }, []);
  
  // Value to provide to consumers
  const contextValue: StripeContextType = {
    stripePromise,
    isStripeLoading: isStripeLoading || (isStripeEnabled && !stripePromise),
    isStripeEnabled,
    enableStripe,
  };
  
  // Only render Elements when Stripe is enabled and loaded
  return (
    <StripeContext.Provider value={contextValue}>
      {isStripeEnabled && stripePromise ? (
        <Elements stripe={stripePromise}>
          {children}
        </Elements>
      ) : (
        // When Stripe is not enabled, just render children without Elements
        children
      )}
    </StripeContext.Provider>
  );
};
