
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TicketManagementService } from '@/services/ticketManagementService';
import { TicketPricingTier, TicketPriceInfo } from '@/types/TicketManagementTypes';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, DollarSign, Calendar, Users } from 'lucide-react';

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTier, setEditingTier] = useState<TicketPricingTier | null>(null);

  // Fetch current pricing information
  const { data: currentPricing, isLoading: pricingLoading } = useQuery({
    queryKey: ['current-ticket-pricing', eventId, swigCircuitId],
    queryFn: () => TicketManagementService.getCurrentTicketPrice(eventId, swigCircuitId),
  });

  // Fetch pricing tiers for management
  const { data: pricingTiers, isLoading: tiersLoading } = useQuery({
    queryKey: ['pricing-tiers', eventId, swigCircuitId],
    queryFn: async () => {
      let query = supabase
        .from('ticket_pricing_tiers')
        .select('*')
        .eq('is_active', true);

      if (eventId) {
        query = query.eq('event_id', eventId);
      }
      if (swigCircuitId) {
        query = query.eq('swig_circuit_id', swigCircuitId);
      }

      const { data, error } = await query.order('tier_order');
      
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  // Create pricing tier mutation
  const createTierMutation = useMutation({
    mutationFn: async (tierData: Omit<TicketPricingTier, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from('ticket_pricing_tiers')
        .insert({
          ...tierData,
          sold_quantity: 0,
          tier_order: (pricingTiers?.length || 0) + 1
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Pricing Tier Created",
        description: "New pricing tier has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['pricing-tiers'] });
      queryClient.invalidateQueries({ queryKey: ['current-ticket-pricing'] });
      setShowAddForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error Creating Tier",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  if (pricingLoading || tiersLoading) {
    return <div>Loading pricing information...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pricing Tier Management</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Pricing Tier
        </Button>
      </div>

      {/* Current Pricing Display */}
      {currentPricing && currentPricing.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Pricing</CardTitle>
            <CardDescription>Active pricing information for tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentPricing.map((pricing) => (
                <div key={pricing.tier_id} className="border rounded-lg p-4">
                  <h4 className="font-medium">{pricing.tier_name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-bold">${pricing.current_price}</span>
                    {pricing.base_price !== pricing.current_price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${pricing.base_price}
                      </span>
                    )}
                    {pricing.is_early_bird && (
                      <Badge variant="secondary">Early Bird</Badge>
                    )}
                  </div>
                  {pricing.discount_amount > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ${pricing.discount_amount}
                    </p>
                  )}
                  {pricing.remaining_quantity !== null && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Users className="h-3 w-3" />
                      <span>{pricing.remaining_quantity} remaining</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Tiers Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Pricing Tiers</CardTitle>
          <CardDescription>
            Create and manage different pricing tiers for your event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingTiers?.map((tier) => (
              <div key={tier.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{tier.tier_name}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>${tier.base_price}</span>
                      {tier.max_quantity && (
                        <span>Max: {tier.max_quantity}</span>
                      )}
                      <span>Sold: {tier.sold_quantity}</span>
                      {tier.is_early_bird && (
                        <Badge variant="secondary">Early Bird</Badge>
                      )}
                    </div>
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
                        // Handle delete logic here
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {pricingTiers?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No pricing tiers configured</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create your first pricing tier to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form would go here */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Pricing Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <AddTierForm
              eventId={eventId}
              swigCircuitId={swigCircuitId}
              onSubmit={(data) => createTierMutation.mutate(data)}
              onCancel={() => setShowAddForm(false)}
              isLoading={createTierMutation.isPending}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Simple form component for adding tiers
const AddTierForm: React.FC<{
  eventId?: string;
  swigCircuitId?: string;
  onSubmit: (data: Omit<TicketPricingTier, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  isLoading: boolean;
}> = ({ eventId, swigCircuitId, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    tier_name: '',
    base_price: '',
    max_quantity: '',
    is_early_bird: false,
    early_bird_discount_percentage: '',
    early_bird_end_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tierData: Omit<TicketPricingTier, "id" | "created_at" | "updated_at"> = {
      event_id: eventId || null,
      swig_circuit_id: swigCircuitId || null,
      tier_name: formData.tier_name,
      base_price: parseFloat(formData.base_price),
      tier_order: 1, // Will be updated in mutation
      valid_from: new Date().toISOString(),
      valid_until: null,
      max_quantity: formData.max_quantity ? parseInt(formData.max_quantity) : null,
      sold_quantity: 0,
      is_early_bird: formData.is_early_bird,
      early_bird_discount_percentage: formData.is_early_bird ? parseFloat(formData.early_bird_discount_percentage) : 0,
      early_bird_discount_amount: 0,
      early_bird_end_date: formData.is_early_bird && formData.early_bird_end_date ? formData.early_bird_end_date : null,
      tier_benefits: [],
      is_active: true
    };

    onSubmit(tierData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="tier_name">Tier Name</Label>
        <Input
          id="tier_name"
          value={formData.tier_name}
          onChange={(e) => setFormData(prev => ({ ...prev, tier_name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="base_price">Price ($)</Label>
        <Input
          id="base_price"
          type="number"
          step="0.01"
          value={formData.base_price}
          onChange={(e) => setFormData(prev => ({ ...prev, base_price: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="max_quantity">Maximum Quantity (optional)</Label>
        <Input
          id="max_quantity"
          type="number"
          value={formData.max_quantity}
          onChange={(e) => setFormData(prev => ({ ...prev, max_quantity: e.target.value }))}
        />
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Tier'}
        </Button>
      </div>
    </form>
  );
};

export default PricingTierManager;
