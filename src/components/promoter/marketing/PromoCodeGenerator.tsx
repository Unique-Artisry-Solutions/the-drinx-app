
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { Ticket, Percent, DollarSign, CalendarDays, Users } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free';
  discountValue: number;
  maxUses: number | null;
  usageCount: number;
  expiryDate: string | null;
  isActive: boolean;
}

interface PromoCodeGeneratorProps {
  eventId?: string;
}

const PromoCodeGenerator: React.FC<PromoCodeGeneratorProps> = ({ eventId }) => {
  const [promoCode, setPromoCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed' | 'free'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [maxUses, setMaxUses] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [generatedCodes, setGeneratedCodes] = useState<PromoCode[]>([
    {
      id: '1',
      code: 'WELCOME20',
      description: '20% off for first-time customers',
      discountType: 'percentage',
      discountValue: 20,
      maxUses: 100,
      usageCount: 45,
      expiryDate: '2025-12-31',
      isActive: true
    },
    {
      id: '2',
      code: 'SUMMER10OFF',
      description: '$10 off for summer promotion',
      discountType: 'fixed',
      discountValue: 10,
      maxUses: null,
      usageCount: 27,
      expiryDate: '2025-09-30',
      isActive: true
    }
  ]);

  const generateRandomCode = () => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    setPromoCode(randomStr);
  };

  const handleCreateCode = () => {
    if (!promoCode) {
      toast.error("Please enter a promo code");
      return;
    }

    if (discountType !== 'free' && (!discountValue || discountValue <= 0)) {
      toast.error("Please enter a valid discount value");
      return;
    }

    // Check for duplicate codes
    if (generatedCodes.some(code => code.code === promoCode)) {
      toast.error("This promo code already exists");
      return;
    }

    const newCode: PromoCode = {
      id: `promo-${Date.now()}`,
      code: promoCode.toUpperCase(),
      description,
      discountType,
      discountValue: discountType === 'free' ? 100 : discountValue,
      maxUses: maxUses ? parseInt(maxUses) : null,
      usageCount: 0,
      expiryDate: expiryDate || null,
      isActive: true
    };

    setGeneratedCodes([...generatedCodes, newCode]);
    
    // Reset form
    setPromoCode('');
    setDescription('');
    setDiscountValue(10);
    setMaxUses('');
    setExpiryDate('');

    toast.success("Promo code created successfully");
  };

  const toggleActiveState = (id: string) => {
    setGeneratedCodes(codes => 
      codes.map(code => 
        code.id === id ? { ...code, isActive: !code.isActive } : code
      )
    );
    
    toast.success("Promo code status updated");
  };

  const deleteCode = (id: string) => {
    setGeneratedCodes(codes => codes.filter(code => code.id !== id));
    toast.success("Promo code deleted");
  };

  const getDiscountBadge = (code: PromoCode) => {
    switch (code.discountType) {
      case 'percentage':
        return (
          <div className="flex items-center text-sm bg-blue-100 text-blue-800 rounded px-2 py-0.5">
            <Percent className="h-3 w-3 mr-1" />
            {code.discountValue}% off
          </div>
        );
      case 'fixed':
        return (
          <div className="flex items-center text-sm bg-green-100 text-green-800 rounded px-2 py-0.5">
            <DollarSign className="h-3 w-3 mr-1" />
            ${code.discountValue} off
          </div>
        );
      case 'free':
        return (
          <div className="flex items-center text-sm bg-purple-100 text-purple-800 rounded px-2 py-0.5">
            <Ticket className="h-3 w-3 mr-1" />
            Free
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Ticket className="mr-2 h-5 w-5" />
          Promotional Codes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create new promo code */}
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
          <h3 className="font-medium text-lg">Create New Promo Code</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promo-code">Promo Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="promo-code"
                  placeholder="e.g. WELCOME20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="uppercase"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={generateRandomCode}
                >
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount-type">Discount Type</Label>
              <Select 
                value={discountType} 
                onValueChange={(value) => setDiscountType(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  <SelectItem value="free">Free Ticket</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {discountType !== 'free' && (
              <div className="space-y-2">
                <Label htmlFor="discount-value">
                  {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                </Label>
                <Input
                  id="discount-value"
                  type="number"
                  min={1}
                  max={discountType === 'percentage' ? 100 : undefined}
                  placeholder={discountType === 'percentage' ? 'e.g. 20' : 'e.g. 10'}
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="max-uses">Max Uses (Optional)</Label>
              <Input
                id="max-uses"
                type="number"
                min={1}
                placeholder="Unlimited if empty"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this promo code is for"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleCreateCode}>
              Create Promo Code
            </Button>
          </div>
        </div>

        {/* List of promo codes */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Active Promo Codes</h3>
          
          {generatedCodes.length === 0 ? (
            <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">No promotional codes created yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedCodes.map(code => (
                <div 
                  key={code.id}
                  className={`flex items-center justify-between p-4 bg-background rounded-lg border ${!code.isActive ? 'opacity-60' : ''}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{code.code}</h4>
                      {getDiscountBadge(code)}
                      {!code.isActive && (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{code.description}</p>
                    <div className="flex text-xs text-muted-foreground space-x-4 mt-1">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {code.usageCount} / {code.maxUses === null ? '∞' : code.maxUses} uses
                      </span>
                      {code.expiryDate && (
                        <span className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          Expires: {new Date(code.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant={code.isActive ? "ghost" : "outline"}
                      size="sm"
                      onClick={() => toggleActiveState(code.id)}
                    >
                      {code.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteCode(code.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoCodeGenerator;
