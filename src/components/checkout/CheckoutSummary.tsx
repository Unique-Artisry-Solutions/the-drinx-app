
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { DiscountSavingsIndicator } from './DiscountSavingsIndicator';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface AppliedDiscount {
  code: string;
  amount: number;
  discountType: 'percentage' | 'fixed' | 'free_item';
  value: number;
}

export interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: AppliedDiscount | null;
  total: number;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  subtotal,
  discount,
  total
}) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <CardTitle className="text-lg mb-4">Order Summary</CardTitle>
        
        <div className="space-y-4">
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="flex-1">
                  {item.name} {item.quantity > 1 && <span className="text-muted-foreground">x{item.quantity}</span>}
                </span>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-2">
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            {discount && (
              <div className="flex justify-between text-green-600 mb-1">
                <span>Discount ({discount.code})</span>
                <span>-{formatCurrency(discount.amount)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-medium text-lg mt-2 border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          
          {discount && (
            <DiscountSavingsIndicator
              subtotal={subtotal}
              discount={discount.amount}
              discountCode={discount.code}
              discountType={discount.discountType}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
