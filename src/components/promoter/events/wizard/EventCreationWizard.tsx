
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EventWizardProvider, useEventWizard } from './EventWizardContext';
import { useEvents } from '@/hooks/useEvents';
import { useNavigate } from 'react-router-dom';
import WizardSteps from './WizardSteps';
import BasicDetailsStep from './BasicDetailsStep';
import VenueSelectionStep from './VenueSelectionStep';
import TicketingStep from './TicketingStep';
import MediaStep from './MediaStep';
import PreviewStep from './PreviewStep';
import WizardNavigation from './WizardNavigation';

const STEPS = ['Basic Details', 'Venue', 'Tickets', 'Media', 'Preview'];

const EventCreationWizard: React.FC = () => {
  return (
    <EventWizardProvider>
      <EventWizardContent />
    </EventWizardProvider>
  );
};

const EventWizardContent: React.FC = () => {
  const { formData, currentStep } = useEventWizard();
  const { createEvent } = useEvents();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createEvent.mutateAsync(formData);
      navigate('/promoter/events');
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <WizardSteps steps={STEPS} />
      
      <Card className="mt-6">
        <CardContent className="p-6 py-[20px] my-[10px]">
          {currentStep === 0 && <BasicDetailsStep />}
          {currentStep === 1 && <VenueSelectionStep />}
          {currentStep === 2 && <TicketingStep />}
          {currentStep === 3 && <MediaStep />}
          {currentStep === 4 && <PreviewStep />}
          
          <WizardNavigation 
            steps={STEPS.length} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventCreationWizard;
