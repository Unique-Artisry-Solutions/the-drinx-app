
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Ticket, Copy } from 'lucide-react';
import { AppliedDiscount } from './DiscountCodeSection';
import { useToast } from '@/hooks/use-toast';

export interface SavedPromotionCodesProps {
  userId: string;
  onApplyCode: (discount: AppliedDiscount) => void;
}

export function SavedPromotionCodes({ userId, onApplyCode }: SavedPromotionCodesProps) {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock saved promotion codes
  const savedCodes = [
    { id: '1', code: 'WELCOME10', discount_type: 'percentage' as const, discount_value: 10, description: 'Welcome discount' },
    { id: '2', code: 'FREESHIP', discount_type: 'fixed' as const, discount_value: 5, description: 'Free shipping' },
  ];

  const handleCopyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      description: `Code ${code} copied to clipboard`,
    });
  };

  const handleApplyCode = (code: string, type: 'percentage' | 'fixed' | 'free_item', value: number) => {
    onApplyCode({
      code,
      type,
      value
    });
  };

  if (!userId) return null;

  return (
    <div className="border rounded-md p-3 mt-4">
      <Button
        variant="ghost"
        className="w-full flex justify-between p-2 h-auto"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Ticket className="h-4 w-4 mr-2" />
          <span>Your Saved Promotion Codes</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {isLoading ? (
            <p className="text-sm text-center py-2">Loading your saved codes...</p>
          ) : savedCodes.length > 0 ? (
            savedCodes.map((code) => (
              <div key={code.id} className="border rounded p-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{code.code}</p>
                  <p className="text-xs text-gray-500">{code.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleCopyToClipboard(code.code)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApplyCode(code.code, code.discount_type, code.discount_value)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center py-2">You don't have any saved promotion codes</p>
          )}
        </div>
      )}
    </div>
  );
}
