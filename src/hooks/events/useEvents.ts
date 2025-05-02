
import { supabase } from '@/integrations/supabase/client';
import { EventType, EventFormData } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';
import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calculateDistance } from '@/utils/locationUtils';
import { useEventMutations } from './useEventMutations';

export interface LocationFilter {
  latitude: number;
  longitude: number;
  radiusMiles: number;
}

export const useEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { createEvent: createEventMutation } = useEventMutations();

  const fetchPublishedEvents = useCallback(async (locationFilter?: LocationFilter): Promise<EventType[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // First fetch events joined with venues to get location data
      const { data, error } = await supabase
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
        .eq('status', 'published');

      if (error) throw error;
      if (!data) return [];

      // Map data to our EventType format
      let formattedEvents = data.map(event => {
        const venueData = event.establishments;
        
        // Calculate distance if location filter is provided and venue data exists
        let distance = 0;
        if (locationFilter && venueData && venueData.latitude && venueData.longitude) {
          distance = calculateDistance(
            locationFilter.latitude,
            locationFilter.longitude,
            venueData.latitude,
            venueData.longitude
          );
        }

        return {
          id: event.id,
          name: event.name,
          description: event.description || '',
          date: event.date,
          time: event.time,
          venue_id: event.venue_id,
          image_url: event.image_url || '',
          promotional_materials: event.promotional_materials || [],
          status: event.status,
          distance: distance,
          ticketTypes: event.event_ticket_types.map(ticket => ({
            id: ticket.id,
            name: ticket.name,
            price: ticket.price,
            description: ticket.description,
            quantity: ticket.quantity,
            sold: 0,
            available: ticket.quantity
          })),
          venue: {
            id: event.venue_id || '',
            name: venueData?.name || '',
            address: venueData?.address || ''
          },
          attendees: {
            registered: 0,
            capacity: event.event_ticket_types.reduce((sum, ticket) => sum + ticket.quantity, 0),
            checkedIn: 0
          },
          revenue: {
            total: 0,
            ticketSales: 0,
            additionalSales: 0
          },
          createdAt: event.created_at,
          updatedAt: event.updated_at,
          createdBy: event.created_by
        };
      });

      // Filter by distance if location filter is provided
      if (locationFilter) {
        formattedEvents = formattedEvents.filter(
          event => event.distance <= locationFilter.radiusMiles
        );
      }

      setEvents(formattedEvents);
      return formattedEvents;

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching events",
        description: err.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch events on component mount without location filter
  useEffect(() => {
    fetchPublishedEvents();
  }, [fetchPublishedEvents]);

  // Use the imported createEvent mutation from useEventMutations
  const createEvent = createEventMutation;

  return {
    events,
    fetchPublishedEvents,
    isLoading,
    error,
    createEvent,
  };
};
