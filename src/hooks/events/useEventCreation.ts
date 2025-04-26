import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  const updateForm = (updates: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const validateForm = (): boolean => {
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
      const { data, error } = await supabase
        .from('events')
        .insert([{
          name: formData.name,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          venue: formData.venue?.name || '',
          venue_id: formData.venue?.id,
          status: 'draft',
          image_url: formData.imageUrl,
        }])
        .select()
        .single();

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      
      toast({
        title: "Event created successfully!",
        description: "Your event has been created and is now live",
      });
      
      navigate('/promoter/events');
    } catch (error) {
      console.error('Error creating event:', error);
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
