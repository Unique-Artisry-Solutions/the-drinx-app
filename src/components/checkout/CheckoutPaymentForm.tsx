
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CheckoutPaymentFormProps {
  onNext: () => void;
  onBack: () => void;
}

const CheckoutPaymentForm = ({ onNext, onBack }: CheckoutPaymentFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" placeholder="MM/YY" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" placeholder="123" type="password" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nameOnCard">Name on Card</Label>
        <Input id="nameOnCard" placeholder="Full name as shown on card" />
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};

export default CheckoutPaymentForm;
