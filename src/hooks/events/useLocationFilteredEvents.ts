
import { useState, useCallback } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventType } from '@/types/EventTypes';

// Interface for raw event data from database
interface RawEventData {
  id: string;
  name: string;
  description: string | null;
  date: string;
  time: string;
  venue_id: string | null;
  image_url: string | null;
  promotional_materials: string[] | null;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  created_by: string;
  event_ticket_types: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    quantity: number;
  }>;
}

interface RawEventResponse {
  data: RawEventData[] | null;
  error: any;
}

// Define a simplified structure for notification metadata
interface NotificationMetadata {
  location_based?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  event_id?: string;
}

// Interface for location notification data
interface LocationNotificationData {
  metadata?: NotificationMetadata;
  event_id?: string;
}

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
      const result = await supabase
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
          )
        `)
        .eq('status', 'published') as RawEventResponse;

      if (result.error) throw result.error;
      if (!result.data || result.data.length === 0) return [];

      // Get location data from notifications with explicit typing to avoid deep instantiation
      const { data: locationDataRaw } = await supabase
        .from('notifications')
        .select('metadata, event_id')
        .eq('metadata->location_based', true);

      // Type cast with a specific structure to prevent deep type instantiation
      const locationData = locationDataRaw as Array<{
        metadata: NotificationMetadata;
        event_id?: string;
      }>;

      // Create a map of event_id to coordinates with explicit typing
      const eventCoordinates = new Map<string, {latitude: number, longitude: number}>();
      
      if (locationData) {
        locationData.forEach(item => {
          const metadata = item.metadata || {};
          const eventId = metadata.event_id || item.event_id;
          if (metadata.coordinates && eventId) {
            eventCoordinates.set(eventId, metadata.coordinates);
          }
        });
      }

      // Filter and add distance information
      const filteredEvents = result.data
        .map((rawEvent: RawEventData) => {
          const coordinates = eventCoordinates.get(rawEvent.id);
          if (!coordinates) return null;

          const distance = calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            { units: 'miles' }
          );

          if (distance !== null && distance <= radiusMiles) {
            const formattedEvent: EventType = {
              id: rawEvent.id,
              name: rawEvent.name,
              description: rawEvent.description || '',
              date: rawEvent.date,
              time: rawEvent.time,
              venue_id: rawEvent.venue_id,
              image_url: rawEvent.image_url || '',
              promotional_materials: rawEvent.promotional_materials || [],
              status: rawEvent.status,
              distance,
              ticketTypes: rawEvent.event_ticket_types.map(ticket => ({
                id: ticket.id,
                name: ticket.name,
                price: ticket.price,
                description: ticket.description,
                quantity: ticket.quantity,
                sold: 0,
                available: ticket.quantity
              })),
              venue: {
                id: rawEvent.venue_id || '',
                name: '',
                address: ''
              },
              attendees: {
                registered: 0,
                capacity: rawEvent.event_ticket_types.reduce((sum, ticket) => sum + ticket.quantity, 0),
                checkedIn: 0
              },
              revenue: {
                total: 0,
                ticketSales: 0,
                additionalSales: 0
              },
              createdAt: rawEvent.created_at,
              updatedAt: rawEvent.updated_at,
              createdBy: rawEvent.created_by
            };

            return formattedEvent;
          }
          return null;
        })
        .filter((event): event is EventType => event !== null);

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
