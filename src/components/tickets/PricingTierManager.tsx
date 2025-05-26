import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { TicketManagementService } from '@/services/ticketManagementService';
import { TicketPricingTier } from '@/types/TicketManagementTypes';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

interface PricingTierManagerProps {
  eventId?: string;
  swigCircuitId?: string;
}

const PricingTierManager: React.FC<PricingTierManagerProps> = ({ eventId, swigCircuitId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTier, setEditingTier] = useState<TicketPricingTier | null>(null);
  
  const [formData, setFormData] = useState({
    tier_name: '',
    base_price: 0,
    tier_order: 1,
    max_quantity: undefined as number | undefined,
    is_early_bird: false,
    early_bird_discount_percentage: 0,
    early_bird_end_date: '',
    valid_from: new Date().toISOString().slice(0, 16),
    valid_until: ''
  });

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ['pricing-tiers', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getPricingTiers(eventId, swigCircuitId),
  });

  const { data: currentPrices = [] } = useQuery({
    queryKey: ['current-ticket-prices', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getCurrentTicketPrices(eventId, swigCircuitId),
  });

  const createTierMutation = useMutation({
    mutationFn: (tierData: Omit<TicketPricingTier, 'id' | 'created_at' | 'updated_at'>) =>
      TicketManagementService.createPricingTier(tierData),
    onSuccess: () => {
      toast({
        title: "Pricing Tier Created",
        description: "New pricing tier has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['pricing-tiers'] });
      setShowCreateForm(false);
      resetForm();
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
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TicketPricingTier> }) =>
      TicketManagementService.updatePricingTier(id, updates),
    onSuccess: () => {
      toast({
        title: "Pricing Tier Updated",
        description: "Pricing tier has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['pricing-tiers'] });
      setEditingTier(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      tier_name: '',
      base_price: 0,
      tier_order: 1,
      max_quantity: undefined,
      is_early_bird: false,
      early_bird_discount_percentage: 0,
      early_bird_end_date: '',
      valid_from: new Date().toISOString().slice(0, 16),
      valid_until: ''
    });
  };

  const handleSubmit = () => {
    const tierData = {
      event_id: eventId,
      swig_circuit_id: swigCircuitId,
      tier_name: formData.tier_name,
      base_price: formData.base_price,
      tier_order: formData.tier_order,
      max_quantity: formData.max_quantity,
      sold_quantity: 0,
      is_early_bird: formData.is_early_bird,
      early_bird_discount_percentage: formData.early_bird_discount_percentage,
      early_bird_discount_amount: 0,
      early_bird_end_date: formData.early_bird_end_date ? new Date(formData.early_bird_end_date).toISOString() : null,
      tier_benefits: [],
      is_active: true,
      valid_from: new Date(formData.valid_from).toISOString(),
      valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null
    };

    if (editingTier) {
      updateTierMutation.mutate({ id: editingTier.id, updates: tierData });
    } else {
      createTierMutation.mutate(tierData);
    }
  };

  const startEdit = (tier: TicketPricingTier) => {
    setEditingTier(tier);
    setFormData({
      tier_name: tier.tier_name,
      base_price: tier.base_price,
      tier_order: tier.tier_order,
      max_quantity: tier.max_quantity || undefined,
      is_early_bird: tier.is_early_bird || false,
      early_bird_discount_percentage: tier.early_bird_discount_percentage || 0,
      early_bird_end_date: tier.early_bird_end_date ? new Date(tier.early_bird_end_date).toISOString().slice(0, 16) : '',
      valid_from: new Date(tier.valid_from).toISOString().slice(0, 16),
      valid_until: tier.valid_until ? new Date(tier.valid_until).toISOString().slice(0, 16) : ''
    });
    setShowCreateForm(true);
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

      {/* Current Prices Display */}
      {currentPrices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Current Ticket Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {currentPrices.map((price) => (
                <div key={price.tier_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{price.tier_name}</h4>
                    {price.is_early_bird && (
                      <Badge variant="secondary" className="mt-1">
                        Early Bird - Save ${price.discount_amount.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${price.current_price.toFixed(2)}</p>
                    {price.is_early_bird && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${price.base_price.toFixed(2)}
                      </p>
                    )}
                    {price.remaining_quantity !== null && (
                      <p className="text-xs text-muted-foreground">
                        {price.remaining_quantity} remaining
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTier ? 'Edit' : 'Create'} Pricing Tier</CardTitle>
            <CardDescription>
              Set up pricing tiers with optional early bird discounts
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
                  placeholder="e.g., General Admission"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tier_order">Display Order</Label>
                <Input
                  id="tier_order"
                  type="number"
                  value={formData.tier_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, tier_order: parseInt(e.target.value) || 1 }))}
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
                    max_quantity: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_early_bird}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_early_bird: checked }))}
              />
              <Label>Enable Early Bird Discount</Label>
            </div>

            {formData.is_early_bird && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="early_bird_discount_percentage">Discount Percentage</Label>
                  <Input
                    id="early_bird_discount_percentage"
                    type="number"
                    step="0.1"
                    max="100"
                    value={formData.early_bird_discount_percentage}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      early_bird_discount_percentage: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="early_bird_end_date">Early Bird End Date</Label>
                  <Input
                    id="early_bird_end_date"
                    type="datetime-local"
                    value={formData.early_bird_end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, early_bird_end_date: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valid_from">Valid From</Label>
                <Input
                  id="valid_from"
                  type="datetime-local"
                  value={formData.valid_from}
                  onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="valid_until">Valid Until (Optional)</Label>
                <Input
                  id="valid_until"
                  type="datetime-local"
                  value={formData.valid_until}
                  onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingTier(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createTierMutation.isPending || updateTierMutation.isPending}
              >
                {createTierMutation.isPending || updateTierMutation.isPending 
                  ? 'Saving...' 
                  : editingTier ? 'Update Tier' : 'Create Tier'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Tiers */}
      <div className="grid gap-4">
        {tiers.map((tier) => (
          <Card key={tier.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold">{tier.tier_name}</h3>
                    <Badge variant="outline">Order: {tier.tier_order}</Badge>
                    {tier.is_early_bird && <Badge variant="secondary">Early Bird</Badge>}
                    {!tier.is_active && <Badge variant="destructive">Inactive</Badge>}
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Base: ${tier.base_price.toFixed(2)}</span>
                    {tier.max_quantity && (
                      <span>Max: {tier.max_quantity} tickets</span>
                    )}
                    <span>Sold: {tier.sold_quantity || 0}</span>
                    <span>Valid: {new Date(tier.valid_from).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(tier)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {tiers.length === 0 && (
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
