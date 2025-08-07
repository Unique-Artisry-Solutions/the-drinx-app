
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { useStripe as useStripeContext } from '@/contexts/StripeContext';
import { Skeleton } from '@/components/ui/skeleton';
import PaymentErrorDisplay from '@/components/common/PaymentErrorDisplay';
import { categorizeError } from '@/utils/paymentValidation';
import { PaymentError } from '@/types/PaymentErrors';

interface CheckoutPaymentFormProps {
  onPaymentMethodChange: (paymentMethod: any) => void;
  error?: string;
  onRetry?: () => void;
  isProcessing?: boolean;
}

const CheckoutPaymentForm: React.FC<CheckoutPaymentFormProps> = ({ 
  onPaymentMethodChange,
  error,
  onRetry,
  isProcessing = false
}) => {
  // Ensure Stripe is enabled
  const { enableStripe, isStripeLoading } = useStripeContext();
  
  // Make sure Stripe is enabled on component mount
  useEffect(() => {
    enableStripe();
  }, [enableStripe]);
  
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<PaymentError | undefined>();
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isCreatingPaymentMethod, setIsCreatingPaymentMethod] = useState(false);
  
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
    
    // Handle Stripe card validation errors
    if (event.error) {
      const stripeError = categorizeError(event.error);
      setCardError(stripeError);
    } else {
      setCardError(undefined);
    }
    
    if (event.complete && stripe && elements && !isCreatingPaymentMethod) {
      try {
        setIsCreatingPaymentMethod(true);
        const cardElement = elements.getElement(CardElement);
        if (cardElement) {
          const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
          });
          
          if (result.error) {
            const paymentMethodError = categorizeError(result.error);
            setCardError(paymentMethodError);
          } else if (result.paymentMethod) {
            setCardError(undefined);
            onPaymentMethodChange(result.paymentMethod);
          }
        }
      } catch (err) {
        console.error("Error creating payment method:", err);
        const categorizedError = categorizeError(err);
        setCardError(categorizedError);
      } finally {
        setIsCreatingPaymentMethod(false);
      }
    }
  };

  // Show loading state when Stripe is loading
  if (isStripeLoading) {
    return (
      <div className="space-y-2">
        <h3 className="font-medium">Payment Details</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Card Details</Label>
            <Skeleton className="h-[42px] w-full" />
          </div>
          <div className="text-sm text-gray-500">
            <p>Loading payment processor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Payment Details</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-element">Card Details</Label>
          <div className={`p-3 border rounded-md bg-white ${
            isProcessing || isCreatingPaymentMethod ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <CardElement 
              id="card-element" 
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
          {isCreatingPaymentMethod && (
            <div className="text-sm text-muted-foreground">
              Creating payment method...
            </div>
          )}
        </div>
        
        {/* Enhanced error display */}
        {cardError && (
          <PaymentErrorDisplay 
            error={cardError}
            onRetry={onRetry}
            onUpdateCard={() => {
              setCardError(undefined);
              // Clear the card element to allow re-entry
              const cardElement = elements?.getElement(CardElement);
              if (cardElement) {
                cardElement.clear();
              }
            }}
            className="mt-4"
          />
        )}
        
        {/* Legacy error support */}
        {error && !cardError && (
          <FormMessage>{error}</FormMessage>
        )}
        
        <div className="text-sm text-gray-500">
          <p>Your card information is processed securely by Stripe.</p>
          {isProcessing && (
            <p className="mt-1 text-blue-600">Processing payment...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentForm;
