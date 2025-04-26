import { useState, useCallback } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventType } from '@/types/EventTypes';

export const useLocationFilteredEvents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userLocation, calculateDistance } = useUserLocation();
  const { toast } = useToast();

  const getLocationFilteredEvents = useCallback(async (radiusMiles: number = 10): Promise<EventType[]> => {
    if (!userLocation) {
      toast({
        title: "Location unavailable",
        description: "Please enable location services to find nearby events.",
        variant: "destructive",
      });
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get all events first (we'll filter by location client-side)
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          event_ticket_types (*)
        `)
        .eq('status', 'published');

      if (error) throw error;

      if (!events || events.length === 0) return [];

      // Add location data from notifications
      const { data: locationData } = await supabase
        .from('notifications')
        .select('metadata, event_id')
        .eq('metadata->location_based', true);

      // Create a map of event_id to coordinates
      const eventCoordinates = new Map();
      if (locationData) {
        locationData.forEach((item: any) => {
          const metadata = item.metadata || {};
          if (metadata.coordinates && metadata.event_id) {
            eventCoordinates.set(metadata.event_id, metadata.coordinates);
          }
        });
      }

      // Filter and add distance information
      const filteredEvents = events
        .map(event => {
          const coordinates = eventCoordinates.get(event.id);
          if (!coordinates) return null;

          const distance = calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            { units: 'miles' }
          );

          if (distance !== null && distance <= radiusMiles) {
            // Create a properly typed EventType object
            return {
              ...event,
              distance,
              ticketTypes: event.event_ticket_types.map((ticket: any) => ({
                id: ticket.id,
                name: ticket.name,
                price: ticket.price,
                description: ticket.description,
                quantity: ticket.quantity,
                sold: 0,
                available: ticket.quantity
              })),
              createdAt: event.created_at,
              updatedAt: event.updated_at,
              createdBy: event.created_by
            } as EventType;
          }
          return null;
        })
        .filter(Boolean) as EventType[];

      return filteredEvents.sort((a, b) => 
        (a.distance || Infinity) - (b.distance || Infinity)
      );

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error retrieving nearby events",
        description: err.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, calculateDistance, toast]);

  return {
    getLocationFilteredEvents,
    isLoading,
    error,
  };
};
