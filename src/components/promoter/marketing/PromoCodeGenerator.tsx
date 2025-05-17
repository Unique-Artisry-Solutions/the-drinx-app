
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

// Define props interface
interface PromoCodeGeneratorProps {
  onCodesGenerated: (codes: any[]) => void;
  onCancel: () => void;
}

const PromoCodeGenerator: React.FC<PromoCodeGeneratorProps> = ({ onCodesGenerated, onCancel }) => {
  // Form state
  const [prefix, setPrefix] = useState('SWIG');
  const [quantity, setQuantity] = useState(1);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate the requested number of codes
    const generatedCodes = [];
    for (let i = 0; i < quantity; i++) {
      // Create unique code with prefix and random suffix
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${prefix}-${randomSuffix}`;
      
      generatedCodes.push({
        code,
        discountType,
        discountValue,
        startDate,
        endDate,
        isActive: true
      });
    }
    
    onCodesGenerated(generatedCodes);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="prefix">Code Prefix</Label>
          <Input
            id="prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.toUpperCase())}
            placeholder="SWIG"
            maxLength={10}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Codes will be generated as: {prefix}-XXXXXX
          </p>
        </div>
        
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            min={1}
            max={100}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discountType">Discount Type</Label>
            <Select 
              value={discountType} 
              onValueChange={(value) => setDiscountType(value as 'percentage' | 'fixed')}
            >
              <SelectTrigger id="discountType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="discountValue">
              {discountType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
            </Label>
            <Input
              id="discountValue"
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(parseFloat(e.target.value))}
              min={1}
              max={discountType === 'percentage' ? 100 : 1000}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Valid From</Label>
            <DatePicker
              date={startDate}
              setDate={setStartDate}
              className="w-full"
            />
          </div>
          
          <div>
            <Label>Valid Until (Optional)</Label>
            <DatePicker
              date={endDate}
              setDate={setEndDate}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Generate Codes
        </Button>
      </div>
    </form>
  );
};

export default PromoCodeGenerator;
