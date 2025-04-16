
import { useState, useCallback } from 'react';
import { TicketTier } from '@/hooks/swigCircuit/types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface UseVipPackageWizardOptions {
  onSave: (vipPackage: TicketTier) => void;
  initialPackage?: TicketTier | null;
}

export const useVipPackageWizard = (options: UseVipPackageWizardOptions) => {
  const { onSave, initialPackage } = options;
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // Basic details
  const [name, setName] = useState(initialPackage?.name || 'VIP Experience');
  const [price, setPrice] = useState(initialPackage?.price || 75);
  const [description, setDescription] = useState(
    initialPackage?.description || 'Premium access and exclusive perks for your Swig Circuit experience.'
  );
  const [limit, setLimit] = useState(initialPackage?.limit || 10);
  
  // VIP perks
  const [skipLines, setSkipLines] = useState(initialPackage?.vipPerks?.skipLines || false);
  const [prioritySeating, setPrioritySeating] = useState(initialPackage?.vipPerks?.prioritySeating || false);
  const [freeDrinks, setFreeDrinks] = useState(initialPackage?.vipPerks?.freeDrinks || 2);
  const [exclusiveAccess, setExclusiveAccess] = useState(initialPackage?.vipPerks?.exclusiveAccess || false);
  const [merchandise, setMerchandise] = useState(initialPackage?.vipPerks?.merchandise || false);
  const [meetAndGreet, setMeetAndGreet] = useState(initialPackage?.vipPerks?.meetAndGreet || false);
  const [customPerks, setCustomPerks] = useState<string[]>(initialPackage?.vipPerks?.customPerks || []);
  
  // Benefits array is derived from the perks
  const [additionalBenefits, setAdditionalBenefits] = useState<string[]>(
    initialPackage?.benefits.filter(benefit => 
      !benefit.includes('Skip lines') &&
      !benefit.includes('Priority seating') &&
      !benefit.includes('Free drinks') &&
      !benefit.includes('Exclusive access') &&
      !benefit.includes('Merchandise') &&
      !benefit.includes('Meet and greet')
    ) || []
  );
  
  const openWizard = useCallback(() => {
    setIsWizardOpen(true);
    setCurrentStep(1);
  }, []);
  
  const closeWizard = useCallback(() => {
    setIsWizardOpen(false);
  }, []);
  
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  }, []);
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);
  
  const addCustomPerk = useCallback((perk: string) => {
    setCustomPerks(prev => [...prev, perk]);
  }, []);
  
  const removeCustomPerk = useCallback((index: number) => {
    setCustomPerks(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const addAdditionalBenefit = useCallback((benefit: string) => {
    setAdditionalBenefits(prev => [...prev, benefit]);
  }, []);
  
  const removeAdditionalBenefit = useCallback((index: number) => {
    setAdditionalBenefits(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const generateBenefits = useCallback((): string[] => {
    const benefits: string[] = [...additionalBenefits];
    
    if (skipLines) benefits.push('Skip lines at all venues');
    if (prioritySeating) benefits.push('Priority seating at all establishments');
    if (freeDrinks > 0) benefits.push(`${freeDrinks} complimentary signature drinks`);
    if (exclusiveAccess) benefits.push('Exclusive access to VIP areas');
    if (merchandise) benefits.push('Exclusive Swig Circuit merchandise');
    if (meetAndGreet) benefits.push('Meet and greet with venue owners');
    
    // Add custom perks
    customPerks.forEach(perk => {
      benefits.push(perk);
    });
    
    return benefits;
  }, [
    additionalBenefits, skipLines, prioritySeating, freeDrinks, 
    exclusiveAccess, merchandise, meetAndGreet, customPerks
  ]);
  
  const saveVipPackage = useCallback(() => {
    if (!name || price <= 0) {
      toast({
        title: "Cannot save VIP package",
        description: "Please provide a name and valid price for the VIP package",
        variant: "destructive"
      });
      return;
    }
    
    const vipPackage: TicketTier = {
      id: initialPackage?.id || uuidv4(),
      name,
      price,
      description,
      limit,
      benefits: generateBenefits(),
      isVip: true,
      vipPerks: {
        skipLines,
        prioritySeating,
        freeDrinks,
        exclusiveAccess,
        merchandise,
        meetAndGreet,
        customPerks,
      }
    };
    
    onSave(vipPackage);
    closeWizard();
    
    toast({
      title: "VIP package created",
      description: `${name} VIP package has been added to your ticket tiers`,
    });
  }, [
    name, price, description, limit, generateBenefits, 
    skipLines, prioritySeating, freeDrinks, exclusiveAccess, 
    merchandise, meetAndGreet, customPerks, initialPackage?.id,
    onSave, closeWizard, toast
  ]);
  
  return {
    isWizardOpen,
    currentStep,
    openWizard,
    closeWizard,
    nextStep,
    prevStep,
    // Basic details
    name,
    setName,
    price,
    setPrice,
    description,
    setDescription,
    limit,
    setLimit,
    // VIP perks
    skipLines,
    setSkipLines,
    prioritySeating,
    setPrioritySeating,
    freeDrinks,
    setFreeDrinks,
    exclusiveAccess,
    setExclusiveAccess,
    merchandise,
    setMerchandise,
    meetAndGreet,
    setMeetAndGreet,
    customPerks,
    addCustomPerk,
    removeCustomPerk,
    // Additional benefits
    additionalBenefits,
    addAdditionalBenefit,
    removeAdditionalBenefit,
    // Actions
    saveVipPackage,
    generateBenefits
  };
};
