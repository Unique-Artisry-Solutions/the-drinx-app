
import React from 'react';
import { TicketTier } from '@/hooks/swigCircuit/types';
import { AlertCircle } from 'lucide-react';
import TicketTierCard from './TicketTierCard';
import RemoveTierConfirmDialog from './RemoveTierConfirmDialog';

interface TicketTiersListProps {
  ticketTiers: TicketTier[];
  editingTier: number | null;
  newTier: TicketTier;
  validationErrors: { [key: string]: string };
  benefitError: string | null;
  tierToRemove: number | null;
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
  onConfirmRemoveTier: () => void;
  onCloseRemoveDialog: () => void;
}

const TicketTiersList: React.FC<TicketTiersListProps> = ({
  ticketTiers,
  editingTier,
  newTier,
  validationErrors,
  benefitError,
  tierToRemove,
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
  onEditVipPackage,
  onConfirmRemoveTier,
  onCloseRemoveDialog
}) => {
  if (ticketTiers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 mb-8">
      <h3 className="text-lg font-medium">Current Ticket Tiers</h3>
      
      {benefitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{benefitError}</span>
        </div>
      )}
      
      <div className="space-y-4">
        {ticketTiers.map((tier, tierIndex) => (
          <TicketTierCard
            key={tier.id}
            tier={tier}
            tierIndex={tierIndex}
            editingTier={editingTier}
            newTier={newTier}
            validationErrors={validationErrors}
            benefitError={benefitError}
            onEditTier={onEditTier}
            onRemoveTier={onRemoveTier}
            onSaveEditedTier={onSaveEditedTier}
            onCancelEditing={onCancelEditing}
            onTierFieldChange={onTierFieldChange}
            onBenefitChange={onBenefitChange}
            onAddBenefit={onAddBenefit}
            onRemoveBenefit={onRemoveBenefit}
            onAddExistingTierBenefit={onAddExistingTierBenefit}
            onRemoveExistingTierBenefit={onRemoveExistingTierBenefit}
            onEditVipPackage={onEditVipPackage}
          />
        ))}
      </div>
      
      <RemoveTierConfirmDialog 
        isOpen={tierToRemove !== null}
        onClose={onCloseRemoveDialog}
        onConfirm={onConfirmRemoveTier}
        tier={tierToRemove !== null ? ticketTiers[tierToRemove] : undefined}
      />
    </div>
  );
};

export default TicketTiersList;
