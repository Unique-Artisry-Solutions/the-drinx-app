
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventType } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';

export const useEventDetails = (eventId: string) => {
  const [event, setEvent] = useState<EventType | null>(null);
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
        // Query events table with venue (establishment) and ticket types
        const { data, error: queryError } = await supabase
          .from('events')
          .select(`
            id,
            name,
            description,
            date,
            time,
            venue_id,
            image_url,
            promotional_materials,
            status,
            created_at,
            updated_at,
            created_by,
            event_ticket_types (
              id,
              name,
              price,
              description,
              quantity
            ),
            establishments:venue_id (
              id, 
              name, 
              address,
              latitude,
              longitude
            )
          `)
          .eq('id', eventId)
          .single();

        if (queryError) throw queryError;
        
        if (!data) {
          setError('Event not found');
          setIsLoading(false);
          return;
        }

        // Format the data according to EventType
        const venueData = data.establishments;
        
        const formattedEvent: EventType = {
          id: data.id,
          name: data.name,
          description: data.description || '',
          date: data.date,
          time: data.time,
          venue_id: data.venue_id,
          image_url: data.image_url || '',
          promotional_materials: data.promotional_materials || [],
          status: data.status,
          ticketTypes: data.event_ticket_types.map(ticket => ({
            id: ticket.id,
            name: ticket.name,
            price: ticket.price,
            description: ticket.description,
            quantity: ticket.quantity,
            sold: 0, // We would need to fetch this separately
            available: ticket.quantity
          })),
          venue: {
            id: data.venue_id || '',
            name: venueData?.name || '',
            address: venueData?.address || ''
          },
          attendees: {
            registered: 0, // We would need to fetch this separately
            capacity: data.event_ticket_types.reduce((sum, ticket) => sum + ticket.quantity, 0),
            checkedIn: 0 // We would need to fetch this separately
          },
          revenue: {
            total: 0,
            ticketSales: 0,
            additionalSales: 0
          },
          distance: 0,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          createdBy: data.created_by
        };

        setEvent(formattedEvent);
      } catch (err: any) {
        console.error('Error fetching event details:', err);
        setError(err.message || 'Failed to fetch event details');
        toast({
          title: 'Error',
          description: 'Failed to load event details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, toast]);

  return { event, isLoading, error };
};
