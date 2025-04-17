
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Info } from 'lucide-react';
import { TicketTier } from '@/hooks/swigCircuit/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AddTicketTierFormProps {
  newTier: TicketTier;
  validationErrors: { [key: string]: string };
  benefitError: string | null;
  onTierFieldChange: (field: keyof TicketTier, value: any) => void;
  onBenefitChange: (value: string, index: number) => void;
  onAddBenefit: () => void;
  onRemoveBenefit: (index: number) => void;
  onAddTier: () => void;
}

const AddTicketTierForm: React.FC<AddTicketTierFormProps> = ({
  newTier,
  validationErrors,
  benefitError,
  onTierFieldChange,
  onBenefitChange,
  onAddBenefit,
  onRemoveBenefit,
  onAddTier
}) => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium mb-4">
        Add Standard Ticket Tier
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tierName">Tier Name</Label>
            <Input
              id="tierName"
              value={newTier.name}
              onChange={(e) => onTierFieldChange('name', e.target.value)}
              placeholder="General Admission, Early Bird, etc."
              className={validationErrors.name ? "border-red-500" : ""}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name}</p>
            )}
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
                    <p>Set the price for this ticket tier. Use 0 for free tickets.</p>
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
              onChange={(e) => onTierFieldChange('price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={validationErrors.price ? "border-red-500" : ""}
            />
            {validationErrors.price && (
              <p className="text-sm text-red-500">{validationErrors.price}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tierDescription">Description</Label>
          <Textarea
            id="tierDescription"
            value={newTier.description}
            onChange={(e) => onTierFieldChange('description', e.target.value)}
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
                  onChange={(e) => onBenefitChange(e.target.value, index)}
                  placeholder="e.g., Priority entry, Free welcome drink"
                  className={validationErrors.benefits ? "border-red-500" : ""}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveBenefit(index)}
                  disabled={newTier.benefits.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {validationErrors.benefits && (
              <p className="text-sm text-red-500">{validationErrors.benefits}</p>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onAddBenefit}
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
            onChange={(e) => onTierFieldChange('limit', parseInt(e.target.value) || undefined)}
            placeholder="Leave empty for unlimited tickets"
          />
        </div>
        
        <Button
          onClick={onAddTier}
          disabled={!newTier.name}
          className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Ticket Tier
        </Button>
      </div>
    </div>
  );
};

export default AddTicketTierForm;
