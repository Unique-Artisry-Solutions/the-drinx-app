
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface DistanceOptions {
  units?: 'miles' | 'kilometers';
}

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateServerLocation = useCallback(async (latitude: number, longitude: number, accuracy?: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      // Store location in profiles table instead of location_history
      const { error } = await supabase
        .from('profiles')
        .update({
          last_location_latitude: latitude,
          last_location_longitude: longitude,
          last_location_accuracy: accuracy,
          last_location_timestamp: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating location:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error updating location on server:', err);
      return false;
    }
  }, []);

  const calculateDistance = useCallback((
    destLat: number, 
    destLng: number, 
    options: DistanceOptions = { units: 'miles' }
  ): number | null => {
    if (!userLocation) return null;
    
    // Implementation of the Haversine formula for calculating distance between two points on Earth
    const toRadian = (degree: number) => degree * Math.PI / 180;
    
    const earthRadius = options.units === 'kilometers' ? 6371 : 3958.8; // Earth radius in km or miles
    
    const latDiff = toRadian(destLat - userLocation.latitude);
    const lngDiff = toRadian(destLng - userLocation.longitude);
    
    const a = 
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.cos(toRadian(userLocation.latitude)) * Math.cos(toRadian(destLat)) * 
      Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    
    return parseFloat(distance.toFixed(1));
  }, [userLocation]);
  
  const formatDistance = useCallback((distance: number | null): string => {
    if (distance === null) return 'Unknown';
    return `${distance} miles`;
  }, []);

  const refreshLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          
          setUserLocation(newLocation);
          setIsLoading(false);
          
          // Update location on the server
          updateServerLocation(
            newLocation.latitude, 
            newLocation.longitude,
            position.coords.accuracy
          );
          
          // Using a subtle toast without a title and shorter duration
          toast({
            description: "Updated location",
            duration: 2000,
            className: "bg-opacity-70 text-sm"
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setError('Location access denied');
          setIsLoading(false);
          toast({
            title: "Location access denied",
            description: "Enable location services to find nearby events.",
            variant: "destructive",
          });
        }
      );
    } else {
      setError('Geolocation not supported');
      setIsLoading(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  }, [toast, updateServerLocation]);

  useEffect(() => {
    refreshLocation();
    
    // Set up a periodic location refresh (every 15 minutes)
    const intervalId = setInterval(() => {
      refreshLocation();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshLocation]);

  return { 
    userLocation, 
    isLoading, 
    error, 
    refreshLocation,
    calculateDistance,
    formatDistance
  };
};
