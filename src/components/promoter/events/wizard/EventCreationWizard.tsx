import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EventWizardProvider, useEventWizard } from './EventWizardContext';
import WizardSteps from './WizardSteps';
import BasicDetailsStep from './BasicDetailsStep';
import VenueSelectionStep from './VenueSelectionStep';
import TicketingStep from './TicketingStep';
import MediaStep from './MediaStep';
import PreviewStep from './PreviewStep';
import WizardNavigation from './WizardNavigation';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
const STEPS = ['Basic Details', 'Venue', 'Tickets', 'Media', 'Preview'];
const EventCreationWizard: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call to save event data
    setTimeout(() => {
      toast({
        title: "Event created successfully!",
        description: "Your event has been created and is now live."
      });
      setIsSubmitting(false);
      navigate('/promoter/events');
    }, 1500);
  };
  return <EventWizardProvider>
      <div className="max-w-4xl mx-auto">
        <WizardSteps steps={STEPS} />
        
        <Card className="mt-6">
          <CardContent className="p-6 my-0 py-[20px]">
            {/* Content changes based on current step */}
            <EventWizardContent />
            
            {/* Navigation buttons */}
            <WizardNavigation steps={STEPS.length} onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </div>
    </EventWizardProvider>;
};
const EventWizardContent: React.FC = () => {
  const {
    currentStep
  } = useEventWizard();

  // Render different content based on the current step
  switch (currentStep) {
    case 0:
      return <BasicDetailsStep />;
    case 1:
      return <VenueSelectionStep />;
    case 2:
      return <TicketingStep />;
    case 3:
      return <MediaStep />;
    case 4:
      return <PreviewStep />;
    default:
      return null;
  }
};
export default EventCreationWizard;