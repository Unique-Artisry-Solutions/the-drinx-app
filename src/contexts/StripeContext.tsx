
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Use the publishable key (this should be your test key during development)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Oy5r1Dcc0BrG91w9JDzn7MIS4hpUqWYlhI4CjWVK1VJZx3Jmor21GRONDBnhPptv6eGKZyb2w4P30gTW4491zbh00vN4VQEIU';

// Context to track Stripe loading state
interface StripeContextType {
  stripePromise: Promise<Stripe | null>;
  isStripeLoading: boolean;
}

const StripeContext = createContext<StripeContextType>({
  stripePromise: loadStripe(STRIPE_PUBLISHABLE_KEY),
  isStripeLoading: true,
});

export const useStripe = () => useContext(StripeContext);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStripeLoading, setIsStripeLoading] = useState(true);
  const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  
  useEffect(() => {
    // Check if Stripe has been loaded
    stripePromise.then(() => {
      setIsStripeLoading(false);
    }).catch(error => {
      console.error('Failed to load Stripe:', error);
      setIsStripeLoading(false);
    });
  }, []);
  
  return (
    <StripeContext.Provider value={{ stripePromise, isStripeLoading }}>
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
};
