
import React from 'react';
import { Button } from '@/components/ui/button';
import { useEventWizard } from './EventWizardContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WizardNavigationProps {
  steps: number;
  onSubmit: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({ steps, onSubmit }) => {
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

  return (
    <div className="flex justify-between pt-6 border-t">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={currentStep === 0}
        className={currentStep === 0 ? 'invisible' : ''}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      {currentStep < steps - 1 ? (
        <Button onClick={handleNext}>
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
          Create Event
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;
