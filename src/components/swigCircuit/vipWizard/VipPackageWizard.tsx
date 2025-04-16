
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useVipPackageWizard } from '@/hooks/useVipPackageWizard';
import { TicketTier } from '@/hooks/swigCircuit/types';
import VipBasicDetailsStep from './steps/VipBasicDetailsStep';
import VipPerksStep from './steps/VipPerksStep';
import VipSummaryStep from './steps/VipSummaryStep';
import VipWizardNavigation from './VipWizardNavigation';

interface VipPackageWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (vipPackage: TicketTier) => void;
  initialPackage?: TicketTier | null;
}

const VipPackageWizard: React.FC<VipPackageWizardProps> = ({
  open,
  onOpenChange,
  onSave,
  initialPackage
}) => {
  const vipWizard = useVipPackageWizard({
    onSave,
    initialPackage
  });

  // Set dialog open state based on props
  React.useEffect(() => {
    if (open && !vipWizard.isWizardOpen) {
      vipWizard.openWizard();
    } else if (!open && vipWizard.isWizardOpen) {
      vipWizard.closeWizard();
    }
  }, [open, vipWizard]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      vipWizard.closeWizard();
    }
    onOpenChange(open);
  };

  const renderStepContent = () => {
    switch (vipWizard.currentStep) {
      case 1:
        return <VipBasicDetailsStep vipWizard={vipWizard} />;
      case 2:
        return <VipPerksStep vipWizard={vipWizard} />;
      case 3:
        return <VipSummaryStep vipWizard={vipWizard} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-600 to-spiritless-pink bg-clip-text text-transparent font-bold">
              VIP Package Wizard
            </span>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">Step {vipWizard.currentStep} of 3</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderStepContent()}
        </div>
        
        <VipWizardNavigation 
          currentStep={vipWizard.currentStep}
          onNext={vipWizard.nextStep}
          onBack={vipWizard.prevStep}
          onComplete={vipWizard.saveVipPackage}
          isFirstBasicStep={vipWizard.currentStep === 1}
          isFinalStep={vipWizard.currentStep === 3}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VipPackageWizard;
