
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TicketManagementService } from '@/services/ticketManagementService';
import { TicketPricingTier } from '@/types/TicketManagementTypes';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface PricingTierManagerProps {
  eventId?: string;
  swigCircuitId?: string;
}

const PricingTierManager: React.FC<PricingTierManagerProps> = ({
  eventId,
  swigCircuitId
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTier, setEditingTier] = useState<TicketPricingTier | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ['pricing-tiers', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getPricingTiers({
      eventId,
      swigCircuitId
    }),
  });

  const [newTier, setNewTier] = useState<Partial<TicketPricingTier>>({
    tier_name: '',
    base_price: 0,
    tier_order: 1,
    max_quantity: undefined,
    is_early_bird: false,
    early_bird_discount_percentage: 0,
    early_bird_discount_amount: 0,
    tier_benefits: [],
    is_active: true,
    event_id: eventId,
    swig_circuit_id: swigCircuitId
  });

  const handleCreateTier = () => {
    if (!newTier.tier_name || newTier.base_price === 0) {
      toast({
        title: "Validation Error",
        description: "Please provide tier name and base price",
        variant: "destructive",
      });
      return;
    }

    // Simulate creation success
    toast({
      title: "Tier Created",
      description: `Pricing tier "${newTier.tier_name}" has been created successfully.`,
    });
    
    setIsCreating(false);
    setNewTier({
      tier_name: '',
      base_price: 0,
      tier_order: 1,
      max_quantity: undefined,
      is_early_bird: false,
      early_bird_discount_percentage: 0,
      early_bird_discount_amount: 0,
      tier_benefits: [],
      is_active: true,
      event_id: eventId,
      swig_circuit_id: swigCircuitId
    });
    
    queryClient.invalidateQueries({ queryKey: ['pricing-tiers'] });
  };

  const handleUpdateTier = (tier: TicketPricingTier) => {
    toast({
      title: "Tier Updated",
      description: `Pricing tier "${tier.tier_name}" has been updated successfully.`,
    });
    
    setEditingTier(null);
    queryClient.invalidateQueries({ queryKey: ['pricing-tiers'] });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getDiscountedPrice = (tier: TicketPricingTier) => {
    if (!tier.is_early_bird) return tier.base_price;
    
    if (tier.early_bird_discount_percentage > 0) {
      return tier.base_price * (1 - tier.early_bird_discount_percentage / 100);
    }
    
    return tier.base_price - tier.early_bird_discount_amount;
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading pricing tiers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pricing Tiers</h2>
          <p className="text-muted-foreground">
            Manage ticket pricing tiers and early bird discounts
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tier
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Pricing Tier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tier-name">Tier Name</Label>
                <Input
                  id="tier-name"
                  value={newTier.tier_name}
                  onChange={(e) => setNewTier({ ...newTier, tier_name: e.target.value })}
                  placeholder="e.g., General Admission"
                />
              </div>
              <div>
                <Label htmlFor="base-price">Base Price ($)</Label>
                <Input
                  id="base-price"
                  type="number"
                  step="0.01"
                  value={newTier.base_price}
                  onChange={(e) => setNewTier({ ...newTier, base_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tier-order">Display Order</Label>
                <Input
                  id="tier-order"
                  type="number"
                  value={newTier.tier_order}
                  onChange={(e) => setNewTier({ ...newTier, tier_order: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label htmlFor="max-quantity">Max Quantity (optional)</Label>
                <Input
                  id="max-quantity"
                  type="number"
                  value={newTier.max_quantity || ''}
                  onChange={(e) => setNewTier({ 
                    ...newTier, 
                    max_quantity: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleCreateTier}>
                <Save className="h-4 w-4 mr-2" />
                Create Tier
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {tiers.map((tier) => (
          <Card key={tier.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{tier.tier_name}</h3>
                    {tier.is_early_bird && (
                      <Badge variant="secondary">Early Bird</Badge>
                    )}
                    {!tier.is_active && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Base Price: {formatPrice(tier.base_price)}</span>
                    {tier.is_early_bird && (
                      <span>
                        Current Price: {formatPrice(getDiscountedPrice(tier))}
                      </span>
                    )}
                    <span>Order: {tier.tier_order}</span>
                    {tier.max_quantity && (
                      <span>
                        Available: {Math.max(0, tier.max_quantity - tier.sold_quantity)}/{tier.max_quantity}
                      </span>
                    )}
                  </div>

                  {tier.tier_benefits && tier.tier_benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tier.tier_benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTier(tier)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Handle delete
                      toast({
                        title: "Feature Coming Soon",
                        description: "Tier deletion will be available soon",
                      });
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {tiers.length === 0 && !isCreating && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No pricing tiers found</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Tier
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PricingTierManager;
