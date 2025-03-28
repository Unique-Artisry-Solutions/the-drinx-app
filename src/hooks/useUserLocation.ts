
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

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

  const fetchUserLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
          
          toast({
            title: "Location updated",
            description: "Your current location has been refreshed.",
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setError('Location access denied');
          setIsLoading(false);
          toast({
            title: "Location access denied",
            description: "Enable location services to find nearby establishments.",
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
  }, [toast]);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  return { 
    userLocation, 
    isLoading, 
    error, 
    refreshLocation: fetchUserLocation,
    calculateDistance,
    formatDistance
  };
};
