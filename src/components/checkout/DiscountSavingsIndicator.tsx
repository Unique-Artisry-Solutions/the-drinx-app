
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleDollarSign, Tag, Info } from 'lucide-react';

interface DiscountSavingsIndicatorProps {
  originalPrice: number;
  discountedPrice: number;
  discountCode?: string;
  discountType?: string;
}

const DiscountSavingsIndicator: React.FC<DiscountSavingsIndicatorProps> = ({
  originalPrice,
  discountedPrice,
  discountCode,
  discountType
}) => {
  // Calculate the savings amount and percentage
  const savingsAmount = originalPrice - discountedPrice;
  const savingsPercentage = (savingsAmount / originalPrice) * 100;
  
  // No discount applied
  if (savingsAmount <= 0) {
    return null;
  }
  
  // Determine badge color based on savings percentage
  const getBadgeVariant = () => {
    if (savingsPercentage >= 25) return 'success';
    if (savingsPercentage >= 10) return 'default';
    return 'outline';
  };
  
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4 text-material-primary" />
        <span className="text-sm font-medium">
          {discountCode ? (
            <>Code: <span className="font-semibold">{discountCode}</span></>
          ) : (
            'Discount applied'
          )}
        </span>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={getBadgeVariant()} className="flex items-center space-x-1">
              <CircleDollarSign className="h-3 w-3" />
              <span>Save ${savingsAmount.toFixed(2)}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-semibold">You're saving ${savingsAmount.toFixed(2)} ({savingsPercentage.toFixed(1)}%)</p>
              {discountType && (
                <p className="text-gray-400">{discountType === 'percentage' ? 'Percentage discount' : 'Fixed amount discount'}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DiscountSavingsIndicator;
