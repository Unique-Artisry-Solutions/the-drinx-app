
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useTicketManagement } from '@/hooks/useTicketManagement';
import { TicketManagementService } from '@/services/ticketManagementService';
import { TicketPricingTier } from '@/types/TicketManagementTypes';
import { Plus, DollarSign, Calendar } from 'lucide-react';

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
    early_bird_discount_percentage: 0,
    early_bird_end_date: ''
  });

  const { data: pricingTiers = [], isLoading } = useQuery({
    queryKey: ['pricing-tiers', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getPricingTiers(eventId, swigCircuitId),
  });

  const { data: currentPrices = [] } = useQuery({
    queryKey: ['current-ticket-prices', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getCurrentTicketPrice(eventId, swigCircuitId),
  });

  const handleCreateTier = async () => {
    const tierData: Omit<TicketPricingTier, 'id' | 'created_at' | 'updated_at' | 'sold_quantity' | 'tier_order'> = {
      event_id: eventId,
      swig_circuit_id: swigCircuitId,
      tier_name: formData.tier_name,
      base_price: formData.base_price,
      valid_from: new Date().toISOString(),
      max_quantity: formData.max_quantity,
      is_early_bird: formData.early_bird_discount_percentage > 0,
      early_bird_discount_percentage: formData.early_bird_discount_percentage,
      early_bird_discount_amount: 0,
      early_bird_end_date: formData.early_bird_end_date || undefined,
      tier_benefits: [],
      is_active: true
    };

    await TicketManagementService.createPricingTier(tierData);
    setShowCreateForm(false);
    setFormData({
      tier_name: '',
      base_price: 0,
      max_quantity: null,
      early_bird_discount_percentage: 0,
      early_bird_end_date: ''
    });
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
                <Label htmlFor="tier-name">Tier Name</Label>
                <Input
                  id="tier-name"
                  value={formData.tier_name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    tier_name: e.target.value
                  }))}
                  placeholder="e.g., Early Bird, General Admission"
                />
              </div>
              <div>
                <Label htmlFor="base-price">Base Price ($)</Label>
                <Input
                  id="base-price"
                  type="number"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    base_price: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max-quantity">Max Quantity (Optional)</Label>
                <Input
                  id="max-quantity"
                  type="number"
                  value={formData.max_quantity || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    max_quantity: e.target.value ? parseInt(e.target.value) : null
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="early-bird-discount">Early Bird Discount (%)</Label>
                <Input
                  id="early-bird-discount"
                  type="number"
                  value={formData.early_bird_discount_percentage}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    early_bird_discount_percentage: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
            </div>

            {formData.early_bird_discount_percentage > 0 && (
              <div>
                <Label htmlFor="early-bird-end">Early Bird End Date</Label>
                <Input
                  id="early-bird-end"
                  type="datetime-local"
                  value={formData.early_bird_end_date}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    early_bird_end_date: e.target.value
                  }))}
                />
              </div>
            )}
            
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
        {pricingTiers.map((tier) => (
          <Card key={tier.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{tier.tier_name}</h3>
                    {tier.is_early_bird && (
                      <Badge variant="secondary">Early Bird</Badge>
                    )}
                    {!tier.is_active && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${tier.base_price.toFixed(2)}</span>
                    </div>
                    
                    {tier.max_quantity && (
                      <div>
                        {tier.sold_quantity} / {tier.max_quantity} sold
                      </div>
                    )}
                    
                    {tier.early_bird_end_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Early bird until {new Date(tier.early_bird_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  {tier.is_early_bird && tier.early_bird_discount_percentage > 0 && (
                    <div className="text-green-600 font-medium">
                      {tier.early_bird_discount_percentage}% off
                    </div>
                  )}
                  <div className="text-2xl font-bold">
                    ${(tier.base_price * (1 - tier.early_bird_discount_percentage / 100)).toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {pricingTiers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No pricing tiers configured. Add one to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PricingTierManager;
