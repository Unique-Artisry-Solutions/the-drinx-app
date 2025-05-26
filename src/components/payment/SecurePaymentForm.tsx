
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurePaymentFormProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (paymentMethod: any) => void;
  onPaymentError: (error: string) => void;
  isProcessing?: boolean;
}

const SecurePaymentForm: React.FC<SecurePaymentFormProps> = ({
  amount,
  currency = 'USD',
  onPaymentSuccess,
  onPaymentError,
  isProcessing = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  });
  
  const [cardError, setCardError] = useState<string>('');
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        iconColor: '#666EE8',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  const handleCardChange = (event: any) => {
    setIsCardComplete(event.complete);
    setCardError(event.error ? event.error.message : '');
  };

  const validateForm = () => {
    if (!billingDetails.name.trim()) {
      setCardError('Cardholder name is required');
      return false;
    }
    if (!billingDetails.email.trim() || !billingDetails.email.includes('@')) {
      setCardError('Valid email is required');
      return false;
    }
    if (!isCardComplete) {
      setCardError('Please complete your card information');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || isSubmitting || isProcessing) return;
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setCardError('');

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (error) {
        setCardError(error.message || 'Payment method creation failed');
        onPaymentError(error.message || 'Payment method creation failed');
      } else {
        onPaymentSuccess(paymentMethod);
        toast({
          title: "Payment method created",
          description: "Your payment information has been securely processed.",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setCardError(errorMessage);
      onPaymentError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setBillingDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Billing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Cardholder Name *</Label>
              <Input
                id="name"
                type="text"
                value={billingDetails.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={billingDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <Label htmlFor="address">Billing Address</Label>
            <Input
              id="address"
              type="text"
              value={billingDetails.address.line1}
              onChange={(e) => handleInputChange('address.line1', e.target.value)}
              placeholder="123 Main Street"
              className="mb-2"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Input
                type="text"
                value={billingDetails.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                placeholder="City"
              />
              <Input
                type="text"
                value={billingDetails.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                placeholder="State"
              />
              <Input
                type="text"
                value={billingDetails.address.postal_code}
                onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
                placeholder="ZIP"
              />
            </div>
          </div>

          {/* Card Information */}
          <div>
            <Label htmlFor="card-element" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card Information *
            </Label>
            <div className="mt-2 p-3 border rounded-md bg-white">
              <CardElement
                id="card-element"
                options={cardElementOptions}
                onChange={handleCardChange}
              />
            </div>
          </div>

          {/* Error Display */}
          {cardError && (
            <Alert variant="destructive">
              <AlertDescription>{cardError}</AlertDescription>
            </Alert>
          )}

          {/* Security Notice */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <p>Your payment information is encrypted and processed securely by Stripe. We never store your card details.</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || !isCardComplete || isSubmitting || isProcessing}
          >
            {isSubmitting || isProcessing ? (
              'Processing...'
            ) : (
              `Pay ${currency} $${amount.toFixed(2)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SecurePaymentForm;
