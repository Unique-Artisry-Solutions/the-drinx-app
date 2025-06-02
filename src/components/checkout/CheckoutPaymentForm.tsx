
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface CheckoutPaymentFormProps {
  onPaymentSubmit: (paymentData: PaymentFormData) => void;
  isLoading?: boolean;
}

const CheckoutPaymentForm: React.FC<CheckoutPaymentFormProps> = ({
  onPaymentSubmit,
  isLoading = false
}) => {
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const handleInputChange = (field: keyof PaymentFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentSubmit(paymentData);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Enter your payment details to complete your purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              value={paymentData.cardholderName}
              onChange={handleInputChange('cardholderName')}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleInputChange('cardNumber')}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                value={paymentData.expiryDate}
                onChange={handleInputChange('expiryDate')}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={paymentData.cvv}
                onChange={handleInputChange('cvv')}
                placeholder="123"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Complete Payment'}
          </Button>
        </form>
      </CardContent>
    </>
  );
};

export default CheckoutPaymentForm;
