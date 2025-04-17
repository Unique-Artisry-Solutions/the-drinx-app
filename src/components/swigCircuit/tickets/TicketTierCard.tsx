
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit, Save, X, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TicketTier } from '@/hooks/swigCircuit/types';

interface TicketTierCardProps {
  tier: TicketTier;
  tierIndex: number;
  editingTier: number | null;
  newTier: TicketTier;
  validationErrors: { [key: string]: string };
  benefitError: string | null;
  onEditTier: (index: number) => void;
  onRemoveTier: (index: number) => void;
  onSaveEditedTier: () => void;
  onCancelEditing: () => void;
  onTierFieldChange: (field: keyof TicketTier, value: any) => void;
  onBenefitChange: (value: string, index: number) => void;
  onAddBenefit: () => void;
  onRemoveBenefit: (index: number) => void;
  onAddExistingTierBenefit: (tierIndex: number) => void;
  onRemoveExistingTierBenefit: (tierIndex: number, benefitIndex: number) => void;
  onEditVipPackage: (tier: TicketTier) => void;
}

const TicketTierCard: React.FC<TicketTierCardProps> = ({
  tier,
  tierIndex,
  editingTier,
  newTier,
  validationErrors,
  benefitError,
  onEditTier,
  onRemoveTier,
  onSaveEditedTier,
  onCancelEditing,
  onTierFieldChange,
  onBenefitChange,
  onAddBenefit,
  onRemoveBenefit,
  onAddExistingTierBenefit,
  onRemoveExistingTierBenefit,
  onEditVipPackage
}) => {
  const isEditing = editingTier === tierIndex;

  return (
    <div 
      className={`border rounded-md p-4 ${tier.isVip ? 'border-2 border-purple-300 bg-purple-50' : ''} ${isEditing ? 'border-blue-300 bg-blue-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-tier-${tierIndex}-name`}>Tier Name</Label>
                <Input
                  id={`edit-tier-${tierIndex}-name`}
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
                <Label htmlFor={`edit-tier-${tierIndex}-price`}>Price ($)</Label>
                <Input
                  id={`edit-tier-${tierIndex}-price`}
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
              
              <div className="space-y-2">
                <Label htmlFor={`edit-tier-${tierIndex}-description`}>Description</Label>
                <Textarea
                  id={`edit-tier-${tierIndex}-description`}
                  value={newTier.description}
                  onChange={(e) => onTierFieldChange('description', e.target.value)}
                  placeholder="Describe what's included in this ticket tier"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`edit-tier-${tierIndex}-limit`}>Ticket Limit (Optional)</Label>
                <Input
                  id={`edit-tier-${tierIndex}-limit`}
                  type="number"
                  min="0"
                  value={newTier.limit || ''}
                  onChange={(e) => onTierFieldChange('limit', parseInt(e.target.value) || undefined)}
                  placeholder="Leave empty for unlimited tickets"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center">
                <h4 className="font-medium">{tier.name}</h4>
                {tier.isVip && (
                  <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700 border-purple-200">
                    <Crown className="h-3 w-3 mr-1" />
                    VIP
                  </Badge>
                )}
                {tier.price === 0 && (
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 border-green-200">
                    Free
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{tier.description}</div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onSaveEditedTier}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onCancelEditing}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <Badge variant="outline" className={
                tier.isVip ? "bg-purple-100 text-purple-700" : 
                tier.price === 0 ? "bg-green-50 text-green-700" : 
                "bg-blue-50 text-blue-700"
              }>
                {tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}`}
              </Badge>
              {tier.limit && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Limit: {tier.limit}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEditTier(tierIndex)}
              >
                <Edit className="h-4 w-4 text-blue-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onRemoveTier(tierIndex)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <BenefitsList 
        tier={tier}
        tierIndex={tierIndex}
        isEditing={isEditing}
        newTier={newTier}
        validationErrors={validationErrors}
        onBenefitChange={onBenefitChange}
        onRemoveBenefit={onRemoveBenefit}
        onAddBenefit={onAddBenefit}
        onRemoveExistingTierBenefit={onRemoveExistingTierBenefit}
        onAddExistingTierBenefit={onAddExistingTierBenefit}
      />
      
      {tier.isVip && !isEditing && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditVipPackage(tier)}
          className="mt-4 bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300"
        >
          <Crown className="h-4 w-4 mr-2" /> Edit VIP Package
        </Button>
      )}
    </div>
  );
};

interface BenefitsListProps {
  tier: TicketTier;
  tierIndex: number;
  isEditing: boolean;
  newTier: TicketTier;
  validationErrors: { [key: string]: string };
  onBenefitChange: (value: string, index: number) => void;
  onRemoveBenefit: (index: number) => void;
  onAddBenefit: () => void;
  onRemoveExistingTierBenefit: (tierIndex: number, benefitIndex: number) => void;
  onAddExistingTierBenefit: (tierIndex: number) => void;
}

const BenefitsList: React.FC<BenefitsListProps> = ({
  tier,
  tierIndex,
  isEditing,
  newTier,
  validationErrors,
  onBenefitChange,
  onRemoveBenefit,
  onAddBenefit,
  onRemoveExistingTierBenefit,
  onAddExistingTierBenefit
}) => {
  return (
    <div className="space-y-3">
      <h5 className="text-sm font-medium">Benefits:</h5>
      {tier.benefits.map((benefit, benefitIndex) => (
        <div key={benefitIndex} className="flex items-center gap-2">
          {isEditing ? (
            <Input
              value={newTier.benefits[benefitIndex] || ''}
              onChange={(e) => onBenefitChange(e.target.value, benefitIndex)}
              placeholder="Benefit description"
              className={`text-sm ${validationErrors.benefits ? "border-red-500" : ""}`}
            />
          ) : (
            <div className="flex-1 border rounded-md px-3 py-2 bg-white text-sm">
              {benefit}
            </div>
          )}
          
          {isEditing && !tier.isVip && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveBenefit(benefitIndex)}
              disabled={newTier.benefits.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          {!isEditing && !tier.isVip && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveExistingTierBenefit(tierIndex, benefitIndex)}
              disabled={tier.benefits.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      
      {validationErrors.benefits && isEditing && (
        <p className="text-sm text-red-500">{validationErrors.benefits}</p>
      )}
      
      {isEditing && !tier.isVip && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddBenefit}
          className="mt-2 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Benefit
        </Button>
      )}
      
      {!isEditing && !tier.isVip && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddExistingTierBenefit(tierIndex)}
          className="mt-2 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Benefit
        </Button>
      )}
    </div>
  );
};

export default TicketTierCard;
