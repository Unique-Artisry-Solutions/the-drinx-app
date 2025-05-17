
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';

export interface DiscountSavingsIndicatorProps {
  subtotal: number;
  discount: number;
  discountCode: string;
  discountType: 'percentage' | 'fixed' | 'free_item';
}

export function DiscountSavingsIndicator({ 
  subtotal, 
  discount, 
  discountCode, 
  discountType 
}: DiscountSavingsIndicatorProps) {
  
  const calculateSavings = () => {
    if (discountType === 'percentage') {
      return (subtotal * discount) / 100;
    }
    return discount;
  };
  
  const savings = calculateSavings();
  
  return (
    <div className="bg-green-50 border border-green-200 p-3 rounded-md mt-4">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">Discount Applied</span>
        <Badge className="bg-green-600">{discountCode}</Badge>
      </div>
      <p className="text-sm text-green-800">
        {discountType === 'percentage' 
          ? `${discount}% off: You saved ${formatCurrency(savings)}!`
          : `You saved ${formatCurrency(savings)}!`}
      </p>
    </div>
  );
}
