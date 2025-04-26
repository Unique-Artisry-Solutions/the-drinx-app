
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import BasicInfoStep from './BasicInfoStep';
import VenueSelectionStep from './VenueSelectionStep';
import TicketTypesStep from './TicketTypesStep';
import PromotionalMaterialsStep from './PromotionalMaterialsStep';
import NotificationSchedulingStep from './NotificationSchedulingStep';
import { EventWizardProvider, useEventWizard } from './EventWizardContext';
import { useEvents } from '@/hooks/useEvents';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 'basic', label: 'Event Details' },
  { id: 'venue', label: 'Venue Selection' },
  { id: 'tickets', label: 'Ticket Types' },
  { id: 'materials', label: 'Promotional Materials' },
  { id: 'notifications', label: 'Notification Scheduling' }
];

const EventCreationWizardContent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, validateStep } = useEventWizard();
  const { createEvent } = useEvents();
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (validateStep(steps[currentStep].id)) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };
  
  const handleCreateEvent = async () => {
    try {
      await createEvent.mutateAsync(formData);
      navigate('/promoter/events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };
  
  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <VenueSelectionStep />;
      case 2:
        return <TicketTypesStep />;
      case 3:
        return <PromotionalMaterialsStep />;
      case 4:
        return <NotificationSchedulingStep />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Steps progress */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center ${
              index === currentStep
                ? 'text-purple-700'
                : index < currentStep
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === currentStep
                    ? 'bg-purple-100 border-2 border-purple-700'
                    : index < currentStep
                    ? 'bg-green-100 border-2 border-green-600'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-1/2 left-full w-[calc(100%-2rem)] h-0.5 -translate-y-1/2 ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
            <span className="mt-2 text-xs font-medium hidden md:block">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="py-4">{getStepContent()}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button type="button" onClick={handleNext}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={handleCreateEvent}
            disabled={createEvent.isPending}
          >
            {createEvent.isPending ? 'Creating...' : 'Create Event'}
          </Button>
        )}
      </div>
    </div>
  );
};

const EventCreationWizard: React.FC = () => {
  return (
    <EventWizardProvider>
      <EventCreationWizardContent />
    </EventWizardProvider>
  );
};

export default EventCreationWizard;
