
import { useState, useCallback } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useToast } from '@/hooks/use-toast';
import { EventType } from '@/types/EventTypes';
import { 
  fetchPublishedEvents, 
  fetchLocationBasedNotifications,
  processLocationData,
  createEventCoordinatesMap,
  formatEventData
} from '@/utils/event-filter.utils';

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
      const result = await fetchPublishedEvents();
      if (result.error) throw result.error;
      if (!result.data || result.data.length === 0) return [];

      const notificationsData = await fetchLocationBasedNotifications();
      if (notificationsData.error) throw notificationsData.error;
      
      const locationData = processLocationData(notificationsData.data || []);
      const eventCoordinates = createEventCoordinatesMap(locationData);

      const filteredEvents = result.data
        .map(rawEvent => {
          const coordinates = eventCoordinates.get(rawEvent.id);
          if (!coordinates) return null;

          const distance = calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            { units: 'miles' }
          );

          if (distance !== null && distance <= radiusMiles) {
            return formatEventData(rawEvent, coordinates, distance);
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
