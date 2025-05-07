
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, EventLocation, EventContactInfo, EventTicketType } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';
import { safeJsonToType, safeJsonToRecord } from '@/utils/typeGuards';

/**
 * Hook for fetching and managing event details 
 */
export const useEventDetails = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select(`
            *,
            venue:venue_id (
              id,
              name,
              address
            ),
            event_ticket_types (*)
          `)
          .eq('id', eventId)
          .single();

        if (eventError) throw eventError;

        // Get attendee counts
        const { data: attendeesData, error: attendeesError } = await supabase
          .from('event_attendees')
          .select('status')
          .eq('event_id', eventId);

        if (attendeesError) console.error("Error fetching attendee count:", attendeesError);

        // Calculate registration and check-in counts
        const registeredCount = attendeesData ? attendeesData.filter(a => a.status === 'registered').length : 0;
        const checkedInCount = attendeesData ? attendeesData.filter(a => a.status === 'checked_in').length : 0;

        // Parse location_details and contact_info from JSON if needed
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
          eventData.location_details,
          defaultLocation
        );

        const contactInfo = safeJsonToType<EventContactInfo>(
          eventData.contact_info,
          defaultContactInfo
        );

        const customSettings = safeJsonToRecord(eventData.custom_settings);

        // Format the event data
        const formattedEvent: Event = {
          id: eventData.id,
          name: eventData.name,
          description: eventData.description || '',
          date: eventData.date,
          time: eventData.time,
          venue_id: eventData.venue_id,
          image_url: eventData.image_url,
          promotional_materials: eventData.promotional_materials || [],
          status: eventData.status || 'draft',
          created_by: eventData.created_by || '',
          created_at: eventData.created_at,
          updated_at: eventData.updated_at,
          capacity: eventData.capacity,
          event_type: eventData.event_type,
          location_details: locationDetails,
          contact_info: contactInfo,
          venue: eventData.venue || {
            id: '',
            name: 'TBD',
            address: ''
          },
          attendees: {
            registered: registeredCount,
            checked_in: checkedInCount,
            capacity: eventData.capacity || 0
          },
          ticketTypes: eventData.event_ticket_types,
          distance: undefined,
          is_public: eventData.is_public !== false,
          event_url: eventData.event_url,
          custom_settings: customSettings
        };

        setEvent(formattedEvent);
      } catch (err: any) {
        console.error('Error fetching event details:', err);
        setError(err.message);
        toast({
          title: "Error loading event",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, toast]);

  return { event, isLoading, error };
};
