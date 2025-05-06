
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateEventStatus } from '@/services/eventService';
import { EventStatus } from '@/types/EventTypes';

export const useEventService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const updateStatus = async (
    eventId: string, 
    status: EventStatus
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await updateEventStatus(eventId, status);
      return true;
    } catch (error: any) {
      toast({
        title: "Error Updating Status",
        description: error.message || "Could not update event status",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    updateStatus,
    isLoading
  };
};
