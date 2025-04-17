
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, AlertCircle } from 'lucide-react';
import { TicketTier } from '@/hooks/swigCircuit/types';
import { Badge } from '@/components/ui/badge';
import CreateVipPackageButton from '../vipWizard/CreateVipPackageButton';
import TicketTiersList from '../tickets/TicketTiersList';
import AddTicketTierForm from '../tickets/AddTicketTierForm';

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
  const [editingVipPackage, setEditingVipPackage] = useState<TicketTier | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [benefitError, setBenefitError] = useState<string | null>(null);
  const [tierToRemove, setTierToRemove] = useState<number | null>(null);
  const [editingTier, setEditingTier] = useState<number | null>(null);
  const [editingBenefitIndex, setEditingBenefitIndex] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateTier = (tier: TicketTier): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!tier.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (tier.price < 0) {
      errors.price = "Price cannot be negative";
    }
    
    if (tier.benefits.some(benefit => !benefit.trim())) {
      errors.benefits = "All benefits must have content";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddTier = () => {
    if (!validateTier(newTier)) return;
    
    // Filter out any empty benefits
    const filteredBenefits = newTier.benefits.filter(benefit => benefit.trim());
    const tierToAdd = {...newTier, benefits: filteredBenefits};
    
    addTicketTier(tierToAdd);
    setNewTier(emptyTier);
    setBenefitError(null);
    setValidationErrors({});
  };

  const handleSaveVipPackage = (vipPackage: TicketTier) => {
    const existingVipIndex = ticketTiers.findIndex(tier => tier.isVip && tier.id === vipPackage.id);
    
    if (existingVipIndex >= 0) {
      updateTicketTier(existingVipIndex, vipPackage);
    } else {
      addTicketTier(vipPackage);
    }
    
    setEditingVipPackage(null);
  };

  const handleBenefitChange = (value: string, index: number) => {
    const updatedBenefits = [...newTier.benefits];
    updatedBenefits[index] = value;
    setNewTier({ ...newTier, benefits: updatedBenefits });
    
    // Clear any error when user starts typing
    if (benefitError) setBenefitError(null);
    if (validationErrors.benefits) {
      const { benefits, ...rest } = validationErrors;
      setValidationErrors(rest);
    }
  };

  const addBenefit = () => {
    // Only add new benefit if last one is not empty
    const lastBenefit = newTier.benefits[newTier.benefits.length - 1];
    if (!lastBenefit.trim()) {
      setBenefitError("Please fill in the current benefit before adding a new one");
      return;
    }
    
    setNewTier({
      ...newTier,
      benefits: [...newTier.benefits, '']
    });
    setBenefitError(null);
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = [...newTier.benefits];
    updatedBenefits.splice(index, 1);
    setNewTier({ ...newTier, benefits: updatedBenefits });
    setBenefitError(null);
  };

  const updateExistingTierBenefit = (tierIndex: number, benefitIndex: number, value: string) => {
    const tier = ticketTiers[tierIndex];
    const updatedBenefits = [...tier.benefits];
    updatedBenefits[benefitIndex] = value;
    
    updateTicketTier(tierIndex, {
      ...tier,
      benefits: updatedBenefits
    });
    
    setEditingBenefitIndex(null);
  };

  const addExistingTierBenefit = (tierIndex: number) => {
    const tier = ticketTiers[tierIndex];
    
    // Check if the last benefit is empty
    const lastBenefit = tier.benefits[tier.benefits.length - 1];
    if (!lastBenefit || !lastBenefit.trim()) {
      setBenefitError("Please fill in the current benefit before adding a new one");
      return;
    }
    
    updateTicketTier(tierIndex, {
      ...tier,
      benefits: [...tier.benefits, '']
    });
    setBenefitError(null);
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

  const editVipPackage = (tier: TicketTier) => {
    setEditingVipPackage(tier);
    setIsWizardOpen(true);
  };

  const confirmRemoveTier = (index: number) => {
    setTierToRemove(index);
  };

  const handleConfirmRemove = () => {
    if (tierToRemove !== null) {
      removeTicketTier(tierToRemove);
      setTierToRemove(null);
    }
  };

  const startEditingTier = (index: number) => {
    // Don't allow editing VIP packages through regular editing
    if (ticketTiers[index].isVip) {
      editVipPackage(ticketTiers[index]);
      return;
    }
    
    setEditingTier(index);
    setNewTier({...ticketTiers[index]});
    setValidationErrors({});
  };

  const saveEditedTier = () => {
    if (editingTier === null) return;
    
    if (!validateTier(newTier)) return;
    
    // Filter out any empty benefits
    const filteredBenefits = newTier.benefits.filter(benefit => benefit.trim());
    const updatedTier = {...newTier, benefits: filteredBenefits};
    
    updateTicketTier(editingTier, updatedTier);
    setEditingTier(null);
    setNewTier(emptyTier);
    setBenefitError(null);
    setValidationErrors({});
  };

  const cancelEditing = () => {
    setEditingTier(null);
    setNewTier(emptyTier);
    setBenefitError(null);
    setValidationErrors({});
  };

  const handleTierFieldChange = (field: keyof TicketTier, value: any) => {
    setNewTier({ ...newTier, [field]: value });
    
    // Clear field-specific validation error
    if (validationErrors[field]) {
      const { [field]: _, ...rest } = validationErrors;
      setValidationErrors(rest);
    }
  };
  
  const handleCloseRemoveDialog = () => {
    setTierToRemove(null);
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

        <div className="flex justify-center my-6">
          <CreateVipPackageButton 
            onSaveVipPackage={handleSaveVipPackage} 
            initialPackage={editingVipPackage}
            isOpen={isWizardOpen}
            onOpenChange={setIsWizardOpen}
          />
        </div>

        <TicketTiersList 
          ticketTiers={ticketTiers}
          editingTier={editingTier}
          newTier={newTier}
          validationErrors={validationErrors}
          benefitError={benefitError}
          tierToRemove={tierToRemove}
          onEditTier={startEditingTier}
          onRemoveTier={confirmRemoveTier}
          onSaveEditedTier={saveEditedTier}
          onCancelEditing={cancelEditing}
          onTierFieldChange={handleTierFieldChange}
          onBenefitChange={handleBenefitChange}
          onAddBenefit={addBenefit}
          onRemoveBenefit={removeBenefit}
          onAddExistingTierBenefit={addExistingTierBenefit}
          onRemoveExistingTierBenefit={removeExistingTierBenefit}
          onEditVipPackage={editVipPackage}
          onConfirmRemoveTier={handleConfirmRemove}
          onCloseRemoveDialog={handleCloseRemoveDialog}
        />

        {benefitError && editingTier === null && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{benefitError}</span>
          </div>
        )}

        {editingTier === null && (
          <AddTicketTierForm
            newTier={newTier}
            validationErrors={validationErrors}
            benefitError={benefitError}
            onTierFieldChange={handleTierFieldChange}
            onBenefitChange={handleBenefitChange}
            onAddBenefit={addBenefit}
            onRemoveBenefit={removeBenefit}
            onAddTier={handleAddTier}
          />
        )}

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
