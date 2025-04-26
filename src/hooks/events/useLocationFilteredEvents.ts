
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useUserLocation } from '@/hooks/useUserLocation';

export const useLocationFilteredEvents = () => {
  const { toast } = useToast();
  const { userLocation } = useUserLocation();

  const getLocationFilteredEvents = async (radius: number = 10) => {
    if (!userLocation) {
      toast({
        title: 'Location required',
        description: 'Please enable location services to use this feature.',
        variant: 'destructive',
      });
      return [];
    }

    try {
      const { data: venues, error: venuesError } = await supabase
        .from('establishments')
        .select('id, latitude, longitude');
      
      if (venuesError) throw venuesError;
      
      const { data: allEvents, error: eventsError } = await supabase
        .from('events')
        .select('*, establishments(id, latitude, longitude)')
        .eq('status', 'published');
      
      if (eventsError) throw eventsError;
      
      const filteredEvents = allEvents.filter(event => {
        if (!event.establishments) return false;
        
        const venue = event.establishments;
        if (!venue.latitude || !venue.longitude) return false;
        
        const R = 3958.8;
        const lat1 = userLocation.latitude * Math.PI/180;
        const lat2 = venue.latitude * Math.PI/180;
        const deltaLat = (venue.latitude - userLocation.latitude) * Math.PI/180;
        const deltaLon = (venue.longitude - userLocation.longitude) * Math.PI/180;
        
        const a = 
          Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
          Math.cos(lat1) * Math.cos(lat2) * 
          Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance <= radius;
      });
      
      return filteredEvents;
    } catch (error: any) {
      toast({
        title: 'Error filtering events',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    getLocationFilteredEvents
  };
};
