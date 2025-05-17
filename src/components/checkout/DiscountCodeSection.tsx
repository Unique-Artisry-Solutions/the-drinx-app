
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppliedDiscount } from '@/types/TicketTypes';

interface DiscountCodeSectionProps {
  onApplyDiscount: (discount: AppliedDiscount) => void;
  onRemoveDiscount: (codeId: string) => void;
  appliedDiscounts: AppliedDiscount[];
  isApplying?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

const DiscountCodeSection: React.FC<DiscountCodeSectionProps> = ({
  onApplyDiscount,
  onRemoveDiscount,
  appliedDiscounts,
  isApplying = false,
  hasError = false,
  errorMessage = ''
}) => {
  const [discountCode, setDiscountCode] = useState('');
  const { toast } = useToast();
  
  const handleApply = async () => {
    if (!discountCode.trim()) {
      return;
    }
    
    // Call API to validate discount code and get details
    try {
      // This would be replaced with your actual API call
      const response = await validateDiscountCode(discountCode);
      
      if (response.valid) {
        // Create the discount object based on API response
        const discount: AppliedDiscount = {
          code: discountCode,
          codeId: response.id,
          discountAmount: response.amount,
          discountType: response.type as "fixed" | "percentage" | "free_item",
          description: response.description
        };
        
        // Apply the discount
        onApplyDiscount(discount);
        
        // Clear input
        setDiscountCode('');
        
        toast({
          title: "Discount applied",
          description: `${response.description} has been applied to your order.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Invalid code",
          description: response.message || "The discount code you entered is not valid.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error validating your discount code. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleRemove = (discountId: string) => {
    onRemoveDiscount(discountId);
  };
  
  // Mock function to validate discount code (would be replaced with actual API call)
  const validateDiscountCode = async (code: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Demo validation logic
    if (code.toLowerCase() === 'welcome10') {
      return {
        valid: true,
        id: 'disc_welcome10',
        amount: 10,
        type: 'percentage' as const,
        description: '10% off your order'
      };
    } else if (code.toLowerCase() === 'save5') {
      return {
        valid: true,
        id: 'disc_save5',
        amount: 5,
        type: 'fixed' as const,
        description: '$5 off your order'
      };
    } else if (code.toLowerCase() === 'freecoffee') {
      return {
        valid: true,
        id: 'disc_freecoffee',
        amount: 0,
        type: 'free_item' as const,
        description: 'Free coffee with your order'
      };
    }
    
    return {
      valid: false,
      message: 'Invalid discount code'
    };
  };
  
  return (
    <div className="space-y-4">
      {/* Input for discount code */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          disabled={isApplying}
          className="flex-1"
        />
        <Button 
          onClick={handleApply} 
          disabled={isApplying || !discountCode.trim()}
        >
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
              Applying
            </>
          ) : (
            'Apply'
          )}
        </Button>
      </div>
      
      {/* Error message */}
      {hasError && errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      
      {/* Display applied discounts */}
      {appliedDiscounts.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Applied Discounts:</p>
          <div className="space-y-1">
            {appliedDiscounts.map((discount) => (
              <div 
                key={discount.codeId}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
              >
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <div>
                    <Badge variant="outline" className="font-mono mb-1">{discount.code}</Badge>
                    <p className="text-sm text-muted-foreground">{discount.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(discount.codeId)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCodeSection;
