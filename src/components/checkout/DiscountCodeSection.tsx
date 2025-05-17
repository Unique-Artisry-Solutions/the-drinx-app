
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';

export interface AppliedDiscount {
  code: string;
  type: 'percentage' | 'fixed' | 'free_item';
  value: number;
}

export interface DiscountCodeSectionProps {
  onApplyDiscount: (discount: AppliedDiscount) => void;
  currentDiscount: AppliedDiscount | null;
}

export function DiscountCodeSection({ onApplyDiscount, currentDiscount }: DiscountCodeSectionProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyCode = async () => {
    if (!code.trim()) {
      setError('Please enter a discount code');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      // Simulate API call to validate code
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful discount
      const mockDiscount: AppliedDiscount = {
        code: code.toUpperCase(),
        type: 'percentage',
        value: 10
      };
      
      onApplyDiscount(mockDiscount);
    } catch (err) {
      setError('Invalid discount code');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveDiscount = () => {
    onApplyDiscount({
      code: '',
      type: 'percentage',
      value: 0
    });
  };

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Discount Code</h3>
      
      {currentDiscount && currentDiscount.code ? (
        <div className="flex items-center gap-2 p-3 border border-green-200 bg-green-50 rounded-md">
          <Check className="text-green-500 h-5 w-5 flex-shrink-0" />
          <div className="flex-grow">
            <p className="font-medium">
              {currentDiscount.code} applied: {currentDiscount.type === 'percentage' ? 
                `${currentDiscount.value}% off` : 
                `$${currentDiscount.value.toFixed(2)} off`}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRemoveDiscount}
            className="h-8 w-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter discount code"
            className="flex-grow"
          />
          <Button 
            onClick={handleApplyCode} 
            disabled={isValidating}
            className="whitespace-nowrap"
          >
            {isValidating ? "Validating..." : "Apply"}
          </Button>
        </div>
      )}
      
      {error && (
        <p className="text-destructive text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
