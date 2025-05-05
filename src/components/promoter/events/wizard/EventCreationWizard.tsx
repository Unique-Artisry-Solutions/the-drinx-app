
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight, Loader2, Save } from 'lucide-react';
import BasicInfoStep from './BasicInfoStep';
import VenueSelectionStep from './VenueSelectionStep';
import TicketTypesStep from './TicketTypesStep';
import PromotionalMaterialsStep from './PromotionalMaterialsStep';
import NotificationSchedulingStep from './NotificationSchedulingStep';
import { EventWizardProvider, useEventWizard } from './EventWizardContext';
import { useEventMutations } from '@/hooks/events/useEventMutations';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toast/toastAdapter';
import { supabase } from '@/integrations/supabase/client';

const steps = [
  { id: 'basic', label: 'Event Details' },
  { id: 'venue', label: 'Venue Selection' },
  { id: 'tickets', label: 'Ticket Types' },
  { id: 'materials', label: 'Promotional Materials' },
  { id: 'notifications', label: 'Notification Scheduling' }
];

const EventCreationWizardContent: React.FC = () => {
  const { formData, validateStep, isEditMode, isLoading } = useEventWizard();
  const [currentStep, setCurrentStep] = useState(0);
  const { createEvent, updateEvent } = useEventMutations();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleNext = () => {
    if (validateStep(steps[currentStep].id)) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };
  
  const handleSaveEvent = async (navigateAfterSave = true) => {
    // First validate the current step
    if (!validateStep(steps[currentStep].id)) {
      return;
    }

    try {
      setIsSaving(true);
      
      // Create a copy of the form data without notifications if needed
      const eventData = {
        ...formData,
        // Remove notifications if they're not properly formed
        notificationSchedules: formData.notificationSchedules?.filter(n => 
          n.title && n.content && n.scheduledFor
        )
      };
      
      if (isEditMode) {
        await updateEvent.mutateAsync(eventData);
        showToast(
          'Event Updated',
          'Your changes have been saved successfully.',
          navigateAfterSave ? {
            label: 'View Event',
            onClick: () => navigate(`/promoter/events/${eventData.id}`)
          } : undefined
        );
      } else {
        await createEvent.mutateAsync(eventData);
        showToast(
          'Event Created',
          'Your event has been created successfully.',
          navigateAfterSave ? {
            label: 'View Events',
            onClick: () => navigate('/promoter/events')
          } : undefined
        );
      }
      
      if (navigateAfterSave) {
        navigate('/promoter/events');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      
      showToast(
        'Error',
        'There was an issue saving your event. Please try again.',
        undefined,
        { variant: 'destructive' }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndExit = () => {
    handleSaveEvent(true);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading event data...</p>
      </div>
    );
  }

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
      <div className="flex justify-between pt-4 border-t">
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isSaving}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
        </div>

        <div className="flex gap-2">
          {/* Save and Exit button - visible on all steps */}
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleSaveAndExit}
            disabled={isSaving || createEvent.isPending || updateEvent?.isPending}
          >
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save and Exit
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={isSaving}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={() => handleSaveEvent(false)}
              disabled={isSaving || createEvent.isPending || updateEvent?.isPending}
            >
              {isEditMode 
                ? (isSaving || updateEvent?.isPending ? 'Updating...' : 'Update Event') 
                : (isSaving || createEvent.isPending ? 'Creating...' : 'Create Event')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface EventCreationWizardProps {
  eventId?: string;
}

const EventCreationWizard: React.FC<EventCreationWizardProps> = ({ eventId }) => {
  return (
    <EventWizardProvider eventId={eventId}>
      <EventCreationWizardContent />
    </EventWizardProvider>
  );
};

export default EventCreationWizard;
