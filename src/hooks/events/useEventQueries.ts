
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventType } from '@/types/EventTypes';

export const useEventQueries = () => {
  const { toast } = useToast();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venue_id (id, name, address),
          event_ticket_types (*)
        `);

      if (error) {
        toast({
          title: 'Error fetching events',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data.map(event => {
        // Add computed/derived properties that match the EventType interface
        return {
          ...event,
          attendees: {
            registered: 0, // This will need real data in the future
            capacity: event.capacity || 0,
            checkedIn: 0 // This will need real data in the future
          },
          revenue: {
            total: 0, // This will need real data in the future
            ticketSales: 0, 
            additionalSales: 0
          },
          distance: undefined // This will need real data in the future
        } as EventType;
      });
    },
  });

  return {
    events,
    isLoading
  };
};
