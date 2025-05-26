
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketManagementService } from '@/services/ticketManagementService';
import { TicketPricingTier } from '@/types/TicketManagementTypes';
import { Plus, Calendar, DollarSign, Users } from 'lucide-react';

interface PricingTierManagerProps {
  eventId?: string;
  swigCircuitId?: string;
}

const PricingTierManager: React.FC<PricingTierManagerProps> = ({
  eventId,
  swigCircuitId
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    tier_name: '',
    base_price: 0,
    max_quantity: null as number | null,
    is_early_bird: false,
    early_bird_discount_percentage: 0,
    early_bird_discount_amount: 0,
    early_bird_end_date: '',
    tier_benefits: [] as string[],
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: ''
  });

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ['pricing-tiers', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getPricingTiers(eventId, swigCircuitId),
  });

  const { data: currentPrices } = useQuery({
    queryKey: ['current-ticket-prices', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getCurrentTicketPrice(eventId, swigCircuitId),
  });

  const handleCreateTier = () => {
    // Calculate the next tier order
    const nextTierOrder = tiers.length > 0 ? Math.max(...tiers.map(t => t.tier_order)) + 1 : 1;
    
    const tierData: Omit<TicketPricingTier, 'id' | 'created_at' | 'updated_at'> = {
      event_id: eventId,
      swig_circuit_id: swigCircuitId,
      tier_name: formData.tier_name,
      base_price: formData.base_price,
      tier_order: nextTierOrder,
      valid_from: new Date(formData.valid_from).toISOString(),
      valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
      max_quantity: formData.max_quantity,
      sold_quantity: 0, // Always start with 0 sold
      is_early_bird: formData.is_early_bird,
      early_bird_discount_percentage: formData.early_bird_discount_percentage,
      early_bird_discount_amount: formData.early_bird_discount_amount,
      early_bird_end_date: formData.early_bird_end_date ? new Date(formData.early_bird_end_date).toISOString() : null,
      tier_benefits: formData.tier_benefits,
      is_active: true
    };

    TicketManagementService.createPricingTier(tierData);
    setShowCreateForm(false);
    setFormData({
      tier_name: '',
      base_price: 0,
      max_quantity: null,
      is_early_bird: false,
      early_bird_discount_percentage: 0,
      early_bird_discount_amount: 0,
      early_bird_end_date: '',
      tier_benefits: [],
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: ''
    });
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      tier_benefits: [...prev.tier_benefits, '']
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tier_benefits: prev.tier_benefits.map((benefit, i) => i === index ? value : benefit)
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tier_benefits: prev.tier_benefits.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return <div>Loading pricing tiers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pricing Tiers</h2>
          <p className="text-muted-foreground">
            Manage ticket pricing tiers and early bird discounts
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tier
        </Button>
      </div>

      {currentPrices && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Current Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold">${currentPrices.current_price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Base Price</p>
                <p className="text-xl">${currentPrices.base_price.toFixed(2)}</p>
              </div>
              {currentPrices.is_early_bird && (
                <div>
                  <p className="text-sm text-muted-foreground">Early Bird Discount</p>
                  <p className="text-xl text-green-600">${currentPrices.discount_amount.toFixed(2)}</p>
                </div>
              )}
              {currentPrices.remaining_quantity && (
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-xl">{currentPrices.remaining_quantity}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Pricing Tier</CardTitle>
            <CardDescription>
              Set up a new pricing tier with optional early bird discounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tier_name">Tier Name</Label>
                <Input
                  id="tier_name"
                  value={formData.tier_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, tier_name: e.target.value }))}
                  placeholder="e.g., Early Bird, Regular, VIP"
                />
              </div>
              <div>
                <Label htmlFor="base_price">Base Price ($)</Label>
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, base_price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="valid_from">Valid From</Label>
                <Input
                  id="valid_from"
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="valid_until">Valid Until (Optional)</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="max_quantity">Max Quantity (Optional)</Label>
                <Input
                  id="max_quantity"
                  type="number"
                  value={formData.max_quantity || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    max_quantity: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.is_early_bird}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    is_early_bird: checked === true 
                  }))}
                />
                <Label>Early Bird Tier</Label>
              </div>

              {formData.is_early_bird && (
                <div className="grid grid-cols-3 gap-4 pl-6 border-l-2 border-orange-200">
                  <div>
                    <Label htmlFor="early_bird_discount_percentage">Discount (%)</Label>
                    <Input
                      id="early_bird_discount_percentage"
                      type="number"
                      step="0.1"
                      value={formData.early_bird_discount_percentage}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        early_bird_discount_percentage: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="early_bird_discount_amount">Discount ($)</Label>
                    <Input
                      id="early_bird_discount_amount"
                      type="number"
                      step="0.01"
                      value={formData.early_bird_discount_amount}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        early_bird_discount_amount: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="early_bird_end_date">Early Bird End Date</Label>
                    <Input
                      id="early_bird_end_date"
                      type="date"
                      value={formData.early_bird_end_date}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        early_bird_end_date: e.target.value 
                      }))}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Tier Benefits</Label>
                <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                  Add Benefit
                </Button>
              </div>
              <div className="space-y-2">
                {formData.tier_benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      placeholder="e.g., Priority seating, Welcome drink"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeBenefit(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTier}>
                Create Tier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {tiers.map((tier) => (
          <Card key={tier.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{tier.tier_name}</h3>
                    {tier.is_early_bird && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        <Calendar className="h-3 w-3 mr-1" />
                        Early Bird
                      </Badge>
                    )}
                    {!tier.is_active && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">${tier.base_price.toFixed(2)}</span>
                    </div>
                    
                    {tier.max_quantity && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">
                          {tier.sold_quantity}/{tier.max_quantity} sold
                        </span>
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      Order: {tier.tier_order}
                    </div>
                  </div>

                  {tier.tier_benefits.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Benefits:</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {tier.tier_benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Valid: {new Date(tier.valid_from).toLocaleDateString()} - 
                    {tier.valid_until ? new Date(tier.valid_until).toLocaleDateString() : 'No end date'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {tiers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No pricing tiers configured. Create one to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PricingTierManager;
