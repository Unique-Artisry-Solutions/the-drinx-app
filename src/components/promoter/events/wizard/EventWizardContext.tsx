
import React, { createContext, useContext, useState } from 'react';

interface TicketType {
  name: string;
  price: number;
  description?: string;
  quantity?: number;
}

interface PromotionalMaterial {
  title: string;
  description: string;
  imageUrl?: string;
}

interface NotificationSchedule {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor: string;
  locationBased: boolean;
  coordinates?: { latitude: number; longitude: number };
  targetRadius?: number;
}

export interface EventFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  venue?: string;
  venueId?: string;
  ticketTypes: TicketType[];
  imageUrl?: string;
  promotionalMaterials?: PromotionalMaterial[];
  notificationSchedules?: NotificationSchedule[];
}

interface EventWizardContextType {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  validateStep: (stepId: string) => boolean;
}

const EventWizardContext = createContext<EventWizardContextType | undefined>(undefined);

interface EventWizardProviderProps {
  children: React.ReactNode;
}

export const EventWizardProvider: React.FC<EventWizardProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    date: '',
    time: '',
    ticketTypes: [],
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
        // Ticket types can be empty, but if they exist, they need name and price
        return formData.ticketTypes.every(ticket => !!ticket.name && ticket.price >= 0);
      case 'materials':
        // Promotional materials are optional
        return true;
      case 'notifications':
        // Notifications are optional
        return true;
      default:
        return true;
    }
  };

  return (
    <EventWizardContext.Provider value={{ formData, updateFormData, validateStep }}>
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
