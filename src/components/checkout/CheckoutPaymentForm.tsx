
import React from 'react';
import { Input } from '@/components/ui/input';

const CheckoutPaymentForm: React.FC = () => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Payment Details</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="card-number">
          Card Number
        </label>
        <Input id="card-number" placeholder="1234 5678 9012 3456" required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium" htmlFor="expiry">
            Expiry Date
          </label>
          <Input id="expiry" placeholder="MM/YY" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="cvc">
            CVC
          </label>
          <Input id="cvc" placeholder="123" required />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentForm;
