
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, Loader2, X, Check } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/contexts/CartContext';
import { autoApplyBestDiscount, AppliedDiscount, incrementCodeUsage } from '@/utils/discountCodeUtils';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

interface DiscountCodeSectionProps {
  items: CartItem[];
  onApplyDiscount: (discount: AppliedDiscount | null) => void;
  currentDiscount: AppliedDiscount | null;
}

const DiscountCodeSection: React.FC<DiscountCodeSectionProps> = ({
  items,
  onApplyDiscount,
  currentDiscount
}) => {
  const [manualCode, setManualCode] = useState<string>("");
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [isCheckingAuto, setIsCheckingAuto] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Auto-apply the best discount when items change
  useEffect(() => {
    const checkForAutomaticDiscounts = async () => {
      // Only if we don't already have a discount applied
      if (!currentDiscount && items.length > 0) {
        setIsCheckingAuto(true);
        try {
          const autoDiscount = await autoApplyBestDiscount(items, user?.id);
          
          if (autoDiscount) {
            onApplyDiscount(autoDiscount);
            toast({
              title: "Discount automatically applied",
              description: `"${autoDiscount.code}" has been applied to your order.`,
              variant: "default",
            });

            // Increment usage count for auto-applied codes
            if (autoDiscount.codeId) {
              try {
                // Determine the table based on the code pattern or metadata
                const tableName = autoDiscount.codeId.startsWith('evt_') 
                  ? 'event_discount_codes' 
                  : 'establishment_promotions';

                await incrementCodeUsage(autoDiscount.codeId, tableName);
              } catch (error) {
                console.error("Error incrementing auto discount usage:", error);
              }
            }
          }
        } catch (error) {
          console.error("Error auto-applying discount:", error);
        } finally {
          setIsCheckingAuto(false);
        }
      }
    };
    
    checkForAutomaticDiscounts();
  }, [items, user, currentDiscount, onApplyDiscount, toast]);
  
  // Handle manual code application
  const handleApplyCode = async () => {
    if (!manualCode.trim()) {
      toast({
        title: "No code entered",
        description: "Please enter a promotion code.",
        variant: "destructive",
      });
      return;
    }
    
    setIsApplying(true);
    
    try {
      // This is a simplified version - in a real app, you'd validate the code with the server
      const { data, error } = await supabase
        .from('establishment_promotions')
        .select('*')
        .eq('code', manualCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();
      
      if (error || !data) {
        // Check event discount codes if establishment code not found
        const { data: eventData, error: eventError } = await supabase
          .from('event_discount_codes')
          .select('*')
          .eq('code', manualCode.trim().toUpperCase())
          .eq('is_active', true)
          .single();
        
        if (eventError || !eventData) {
          throw new Error("Invalid or expired promotion code");
        }
        
        // Process event discount
        const discountAmount = eventData.discount_type === 'percentage' 
          ? items.reduce((total, item) => total + item.price, 0) * (eventData.discount_amount / 100)
          : eventData.discount_amount;
          
        // Apply the discount
        const discountToApply = {
          code: eventData.code,
          codeId: eventData.id,
          discountAmount,
          discountType: eventData.discount_type,
          description: eventData.description || 'Event discount'
        };
        
        onApplyDiscount(discountToApply);
        
        // Increment usage count using our new function
        await incrementCodeUsage(eventData.id, 'event_discount_codes');
        
        toast({
          title: "Code applied",
          description: `"${eventData.code}" has been applied to your order.`,
        });
      } else {
        // Process establishment promotion
        const discountAmount = data.discount_type === 'percentage' 
          ? items.reduce((total, item) => total + item.price, 0) * (data.discount_value / 100)
          : data.discount_value;
          
        // Apply the discount
        const discountToApply = {
          code: data.code,
          codeId: data.id,
          discountAmount,
          discountType: data.discount_type,
          description: data.description
        };
        
        onApplyDiscount(discountToApply);
        
        // Increment usage count using our new function
        await incrementCodeUsage(data.id, 'establishment_promotions');
        
        toast({
          title: "Code applied",
          description: `"${data.code}" has been applied to your order.`,
        });
      }
      
      setManualCode("");
    } catch (error) {
      toast({
        title: "Invalid code",
        description: error instanceof Error ? error.message : "The promotion code is invalid or expired.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  const handleRemoveDiscount = () => {
    onApplyDiscount(null);
  };
  
  return (
    <div className="space-y-3">
      <Label htmlFor="discount-code">Discount Code</Label>
      
      {currentDiscount ? (
        <div className="flex items-center justify-between p-2 bg-primary/5 rounded-md">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-medium">{currentDiscount.code}</span>
            <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">
              {currentDiscount.discountType === 'percentage' 
                ? `${currentDiscount.discountAmount.toFixed(1)}% off` 
                : `$${currentDiscount.discountAmount.toFixed(2)} off`}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRemoveDiscount}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            id="discount-code"
            placeholder="Enter promotion code"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            disabled={isApplying || isCheckingAuto}
            className="flex-1"
          />
          <Button
            onClick={handleApplyCode}
            disabled={isApplying || isCheckingAuto || !manualCode.trim()}
            className="whitespace-nowrap"
          >
            {isApplying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              'Apply Code'
            )}
          </Button>
        </div>
      )}
      
      {isCheckingAuto && (
        <div className="flex items-center justify-center text-xs text-gray-500">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Checking for automatic discounts...
        </div>
      )}
    </div>
  );
};

export default DiscountCodeSection;
