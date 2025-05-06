
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';

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
        const { data: attendeesCount, error: attendeesError } = await supabase
          .from('event_attendees')
          .select('status', { count: 'exact' })
          .eq('event_id', eventId)
          .eq('status', 'registered');

        const { data: checkedInCount, error: checkedInError } = await supabase
          .from('event_attendees')
          .select('status', { count: 'exact' })
          .eq('event_id', eventId)
          .eq('status', 'checked_in');

        if (attendeesError) console.error("Error fetching attendee count:", attendeesError);
        if (checkedInError) console.error("Error fetching checked-in count:", checkedInError);

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
          location_details: eventData.location_details,
          contact_info: eventData.contact_info,
          venue: eventData.venue || {
            id: '',
            name: 'TBD',
            address: ''
          },
          attendees: {
            registered: attendeesCount?.count || 0,
            checked_in: checkedInCount?.count || 0,
          },
          ticketTypes: eventData.event_ticket_types
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
