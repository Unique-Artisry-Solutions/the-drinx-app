
import React, { useState, useEffect } from 'react';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DigitalWalletPaymentProps {
  amount: number;
  currency?: string;
  label: string;
  onPaymentSuccess: (paymentMethod: any) => void;
  onPaymentError: (error: string) => void;
}

const DigitalWalletPayment: React.FC<DigitalWalletPaymentProps> = ({
  amount,
  currency = 'usd',
  label,
  onPaymentSuccess,
  onPaymentError
}) => {
  const stripe = useStripe();
  const { toast } = useToast();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: currency.toLowerCase(),
      total: {
        label: label,
        amount: Math.round(amount * 100), // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    // Check if payment request is available
    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanMakePayment(true);
      }
    });

    pr.on('paymentmethod', async (event) => {
      try {
        onPaymentSuccess(event.paymentMethod);
        
        // Confirm the payment was processed successfully
        event.complete('success');
        
        toast({
          title: "Payment successful",
          description: "Your payment has been processed using your digital wallet.",
        });
      } catch (error) {
        event.complete('fail');
        const errorMessage = error instanceof Error ? error.message : 'Payment failed';
        onPaymentError(errorMessage);
      }
    });
  }, [stripe, amount, currency, label, onPaymentSuccess, onPaymentError, toast]);

  if (!canMakePayment) {
    return (
      <Card className="opacity-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Wallet className="h-5 w-5" />
            <span>Digital wallets not available</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-center justify-center">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Pay with Digital Wallet</span>
          </div>
          
          <div className="flex justify-center">
            {paymentRequest && (
              <PaymentRequestButtonElement
                options={{
                  paymentRequest,
                  style: {
                    paymentRequestButton: {
                      type: 'default',
                      theme: 'dark',
                      height: '44px',
                    },
                  },
                }}
              />
            )}
          </div>
          
          <div className="text-xs text-gray-600 text-center">
            Supports Apple Pay, Google Pay, and other digital wallets
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalWalletPayment;
