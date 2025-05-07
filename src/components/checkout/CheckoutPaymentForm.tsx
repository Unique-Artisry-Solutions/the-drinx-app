
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';

interface CheckoutPaymentFormProps {
  onPaymentMethodChange: (paymentMethod: any) => void;
  error?: string;
}

const CheckoutPaymentForm: React.FC<CheckoutPaymentFormProps> = ({ 
  onPaymentMethodChange,
  error 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | undefined>();
  const [isCardComplete, setIsCardComplete] = useState(false);
  
  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  const handleCardChange = async (event: any) => {
    setIsCardComplete(event.complete);
    setCardError(event.error ? event.error.message : undefined);
    
    if (event.complete && stripe && elements) {
      try {
        const cardElement = elements.getElement(CardElement);
        if (cardElement) {
          const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
          });
          
          if (result.error) {
            setCardError(result.error.message);
          } else if (result.paymentMethod) {
            onPaymentMethodChange(result.paymentMethod);
          }
        }
      } catch (err) {
        console.error("Error creating payment method:", err);
        setCardError('An unexpected error occurred while processing your payment method.');
      }
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Payment Details</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-element">Card Details</Label>
          <div className="p-3 border rounded-md bg-white">
            <CardElement 
              id="card-element" 
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
        </div>
        
        {(cardError || error) && (
          <FormMessage>{cardError || error}</FormMessage>
        )}
        
        <div className="text-sm text-gray-500">
          <p>Your card information is processed securely by Stripe.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentForm;
