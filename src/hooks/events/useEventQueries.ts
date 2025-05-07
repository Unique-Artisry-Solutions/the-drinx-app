
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Event, EventType, EventLocation, EventContactInfo } from '@/types/EventTypes';

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
          hasLimitedInventory: ticket.hasLimitedInventory || false,
          lowInventoryThreshold: ticket.lowInventoryThreshold,
          hasDynamicPricing: ticket.hasDynamicPricing || false
        }));

        // Define default location and contact objects
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

        // Parse location_details and contact_info JSON
        let locationDetails: EventLocation;
        if (typeof event.location_details === 'string') {
          try {
            locationDetails = JSON.parse(event.location_details);
          } catch (e) {
            locationDetails = defaultLocation;
          }
        } else if (event.location_details && typeof event.location_details === 'object') {
          locationDetails = event.location_details as EventLocation;
        } else {
          locationDetails = defaultLocation;
        }

        let contactInfo: EventContactInfo;
        if (typeof event.contact_info === 'string') {
          try {
            contactInfo = JSON.parse(event.contact_info);
          } catch (e) {
            contactInfo = defaultContactInfo;
          }
        } else if (event.contact_info && typeof event.contact_info === 'object') {
          contactInfo = event.contact_info as EventContactInfo;
        } else {
          contactInfo = defaultContactInfo;
        }
        
        // Handle custom_settings safely
        let customSettings = {};
        if (typeof event.custom_settings === 'string') {
          try {
            customSettings = JSON.parse(event.custom_settings);
          } catch (e) {
            customSettings = {};
          }
        } else if (event.custom_settings && typeof event.custom_settings === 'object') {
          customSettings = event.custom_settings;
        }

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
          custom_settings: customSettings as Record<string, any>,
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
