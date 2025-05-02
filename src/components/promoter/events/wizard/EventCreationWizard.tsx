
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEventMutations } from '@/hooks/events/useEventMutations';

// Import steps
import BasicInfoStep from './BasicInfoStep';
import VenueSelectionStep from './VenueSelectionStep';
import TicketingStep from './TicketingStep';
import MediaStep from './MediaStep';
import MarketingStep from './MarketingStep';
import PreviewStep from './PreviewStep';
import { EventWizardProvider, useEventWizard } from './EventWizardContext';
import { EventFormData } from '@/types/EventTypes';

const steps = [
  { id: 'basic-info', title: 'Event Info' },
  { id: 'venue', title: 'Venue' },
  { id: 'ticketing', title: 'Ticketing' },
  { id: 'media', title: 'Media' },
  { id: 'marketing', title: 'Marketing' },
  { id: 'preview', title: 'Preview' }
];

// This is a separate component for the form content so we can use the useEventWizard hook
const EventWizardContent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createEvent } = useEventMutations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData } = useEventWizard();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createEvent.mutateAsync(formData);
      toast({
        title: "Event created!",
        description: "Your event has been created successfully.",
      });
      navigate('/promoter/events');
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast({
        title: "Error creating event",
        description: error.message || "There was an error creating your event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step navigation */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${
              index <= currentStep ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                index <= currentStep ? 'bg-purple-100 text-purple-600 border-2 border-purple-600' : 'bg-gray-100 text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm hidden md:block">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Current step content */}
      <div className="p-2">
        {currentStep === 0 && <BasicInfoStep />}
        {currentStep === 1 && <VenueSelectionStep />}
        {currentStep === 2 && <TicketingStep />}
        {currentStep === 3 && <MediaStep />}
        {currentStep === 4 && <MarketingStep />}
        {currentStep === 5 && <PreviewStep />}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

// Main component that just wraps the content with the provider
const EventCreationWizard = () => {
  return (
    <EventWizardProvider>
      <EventWizardContent />
    </EventWizardProvider>
  );
};

export default EventCreationWizard;
