import React, { createContext, useContext, useState } from 'react';
import { EventFormData } from '@/types/EventTypes';

interface TicketType {
  name: string;
  price: number;
  description: string;
  quantity: number;
}

export interface NotificationSchedule {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor: string;
  locationBased: boolean;
  coordinates?: { latitude: number; longitude: number };
  targetRadius?: number;
}

interface EventWizardContextType {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  validateStep: (stepId: string) => boolean;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const EventWizardContext = createContext<EventWizardContextType | undefined>(undefined);

interface EventWizardProviderProps {
  children: React.ReactNode;
}

export const EventWizardProvider: React.FC<EventWizardProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    date: '',
    time: '',
    ticketTypes: [],
    imageUrl: '',
    promotionalMaterials: [],
    notificationSchedules: []
  });

  const updateFormData = (data: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateStep = (stepId: string): boolean => {
    switch (stepId) {
      case 'basic':
        return !!formData.name && !!formData.date && !!formData.time;
      case 'venue':
        return !!formData.venueId;
      case 'tickets':
        return formData.ticketTypes.every(ticket => !!ticket.name && ticket.price >= 0);
      case 'materials':
        return true;
      case 'notifications':
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <EventWizardContext.Provider value={{ 
      formData, 
      updateFormData, 
      validateStep,
      currentStep,
      nextStep,
      prevStep,
      goToStep
    }}>
      {children}
    </EventWizardContext.Provider>
  );
};

export const useEventWizard = () => {
  const context = useContext(EventWizardContext);
  if (context === undefined) {
    throw new Error('useEventWizard must be used within an EventWizardProvider');
  }
  return context;
};
