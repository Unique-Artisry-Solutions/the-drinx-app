
import React from 'react';
import { Button } from '@/components/ui/button';
import { useEventWizard } from './EventWizardContext';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WizardNavigationProps {
  steps: number;
  onSubmit: () => void;
  isSubmitting?: boolean;
  onSaveAndExit?: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({ 
  steps, 
  onSubmit, 
  isSubmitting = false,
  onSaveAndExit
}) => {
  const { currentStep, nextStep, prevStep, formData } = useEventWizard();
  const { toast } = useToast();
  
  const validateStep = (): boolean => {
    // Basic validation for each step
    switch (currentStep) {
      case 0: // Basic Details
        if (!formData.name || !formData.date || !formData.time) {
          toast({
            title: "Required fields missing",
            description: "Please fill in all required fields before continuing.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 1: // Venue Selection
        if (!formData.venueId) {
          toast({
            title: "No venue selected",
            description: "Please select a venue for your event.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2: // Ticketing
        if (formData.ticketTypes.length === 0) {
          toast({
            title: "No ticket types",
            description: "Please add at least one ticket type.",
            variant: "destructive"
          });
          return false;
        }
        break;
      // Media step doesn't require validation
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onSubmit();
    }
  };

  const handleSaveAndExit = () => {
    if (validateStep() && onSaveAndExit) {
      onSaveAndExit();
    }
  };

  return (
    <div className="flex justify-between pt-6 border-t">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 0 || isSubmitting}
        className={currentStep === 0 ? 'invisible' : ''}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <div className="flex gap-2">
        {/* Save and Exit button - only shown if onSaveAndExit is provided */}
        {onSaveAndExit && (
          <Button 
            onClick={handleSaveAndExit}
            variant="secondary"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            Save and Exit
          </Button>
        )}
        
        {currentStep < steps - 1 ? (
          <Button 
            onClick={handleNext}
            disabled={isSubmitting}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            className="bg-purple-600 hover:bg-purple-700" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;
