
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEventWizard } from './EventWizardContext';

interface WizardStepProps {
  steps: string[];
}

const WizardSteps: React.FC<WizardStepProps> = ({ steps }) => {
  const { currentStep, goToStep } = useEventWizard();

  return (
    <div className="w-full py-4">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <li key={index} className={cn(
            "flex items-center",
            index < steps.length - 1 ? "w-full" : ""
          )}>
            <button 
              onClick={() => goToStep(index)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-sm font-medium border",
                currentStep > index 
                  ? "bg-purple-600 text-white border-purple-600" 
                  : currentStep === index
                  ? "bg-purple-100 text-purple-600 border-purple-300"
                  : "bg-gray-100 text-gray-500 border-gray-300"
              )}
            >
              {currentStep > index ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </button>
            
            <span className={cn(
              "ml-2 text-sm font-medium hidden sm:inline-block",
              currentStep === index ? "text-purple-600" : "text-gray-500"
            )}>
              {step}
            </span>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4",
                currentStep > index ? "bg-purple-600" : "bg-gray-200"
              )}></div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default WizardSteps;
