
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getOrganizerTaxInfo, updateOrganizerTaxInfo } from '@/services/financialService';
import { OrganizerTaxInfo } from '@/types/FinancialTypes';

interface TaxInfoFormProps {
  organizerId: string;
}

export default function TaxInfoForm({ organizerId }: TaxInfoFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [taxInfo, setTaxInfo] = useState<Partial<OrganizerTaxInfo>>({
    region: 'US',
    country_code: 'US',
    tax_exempt: false,
    address: {}
  });

  useEffect(() => {
    loadTaxInfo();
  }, [organizerId]);

  const loadTaxInfo = async () => {
    try {
      const info = await getOrganizerTaxInfo(organizerId);
      if (info) {
        setTaxInfo(info);
      }
    } catch (error) {
      console.error('Error loading tax info:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateOrganizerTaxInfo(organizerId, taxInfo);
      toast({
        title: "Tax information updated",
        description: "Your tax information has been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Failed to update tax information",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = (field: string, value: string) => {
    setTaxInfo(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={taxInfo.business_name || ''}
                onChange={(e) => setTaxInfo(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="Your business name"
              />
            </div>

            <div>
              <Label htmlFor="business-type">Business Type</Label>
              <Select 
                value={taxInfo.business_type || ''} 
                onValueChange={(value) => setTaxInfo(prev => ({ ...prev, business_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual/Sole Proprietor</SelectItem>
                  <SelectItem value="llc">LLC</SelectItem>
                  <SelectItem value="corporation">Corporation</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tax-id">Tax ID / EIN</Label>
              <Input
                id="tax-id"
                value={taxInfo.tax_id || ''}
                onChange={(e) => setTaxInfo(prev => ({ ...prev, tax_id: e.target.value }))}
                placeholder="XX-XXXXXXX"
              />
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Select 
                value={taxInfo.region || 'US'} 
                onValueChange={(value) => setTaxInfo(prev => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="EU">European Union</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Business Address</Label>
            <div>
              <Input
                value={taxInfo.address?.street || ''}
                onChange={(e) => updateAddress('street', e.target.value)}
                placeholder="Street address"
                className="mb-2"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Input
                value={taxInfo.address?.city || ''}
                onChange={(e) => updateAddress('city', e.target.value)}
                placeholder="City"
              />
              <Input
                value={taxInfo.address?.state || ''}
                onChange={(e) => updateAddress('state', e.target.value)}
                placeholder="State/Province"
              />
              <Input
                value={taxInfo.address?.postal_code || ''}
                onChange={(e) => updateAddress('postal_code', e.target.value)}
                placeholder="ZIP/Postal Code"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="tax-exempt"
              checked={taxInfo.tax_exempt || false}
              onCheckedChange={(checked) => 
                setTaxInfo(prev => ({ ...prev, tax_exempt: checked === true }))
              }
            />
            <Label htmlFor="tax-exempt">
              Tax Exempt Organization (requires certificate)
            </Label>
          </div>

          {taxInfo.verified && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-green-800 text-sm">
                ✓ Your tax information has been verified
              </p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Tax Information'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
