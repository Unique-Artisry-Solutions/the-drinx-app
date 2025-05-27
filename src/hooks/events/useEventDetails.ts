
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Event, EventLocation, EventContactInfo } from '@/types/EventTypes';
import { safeJsonToRecord, safeJsonToType } from '@/utils/typeGuards';

export const useEventDetails = (eventId: string) => {
  const { toast } = useToast();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venue:venue_id (id, name, address),
          event_ticket_types (*)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        toast({
          title: 'Error fetching event',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      // Transform the data to match the Event interface
      const defaultLocation: EventLocation = {
        address: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      };

      const defaultContactInfo: EventContactInfo = {
        name: '',
        email: ''
      };

      const locationDetails = safeJsonToType<EventLocation>(
        data.location_details,
        defaultLocation
      );

      const contactInfo = safeJsonToType<EventContactInfo>(
        data.contact_info,
        defaultContactInfo
      );

      const customSettings = safeJsonToRecord(data.custom_settings);

      const ticketTypes = data.event_ticket_types.map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        description: ticket.description,
        price: ticket.price,
        quantity: ticket.quantity,
        sold: 0,
        available: ticket.quantity
      }));

      const formattedEvent: Event = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        date: data.date,
        time: data.time,
        venue_id: data.venue_id,
        venue: data.venue || { id: '', name: 'TBD', address: '' },
        image_url: data.image_url,
        promotional_materials: data.promotional_materials || [],
        status: data.status || 'draft',
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
        capacity: data.capacity,
        event_type: data.event_type,
        location_details: locationDetails,
        contact_info: contactInfo,
        custom_settings: customSettings,
        is_public: data.is_public !== false,
        event_url: data.event_url,
        ticketTypes: ticketTypes,
        attendees: {
          registered: 0,
          checked_in: 0,
          capacity: data.capacity || 0
        },
        distance: undefined
      };

      return formattedEvent;
    },
    enabled: !!eventId,
  });

  return {
    event,
    isLoading,
    error
  };
};
