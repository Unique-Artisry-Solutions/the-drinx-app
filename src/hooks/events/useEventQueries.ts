
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
        // Transform event_ticket_types to ticketTypes format required by EventType
        const ticketTypes = event.event_ticket_types.map(ticket => ({
          id: ticket.id,
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          quantity: ticket.quantity,
          sold: 0, // Default value since we don't have this data yet
          available: ticket.quantity // Default calculation
        }));

        // Add computed/derived properties that match the EventType interface
        return {
          id: event.id,
          name: event.name,
          description: event.description || '',
          date: event.date,
          time: event.time,
          venue_id: event.venue_id,
          venue: event.venue || { id: '', name: 'TBD', address: '' },
          image_url: event.image_url,
          promotional_materials: event.promotional_materials || [],
          status: event.status || 'published',
          ticketTypes: ticketTypes,
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
          distance: undefined, // This will need real data in the future
          createdAt: event.created_at || new Date().toISOString(),
          updatedAt: event.updated_at || new Date().toISOString(),
          createdBy: event.created_by || '',
          capacity: event.capacity,
          eventType: event.event_type,
          locationDetails: event.location_details || {},
          contactInfo: event.contact_info || {},
          customSettings: event.custom_settings || {},
          isPublic: event.is_public !== false,
          eventUrl: event.event_url
        } as EventType;
      });
    },
  });

  return {
    events,
    isLoading
  };
};
