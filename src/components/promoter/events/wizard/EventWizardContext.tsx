
import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventFormData, EventLocation, EventContactInfo } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EventWizardContextType {
  formData: EventFormData;
  updateFormData: (data: Partial<EventFormData>) => void;
  validateStep: (stepId: string) => boolean;
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isEditMode: boolean;
  isLoading: boolean;
}

const EventWizardContext = createContext<EventWizardContextType | undefined>(undefined);

interface EventWizardProviderProps {
  children: React.ReactNode;
  eventId?: string;
}

export const EventWizardProvider: React.FC<EventWizardProviderProps> = ({ children, eventId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(!!eventId);
  const { toast } = useToast();
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    date: '',
    time: '',
    created_by: '',
    ticketTypes: [],
    imageUrl: '',
    promotionalMaterials: [],
    notificationSchedules: []
  });

  // Check if we're in edit mode
  const isEditMode = !!eventId;

  // If we're in edit mode, fetch the event data
  useEffect(() => {
    if (eventId) {
      const fetchEventData = async () => {
        try {
          setIsLoading(true);
          const { data: eventData, error } = await supabase
            .from('events')
            .select(`
              *,
              venue:venue_id (id, name, address),
              event_ticket_types (*)
            `)
            .eq('id', eventId)
            .single();

          if (error) {
            throw error;
          }

          if (eventData) {
            // Convert event data to form data format
            const formattedData: EventFormData = {
              name: eventData.name || '',
              description: eventData.description || '',
              date: eventData.date || '',
              time: eventData.time || '',
              venueId: eventData.venue_id || undefined,
              created_by: eventData.created_by || '',
              imageUrl: eventData.image_url || '',
              promotionalMaterials: eventData.promotional_materials || [],
              ticketTypes: eventData.event_ticket_types.map((ticket: any) => ({
                name: ticket.name,
                price: ticket.price,
                description: ticket.description || '',
                quantity: ticket.quantity
              })),
              notificationSchedules: []
            };

            // Fetch notification schedules if they exist
            const { data: notificationData, error: notificationError } = await supabase
              .from('event_notification_schedules')
              .select('*')
              .eq('event_id', eventId);

            if (!notificationError && notificationData) {
              formattedData.notificationSchedules = notificationData.map((notification) => {
                // Transform coordinates from Json type to the expected object structure
                let coordinates;
                if (notification.coordinates) {
                  // Check if coordinates is already an object or needs parsing
                  if (typeof notification.coordinates === 'string') {
                    try {
                      coordinates = JSON.parse(notification.coordinates);
                    } catch (e) {
                      coordinates = undefined;
                    }
                  } else {
                    // It's already an object
                    coordinates = notification.coordinates as { latitude: number; longitude: number };
                  }
                }

                return {
                  id: notification.id,
                  title: notification.title,
                  content: notification.content,
                  priority: notification.priority as 'low' | 'medium' | 'high' | 'urgent',
                  scheduledFor: notification.scheduled_for,
                  locationBased: notification.location_based,
                  coordinates: coordinates,
                  targetRadius: notification.target_radius
                };
              });
            }

            setFormData(formattedData);
          }
        } catch (error: any) {
          toast({
            title: "Error fetching event",
            description: error.message || "Failed to load event data",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchEventData();
    }
  }, [eventId, toast]);

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
      goToStep,
      isEditMode,
      isLoading
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
