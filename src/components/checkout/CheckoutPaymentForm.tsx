
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card } from '@/components/ui/card';

interface CheckoutPaymentFormProps {
  onPaymentMethodChange: (paymentMethod: any) => void;
  error?: string;
}

// Load Stripe outside of the component to avoid recreating the Stripe object
// Replace with your own publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key');

// Wrapper component for the Stripe Elements context
export const StripePaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

const CheckoutPaymentFormContent: React.FC<CheckoutPaymentFormProps> = ({ 
  onPaymentMethodChange,
  error 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | undefined>();
  
  const handleCardChange = async (event: any) => {
    setCardError(event.error?.message);
    
    if (event.complete) {
      try {
        if (!stripe || !elements) {
          return;
        }
        
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          return;
        }
        
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });
        
        if (error) {
          setCardError(error.message);
        } else if (paymentMethod) {
          onPaymentMethodChange(paymentMethod);
        }
      } catch (err: any) {
        setCardError(err.message);
      }
    }
  };
  
  const cardElementStyle = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Payment Details</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-element">Card Information</Label>
          <Card className="p-3">
            <CardElement
              id="card-element"
              options={{
                style: cardElementStyle,
                hidePostalCode: true,
              }}
              onChange={handleCardChange}
            />
          </Card>
          {(cardError || error) && (
            <FormMessage>{cardError || error}</FormMessage>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPaymentForm(props: CheckoutPaymentFormProps) {
  return (
    <StripePaymentProvider>
      <CheckoutPaymentFormContent {...props} />
    </StripePaymentProvider>
  );
}
