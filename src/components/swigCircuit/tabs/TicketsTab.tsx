import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Ticket, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TicketTier } from '@/hooks/swigCircuit/types';
import { Badge } from '@/components/ui/badge';

interface TicketsTabProps {
  ticketTiers: TicketTier[];
  setTicketTiers: (tiers: TicketTier[]) => void;
  addTicketTier: (tier: TicketTier) => void;
  updateTicketTier: (index: number, tier: TicketTier) => void;
  removeTicketTier: (index: number) => void;
  onBack: () => void;
  onContinue: () => void;
}

const emptyTier: TicketTier = {
  id: '',
  name: '',
  price: 0,
  description: '',
  benefits: [''],
};

const TicketsTab: React.FC<TicketsTabProps> = ({
  ticketTiers,
  addTicketTier,
  updateTicketTier,
  removeTicketTier,
  onBack,
  onContinue,
}) => {
  const [newTier, setNewTier] = useState<TicketTier>(emptyTier);

  const handleAddTier = () => {
    if (!newTier.name || newTier.price <= 0) return;
    
    addTicketTier(newTier);
    setNewTier(emptyTier);
  };

  const handleBenefitChange = (value: string, index: number) => {
    const updatedBenefits = [...newTier.benefits];
    updatedBenefits[index] = value;
    setNewTier({ ...newTier, benefits: updatedBenefits });
  };

  const addBenefit = () => {
    setNewTier({
      ...newTier,
      benefits: [...newTier.benefits, '']
    });
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = [...newTier.benefits];
    updatedBenefits.splice(index, 1);
    setNewTier({ ...newTier, benefits: updatedBenefits });
  };

  const updateExistingTierBenefit = (tierIndex: number, benefitIndex: number, value: string) => {
    const tier = ticketTiers[tierIndex];
    const updatedBenefits = [...tier.benefits];
    updatedBenefits[benefitIndex] = value;
    
    updateTicketTier(tierIndex, {
      ...tier,
      benefits: updatedBenefits
    });
  };

  const addExistingTierBenefit = (tierIndex: number) => {
    const tier = ticketTiers[tierIndex];
    updateTicketTier(tierIndex, {
      ...tier,
      benefits: [...tier.benefits, '']
    });
  };

  const removeExistingTierBenefit = (tierIndex: number, benefitIndex: number) => {
    const tier = ticketTiers[tierIndex];
    const updatedBenefits = [...tier.benefits];
    updatedBenefits.splice(benefitIndex, 1);
    
    updateTicketTier(tierIndex, {
      ...tier,
      benefits: updatedBenefits
    });
  };
  
  return (
    <Card className="p-6 w-full">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Ticket className="w-5 h-5 text-spiritless-pink" />
          <h2 className="text-2xl font-bold">Ticket Tiers</h2>
        </div>
        
        <div className="text-sm text-muted-foreground mb-6">
          Configure different ticket options for your Swig Circuit. Set prices, descriptions, and benefits for each tier.
        </div>

        {/* Existing ticket tiers */}
        {ticketTiers.length > 0 && (
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-medium">Current Ticket Tiers</h3>
            <div className="space-y-4">
              {ticketTiers.map((tier, tierIndex) => (
                <div key={tier.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{tier.name}</h4>
                      <div className="text-sm text-muted-foreground">{tier.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        ${tier.price.toFixed(2)}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeTicketTier(tierIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Benefits:</h5>
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => updateExistingTierBenefit(tierIndex, benefitIndex, e.target.value)}
                          placeholder="Benefit description"
                          className="text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExistingTierBenefit(tierIndex, benefitIndex)}
                          disabled={tier.benefits.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addExistingTierBenefit(tierIndex)}
                      className="mt-2 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Benefit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add new ticket tier form */}
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-medium mb-4">Add New Ticket Tier</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tierName">Tier Name</Label>
                <Input
                  id="tierName"
                  value={newTier.name}
                  onChange={(e) => setNewTier({ ...newTier, name: e.target.value })}
                  placeholder="VIP, Early Bird, etc."
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="tierPrice">Price ($)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Set the price for this ticket tier</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="tierPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newTier.price}
                  onChange={(e) => setNewTier({ ...newTier, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tierDescription">Description</Label>
              <Textarea
                id="tierDescription"
                value={newTier.description}
                onChange={(e) => setNewTier({ ...newTier, description: e.target.value })}
                placeholder="Describe what's included in this ticket tier"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Benefits</Label>
              </div>
              
              <div className="space-y-3">
                {newTier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={benefit}
                      onChange={(e) => handleBenefitChange(e.target.value, index)}
                      placeholder="e.g., Priority entry, Free welcome drink"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                      disabled={newTier.benefits.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={addBenefit}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Benefit
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tierLimit">Ticket Limit (Optional)</Label>
              <Input
                id="tierLimit"
                type="number"
                min="0"
                value={newTier.limit || ''}
                onChange={(e) => setNewTier({ ...newTier, limit: parseInt(e.target.value) || undefined })}
                placeholder="Leave empty for unlimited tickets"
              />
            </div>
            
            <Button
              onClick={handleAddTier}
              disabled={!newTier.name || newTier.price <= 0}
              className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Ticket Tier
            </Button>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            onClick={onContinue}
            disabled={ticketTiers.length === 0}
          >
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TicketsTab;
