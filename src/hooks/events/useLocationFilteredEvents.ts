
import { useState, useCallback } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventType } from '@/types/EventTypes';
import { eventNotificationSchedules } from '@/lib/typedSupabase';

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

      // Add location data from notification schedules
      const { data: notificationSchedules } = await eventNotificationSchedules()
        .select('event_id, coordinates')
        .in('event_id', events.map(event => event.id))
        .eq('location_based', true);

      // Create a map of event_id to coordinates
      const eventCoordinates = new Map();
      if (notificationSchedules) {
        notificationSchedules.forEach((schedule: any) => {
          if (schedule.coordinates) {
            eventCoordinates.set(schedule.event_id, schedule.coordinates);
          }
        });
      }

      // Now filter and add distance information
      const filteredEvents = events
        .map(event => {
          const coordinates = eventCoordinates.get(event.id);
          if (!coordinates) return null;

          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            coordinates.latitude,
            coordinates.longitude
          );

          if (distance !== null && distance <= radiusMiles) {
            // Transform to match EventType
            return {
              ...event,
              distance,
              venue: {
                id: event.venue_id || '',
                name: '',  // We'll need to fetch this separately if needed
                address: ''
              },
              ticketTypes: event.event_ticket_types ? event.event_ticket_types.map((ticket: any) => ({
                id: ticket.id,
                name: ticket.name,
                price: ticket.price,
                description: ticket.description,
                quantity: ticket.quantity,
                sold: 0,  // Default values
                available: ticket.quantity
              })) : [],
              attendees: {
                registered: 0,
                capacity: 0,
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
            } as EventType;
          }
          return null;
        })
        .filter(Boolean) as EventType[];

      // Sort by distance
      filteredEvents.sort((a: EventType, b: EventType) => 
        (a.distance || Infinity) - (b.distance || Infinity)
      );

      return filteredEvents;
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
