
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface VipWizardNavigationProps {
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  isFirstBasicStep: boolean;
  isFinalStep: boolean;
}

const VipWizardNavigation: React.FC<VipWizardNavigationProps> = ({
  currentStep,
  onNext,
  onBack,
  onComplete,
  isFirstBasicStep,
  isFinalStep
}) => {
  return (
    <div className="flex justify-between w-full">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstBasicStep}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      {isFinalStep ? (
        <Button
          onClick={onComplete}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Check className="mr-2 h-4 w-4" />
          Complete
        </Button>
      ) : (
        <Button onClick={onNext}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default VipWizardNavigation;
