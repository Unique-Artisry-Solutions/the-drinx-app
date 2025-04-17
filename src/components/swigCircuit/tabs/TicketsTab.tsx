
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Ticket, Info, Crown, Edit, AlertCircle, Save, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TicketTier } from '@/hooks/swigCircuit/types';
import { Badge } from '@/components/ui/badge';
import CreateVipPackageButton from '../vipWizard/CreateVipPackageButton';

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
  
  const startEditingBenefit = (tierIndex: number, benefitIndex: number) => {
    setEditingBenefitIndex(benefitIndex);
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

        {ticketTiers.length > 0 && (
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-medium">Current Ticket Tiers</h3>
            <div className="space-y-4">
              {ticketTiers.map((tier, tierIndex) => (
                <div 
                  key={tier.id} 
                  className={`border rounded-md p-4 ${tier.isVip ? 'border-2 border-purple-300 bg-purple-50' : ''} ${editingTier === tierIndex ? 'border-blue-300 bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      {editingTier === tierIndex ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-tier-${tierIndex}-name`}>Tier Name</Label>
                            <Input
                              id={`edit-tier-${tierIndex}-name`}
                              value={newTier.name}
                              onChange={(e) => handleTierFieldChange('name', e.target.value)}
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
                              onChange={(e) => handleTierFieldChange('price', parseFloat(e.target.value) || 0)}
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
                              onChange={(e) => handleTierFieldChange('description', e.target.value)}
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
                              onChange={(e) => handleTierFieldChange('limit', parseInt(e.target.value) || undefined)}
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
                      {editingTier === tierIndex ? (
                        <>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={saveEditedTier}
                              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={cancelEditing}
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
                            onClick={() => startEditingTier(tierIndex)}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => confirmRemoveTier(tierIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Benefits:</h5>
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        {(editingTier === tierIndex) ? (
                          <Input
                            value={newTier.benefits[benefitIndex] || ''}
                            onChange={(e) => handleBenefitChange(e.target.value, benefitIndex)}
                            placeholder="Benefit description"
                            className={`text-sm ${validationErrors.benefits ? "border-red-500" : ""}`}
                          />
                        ) : (
                          <div className="flex-1 border rounded-md px-3 py-2 bg-white text-sm">
                            {benefit}
                          </div>
                        )}
                        
                        {editingTier === tierIndex && !tier.isVip && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeBenefit(benefitIndex)}
                            disabled={newTier.benefits.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {editingTier !== tierIndex && !tier.isVip && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExistingTierBenefit(tierIndex, benefitIndex)}
                            disabled={tier.benefits.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {validationErrors.benefits && editingTier === tierIndex && (
                      <p className="text-sm text-red-500">{validationErrors.benefits}</p>
                    )}
                    
                    {editingTier === tierIndex && !tier.isVip && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addBenefit}
                        className="mt-2 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Benefit
                      </Button>
                    )}
                    
                    {editingTier !== tierIndex && !tier.isVip && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addExistingTierBenefit(tierIndex)}
                        className="mt-2 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Benefit
                      </Button>
                    )}
                  </div>
                  
                  {tier.isVip && editingTier !== tierIndex && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editVipPackage(tier)}
                      className="mt-4 bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300"
                    >
                      <Crown className="h-4 w-4 mr-2" /> Edit VIP Package
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {benefitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{benefitError}</span>
          </div>
        )}

        {editingTier === null && (
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
                    onChange={(e) => handleTierFieldChange('name', e.target.value)}
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
                    onChange={(e) => handleTierFieldChange('price', parseFloat(e.target.value) || 0)}
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
                  onChange={(e) => handleTierFieldChange('description', e.target.value)}
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
                        className={validationErrors.benefits ? "border-red-500" : ""}
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
                  
                  {validationErrors.benefits && (
                    <p className="text-sm text-red-500">{validationErrors.benefits}</p>
                  )}
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
                  onChange={(e) => handleTierFieldChange('limit', parseInt(e.target.value) || undefined)}
                  placeholder="Leave empty for unlimited tickets"
                />
              </div>
              
              <Button
                onClick={handleAddTier}
                disabled={!newTier.name}
                className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Ticket Tier
              </Button>
            </div>
          </div>
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

      {/* Confirmation Dialog for Removing Tiers */}
      <AlertDialog
        open={tierToRemove !== null}
        onOpenChange={(open) => !open && setTierToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this ticket tier? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove} className="bg-red-500 hover:bg-red-600">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TicketsTab;
