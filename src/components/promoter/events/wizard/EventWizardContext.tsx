
import React, { createContext, useContext, useState } from 'react';

type EventFormData = {
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  venueId: string | null;
  ticketTypes: {
    name: string;
    price: number;
    description: string;
    quantity: number;
  }[];
  imageUrl: string;
  promotionalMaterials: string[];
};

const initialFormData: EventFormData = {
  name: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  venueId: null,
  ticketTypes: [
    {
      name: 'General Admission',
      price: 0,
      description: 'Standard entry to the event',
      quantity: 100
    }
  ],
  imageUrl: '',
  promotionalMaterials: []
};

type WizardContextType = {
  formData: EventFormData;
  currentStep: number;
  updateFormData: (data: Partial<EventFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
};

const EventWizardContext = createContext<WizardContextType | undefined>(undefined);

export const useEventWizard = () => {
  const context = useContext(EventWizardContext);
  if (context === undefined) {
    throw new Error('useEventWizard must be used within an EventWizardProvider');
  }
  return context;
};

export const EventWizardProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);

  const updateFormData = (data: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
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

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  return (
    <EventWizardContext.Provider value={{
      formData,
      currentStep,
      updateFormData,
      nextStep,
      prevStep,
      goToStep,
      resetForm
    }}>
      {children}
    </EventWizardContext.Provider>
  );
};
