
import React from 'react';
import { useEffect, useState } from 'react';
import { Check, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrevious } from '@/hooks/usePrevious';

interface DiscountSavingsIndicatorProps {
  discountAmount: number;
  total: number;
  animateSavings?: boolean;
  className?: string;
}

export default function DiscountSavingsIndicator({ 
  discountAmount, 
  total,
  animateSavings = true,
  className
}: DiscountSavingsIndicatorProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevDiscountAmount = usePrevious(discountAmount);
  
  // Calculate savings percentage
  const originalTotal = total + discountAmount;
  const savingsPercentage = originalTotal > 0 
    ? Math.round((discountAmount / originalTotal) * 100) 
    : 0;
    
  useEffect(() => {
    // Animate when discount changes and increases
    if (animateSavings && 
        prevDiscountAmount !== undefined && 
        discountAmount > prevDiscountAmount) {
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 3000); // Animation duration
      
      return () => clearTimeout(timer);
    }
  }, [discountAmount, prevDiscountAmount, animateSavings]);

  // Don't render if no discount
  if (discountAmount <= 0) return null;

  return (
    <div 
      className={cn(
        "flex items-center justify-between rounded-md border p-2",
        isAnimating ? "bg-green-50 border-green-200 animate-pulse" : "bg-muted/50",
        className
      )}
    >
      <div className="flex items-center">
        <div className={cn(
          "flex items-center justify-center w-6 h-6 rounded-full mr-2",
          isAnimating ? "bg-green-500 text-white" : "bg-muted text-foreground"
        )}>
          {isAnimating ? (
            <Check className="h-4 w-4" />
          ) : (
            <Tag className="h-4 w-4" />
          )}
        </div>
        <div>
          <span className="font-medium">
            {isAnimating ? "Savings Applied!" : "Discount Applied"}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={cn(
          "font-semibold",
          isAnimating ? "text-green-600" : "text-foreground"
        )}>
          -${discountAmount.toFixed(2)}
        </span>
        <span className="text-xs text-muted-foreground bg-muted rounded-md px-1.5 py-0.5">
          {savingsPercentage}% off
        </span>
      </div>
    </div>
  );
}
