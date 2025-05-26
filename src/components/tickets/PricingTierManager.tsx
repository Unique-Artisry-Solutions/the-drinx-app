import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { TicketManagementService } from '@/services/ticketManagementService';
import { TicketPricingTier } from '@/types/TicketManagementTypes';
import { Plus, Edit, Trash, Clock, DollarSign } from 'lucide-react';

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
  const [showNewTierForm, setShowNewTierForm] = useState(false);

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ['pricing-tiers', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getPricingTiers(eventId, swigCircuitId),
  });

  const { data: currentPrices = [] } = useQuery({
    queryKey: ['current-prices', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getCurrentTicketPrices(eventId, swigCircuitId),
  });

  const createTierMutation = useMutation({
    mutationFn: TicketManagementService.createPricingTier,
    onSuccess: () => {
      toast({
        title: "Tier Created",
        description: "Pricing tier has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['pricing-tiers'] });
      queryClient.invalidateQueries({ queryKey: ['current-prices'] });
      setShowNewTierForm(false);
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const updateTierMutation = useMutation({
    mutationFn: ({ tierId, updates }: { tierId: string; updates: Partial<TicketPricingTier> }) =>
      TicketManagementService.updatePricingTier(tierId, updates),
    onSuccess: () => {
      toast({
        title: "Tier Updated",
        description: "Pricing tier has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['pricing-tiers'] });
      queryClient.invalidateQueries({ queryKey: ['current-prices'] });
      setEditingTier(null);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleCreateTier = (formData: FormData) => {
    const tierData = {
      event_id: eventId,
      swig_circuit_id: swigCircuitId,
      tier_name: formData.get('tier_name') as string,
      base_price: parseFloat(formData.get('base_price') as string),
      tier_order: parseInt(formData.get('tier_order') as string) || 1,
      max_quantity: parseInt(formData.get('max_quantity') as string) || null,
      is_early_bird: formData.get('is_early_bird') === 'on',
      early_bird_discount_percentage: parseFloat(formData.get('early_bird_discount_percentage') as string) || 0,
      early_bird_discount_amount: parseFloat(formData.get('early_bird_discount_amount') as string) || 0,
      early_bird_end_date: formData.get('early_bird_end_date') as string || null,
      tier_benefits: [],
      sold_quantity: 0,
      is_active: true,
      valid_from: new Date().toISOString(),
      valid_until: formData.get('valid_until') as string || null,
    };

    createTierMutation.mutate(tierData);
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
            Manage ticket pricing and early bird discounts
          </p>
        </div>
        <Button onClick={() => setShowNewTierForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Tier
        </Button>
      </div>

      {/* Current Prices Display */}
      {currentPrices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Current Prices
            </CardTitle>
            <CardDescription>
              Active pricing based on current date and early bird periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPrices.map((price) => (
                <div key={price.tier_id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{price.tier_name}</h4>
                    {price.is_early_bird && (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Early Bird
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Price:</span>
                      <span className="font-bold text-lg">${price.current_price}</span>
                    </div>
                    {price.discount_amount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Base Price:</span>
                        <span className="text-sm line-through">${price.base_price}</span>
                      </div>
                    )}
                    {price.remaining_quantity !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Available:</span>
                        <span className="text-sm">{price.remaining_quantity}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers.map((tier) => (
          <Card key={tier.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{tier.tier_name}</CardTitle>
                <div className="flex items-center space-x-2">
                  {tier.is_early_bird && (
                    <Badge variant="outline">Early Bird</Badge>
                  )}
                  <Badge variant={tier.is_active ? "default" : "secondary"}>
                    {tier.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Base Price</Label>
                  <p className="font-semibold">${tier.base_price}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Order</Label>
                  <p className="font-semibold">{tier.tier_order}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Max Quantity</Label>
                  <p className="font-semibold">{tier.max_quantity || 'Unlimited'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Sold</Label>
                  <p className="font-semibold">{tier.sold_quantity}</p>
                </div>
              </div>

              {tier.is_early_bird && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Early Bird Details</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {tier.early_bird_discount_percentage > 0 && (
                      <div>
                        <span className="text-blue-700">Discount:</span>
                        <span className="font-semibold ml-1">{tier.early_bird_discount_percentage}%</span>
                      </div>
                    )}
                    {tier.early_bird_discount_amount > 0 && (
                      <div>
                        <span className="text-blue-700">Discount:</span>
                        <span className="font-semibold ml-1">${tier.early_bird_discount_amount}</span>
                      </div>
                    )}
                    {tier.early_bird_end_date && (
                      <div className="col-span-2">
                        <span className="text-blue-700">Ends:</span>
                        <span className="font-semibold ml-1">
                          {new Date(tier.early_bird_end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(tier.created_at).toLocaleDateString()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingTier(tier)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tiers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No pricing tiers found. Add your first tier to get started.</p>
          </CardContent>
        </Card>
      )}

      {/* New Tier Form Modal would go here */}
      {/* Edit Tier Form Modal would go here */}
    </div>
  );
};

export default PricingTierManager;
