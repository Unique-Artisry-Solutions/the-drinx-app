
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UserLocation {
  latitude: number;
  longitude: number;
}

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
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

  return { userLocation, isLoading, error };
};
