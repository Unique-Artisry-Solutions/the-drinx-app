
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';

// Define props interface consistently
export interface PromoCodeGeneratorProps {
  onCodesGenerated: (codes: any[]) => void;
  onCancel: () => void;
}

const PromoCodeGenerator: React.FC<PromoCodeGeneratorProps> = ({ 
  onCodesGenerated,
  onCancel 
}) => {
  const [prefix, setPrefix] = useState('SWIG');
  const [quantity, setQuantity] = useState(10);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'free_item'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateRandomString = (length: number) => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like I, O, 1, 0
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate codes
      const generatedCodes = Array(quantity).fill(0).map(() => ({
        code: `${prefix}${generateRandomString(6)}`,
        discount_type: discountType,
        discount_value: discountValue,
        expiry_date: expiryDate?.toISOString(),
        created_at: new Date().toISOString()
      }));

      // Call the onCodesGenerated callback
      onCodesGenerated(generatedCodes);
      
      toast({
        title: 'Promo codes generated',
        description: `${quantity} promo codes have been successfully created.`,
      });
    } catch (error) {
      console.error('Error generating promo codes:', error);
      toast({
        title: 'Failed to generate codes',
        description: 'There was an error generating the promo codes.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Code Prefix</label>
          <Input
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.toUpperCase())}
            placeholder="SWIG"
            maxLength={10}
            className="uppercase"
          />
          <p className="text-xs text-muted-foreground">
            Your codes will look like: {prefix}{generateRandomString(6)}
          </p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Number of Codes</label>
          <div className="flex items-center space-x-2">
            <Slider 
              value={[quantity]} 
              min={1} 
              max={100} 
              step={1} 
              onValueChange={(value) => setQuantity(value[0])} 
              className="flex-grow" 
            />
            <span className="w-12 text-center">{quantity}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Discount Type</label>
          <Select 
            value={discountType} 
            onValueChange={(value: 'percentage' | 'fixed' | 'free_item') => setDiscountType(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
              <SelectItem value="free_item">Free Item</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            {discountType === 'percentage' ? 'Discount Percentage' : 
             discountType === 'fixed' ? 'Discount Amount' : 'Item Value'}
          </label>
          <div className="flex items-center space-x-2">
            <Slider 
              value={[discountValue]} 
              min={1} 
              max={discountType === 'percentage' ? 100 : 50} 
              step={1} 
              onValueChange={(value) => setDiscountValue(value[0])} 
              className="flex-grow" 
            />
            <span className="w-16 text-center">
              {discountType === 'percentage' ? `${discountValue}%` : `$${discountValue}`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Expiry Date</label>
        <DatePicker 
          selected={expiryDate} 
          onSelect={setExpiryDate} 
          className="w-full"
          minDate={new Date()}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Codes'}
        </Button>
      </div>
    </form>
  );
};

export default PromoCodeGenerator;
