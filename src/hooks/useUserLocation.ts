
import { useState, useEffect } from 'react';

interface UserLocation {
  latitude: number;
  longitude: number;
}

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setError(null);
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(error.message);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    };

    getCurrentLocation();
  }, []);

  const refreshLocation = () => {
    setIsLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(error.message);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // Force fresh location
      }
    );
  };

  return {
    userLocation,
    isLoading,
    error,
    refreshLocation
  };
};
