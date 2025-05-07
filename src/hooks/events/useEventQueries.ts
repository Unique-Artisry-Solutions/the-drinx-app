
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Event, EventLocation, EventContactInfo } from '@/types/EventTypes';
import { safeJsonToEventLocation, safeJsonToEventContactInfo, safeJsonToRecord } from '@/utils/typeGuards';

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
        // No longer filtering by status to show all events including drafts

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
          description: ticket.description || '',
          price: ticket.price,
          quantity: ticket.quantity,
          sold: 0, // Default value since we don't have this data yet
          available: ticket.quantity, // Default calculation
          hasLimitedInventory: false, // Providing default values for missing properties
          lowInventoryThreshold: undefined,
          hasDynamicPricing: false
        }));

        // Parse location_details and contact_info using our safe conversion functions
        const locationDetails: EventLocation = safeJsonToEventLocation(event.location_details);
        const contactInfo: EventContactInfo = safeJsonToEventContactInfo(event.contact_info);

        // Handle custom_settings safely
        const customSettings = safeJsonToRecord(event.custom_settings, {});

        // Add computed/derived properties that match the EventType interface
        const formattedEvent: Event = {
          id: event.id,
          name: event.name,
          description: event.description || '',
          date: event.date,
          time: event.time,
          venue_id: event.venue_id,
          venue: event.venue || { id: '', name: 'TBD', address: '' },
          image_url: event.image_url,
          promotional_materials: event.promotional_materials || [],
          status: event.status || 'draft',
          created_by: event.created_by,
          created_at: event.created_at,
          updated_at: event.updated_at,
          capacity: event.capacity,
          event_type: event.event_type,
          location_details: locationDetails,
          contact_info: contactInfo,
          custom_settings: customSettings,
          is_public: event.is_public !== false,
          event_url: event.event_url,
          ticketTypes: ticketTypes,
          attendees: {
            registered: 0, // This will need real data in the future
            checked_in: 0, // This will need real data in the future
            capacity: event.capacity || 0
          },
          distance: undefined // This will need real data in the future
        };

        return formattedEvent;
      });
    },
  });

  return {
    events,
    isLoading
  };
};
