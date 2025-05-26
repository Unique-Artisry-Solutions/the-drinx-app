
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus } from 'lucide-react';

interface TicketQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  minQuantity?: number;
  price: number;
  disabled?: boolean;
}

const TicketQuantitySelector: React.FC<TicketQuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  maxQuantity = 10,
  minQuantity = 1,
  price,
  disabled = false
}) => {
  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || minQuantity;
    const clampedValue = Math.min(Math.max(value, minQuantity), maxQuantity);
    onQuantityChange(clampedValue);
  };

  const totalPrice = price * quantity;

  return (
    <div className="space-y-3">
      <Label htmlFor="quantity">Quantity</Label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDecrement}
          disabled={disabled || quantity <= minQuantity}
          className="h-8 w-8 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={minQuantity}
          max={maxQuantity}
          disabled={disabled}
          className="w-20 text-center"
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleIncrement}
          disabled={disabled || quantity >= maxQuantity}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>${price.toFixed(2)} × {quantity} = <span className="font-medium">${totalPrice.toFixed(2)}</span></p>
        {maxQuantity > 1 && (
          <p className="text-xs">Maximum {maxQuantity} tickets per order</p>
        )}
      </div>
    </div>
  );
};

export default TicketQuantitySelector;
