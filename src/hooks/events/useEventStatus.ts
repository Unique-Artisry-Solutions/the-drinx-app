
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { updateEventStatus } from '@/services/eventService';

export const useEventStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const updateStatus = async (eventId: string, status: 'draft' | 'published' | 'cancelled' | 'completed') => {
    try {
      await updateEventStatus(eventId, status);
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: `Event ${status === 'published' ? 'Published' : status}`,
        description: `Event has been ${status === 'published' ? 'published' : status} successfully.`
      });
      return true;
    } catch (error: any) {
      toast({
        title: `Failed to ${status} event`,
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }
  };
  
  return { updateStatus };
};
