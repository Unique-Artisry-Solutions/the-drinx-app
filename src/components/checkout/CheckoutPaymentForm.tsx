
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';

interface CheckoutPaymentFormProps {
  onPaymentMethodChange: (paymentMethod: any) => void;
  error?: string;
}

// Simplified payment form that doesn't use Stripe Elements yet
const CheckoutPaymentFormContent: React.FC<CheckoutPaymentFormProps> = ({ 
  onPaymentMethodChange,
  error 
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardError, setCardError] = useState<string | undefined>();
  
  const handleFormChange = () => {
    // Simple validation
    if (cardNumber && expiry && cvc) {
      // Create a mock payment method object for now
      // This will be replaced with actual Stripe functionality once dependencies are installed
      const mockPaymentMethod = {
        id: 'mock_payment_method_id',
        type: 'card',
        card: {
          brand: 'visa',
          last4: cardNumber.slice(-4),
          exp_month: parseInt(expiry.split('/')[0]),
          exp_year: parseInt(expiry.split('/')[1]),
        }
      };
      
      onPaymentMethodChange(mockPaymentMethod);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Payment Details</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-number">Card Number</Label>
          <Input
            id="card-number"
            placeholder="1234 1234 1234 1234"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(e.target.value);
              handleFormChange();
            }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiration (MM/YY)</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => {
                setExpiry(e.target.value);
                handleFormChange();
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="123"
              value={cvc}
              onChange={(e) => {
                setCvc(e.target.value);
                handleFormChange();
              }}
            />
          </div>
        </div>
        
        {(cardError || error) && (
          <FormMessage>{cardError || error}</FormMessage>
        )}
      </div>
    </div>
  );
};

// Temporary implementation without Stripe wrapper
export default function CheckoutPaymentForm(props: CheckoutPaymentFormProps) {
  return <CheckoutPaymentFormContent {...props} />;
}
