
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useVipPackageWizard } from '@/hooks/useVipPackageWizard';
import { TicketTier } from '@/hooks/swigCircuit/types';
import VipBasicDetailsStep from './steps/VipBasicDetailsStep';
import VipPerksStep from './steps/VipPerksStep';
import VipSummaryStep from './steps/VipSummaryStep';
import VipWizardNavigation from './VipWizardNavigation';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <DialogContent className="sm:max-w-2xl sm:max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-600 to-spiritless-pink bg-clip-text text-transparent font-bold">
              VIP Package Wizard
            </span>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">Step {vipWizard.currentStep} of 3</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow overflow-auto py-4">
          <div className="px-1">
            {renderStepContent()}
          </div>
        </ScrollArea>
        
        <div className="flex-shrink-0 pt-4 border-t mt-2">
          <VipWizardNavigation 
            currentStep={vipWizard.currentStep}
            onNext={vipWizard.nextStep}
            onBack={vipWizard.prevStep}
            onComplete={vipWizard.saveVipPackage}
            isFirstBasicStep={vipWizard.currentStep === 1}
            isFinalStep={vipWizard.currentStep === 3}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VipPackageWizard;
