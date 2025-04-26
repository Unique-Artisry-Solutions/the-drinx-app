
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export interface EventFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  venue: {
    id: string;
    name: string;
  } | null;
  ticketTypes: {
    name: string;
    price: number;
    description: string;
    quantity: number;
  }[];
  imageUrl: string;
  promotionalMaterials: string[];
}

const initialFormData: EventFormData = {
  name: '',
  description: '',
  date: '',
  time: '',
  venue: null,
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

export const useEventCreation = () => {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateForm = (updates: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Event name required",
        description: "Please provide a name for your event",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.date) {
      toast({
        title: "Event date required",
        description: "Please select a date for your event",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.time) {
      toast({
        title: "Event time required",
        description: "Please select a time for your event",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.venue) {
      toast({
        title: "Venue required",
        description: "Please select a venue for your event",
        variant: "destructive"
      });
      return false;
    }
    
    if (formData.ticketTypes.length === 0) {
      toast({
        title: "Ticket information required",
        description: "Please add at least one ticket type",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const submitEvent = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to create the event
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Event created successfully!",
        description: "Your event has been created and is now live",
      });
      
      // Navigate to the events list page
      navigate('/promoter/events');
    } catch (error) {
      toast({
        title: "Failed to create event",
        description: "There was an error creating your event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    updateForm,
    resetForm,
    submitEvent
  };
};
