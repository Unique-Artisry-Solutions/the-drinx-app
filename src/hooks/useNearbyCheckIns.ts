
import { useState, useEffect } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useEstablishments } from '@/hooks/useEstablishments';
import { useUserVisits } from '@/hooks/useUserVisits';
import { useToast } from '@/hooks/use-toast';

interface NearbyEstablishment {
  id: string;
  name: string;
  address: string;
  distance: string;
  distanceValue: number;
  latitude: number;
  longitude: number;
  cocktailCount: number;
  image?: string;
  isCheckedIn?: boolean;
}

export function useNearbyCheckIns() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState<string | null>(null);
  const { userLocation, isLoading: locationLoading, error: locationError } = useUserLocation();
  const { establishments, isLoading: establishmentsLoading } = useEstablishments({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    maxDistance: 5 // 5 miles radius for nearby check-ins
  });
  const { verifyLocationAndRecordVisit } = useUserVisits();
  const { toast } = useToast();

  const [nearbyEstablishments, setNearbyEstablishments] = useState<NearbyEstablishment[]>([]);

  useEffect(() => {
    if (establishments && userLocation) {
      // Transform and sort establishments by distance
      const transformed = establishments
        .filter(est => est.distanceValue && est.distanceValue <= 5)
        .sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0))
        .slice(0, 10) // Limit to top 10 closest
        .map(est => ({
          id: est.id,
          name: est.name,
          address: est.address,
          distance: est.distance || '',
          distanceValue: est.distanceValue || 0,
          latitude: est.latitude,
          longitude: est.longitude,
          cocktailCount: est.cocktailCount,
          image: est.image,
          isCheckedIn: false // We'll enhance this later with actual check-in status
        }));
      
      setNearbyEstablishments(transformed);
    }
  }, [establishments, userLocation]);

  const openModal = () => {
    if (locationError) {
      toast({
        title: "Location required",
        description: "Please enable location access to find nearby establishments",
        variant: "destructive",
      });
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckIn = async (establishment: NearbyEstablishment) => {
    if (!userLocation) {
      toast({
        title: "Location required",
        description: "Location is needed to verify your check-in",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingIn(establishment.id);
    
    try {
      const success = await verifyLocationAndRecordVisit(
        establishment.id,
        userLocation.latitude,
        userLocation.longitude,
        { rating: null, note: '' }
      );
      
      if (success) {
        // Update local state to reflect check-in
        setNearbyEstablishments(prev => 
          prev.map(est => 
            est.id === establishment.id 
              ? { ...est, isCheckedIn: true }
              : est
          )
        );
        
        toast({
          title: "Check-in successful!",
          description: `You've checked in at ${establishment.name} and earned 10 points!`,
        });
      }
    } catch (error) {
      console.error('Check-in failed:', error);
    } finally {
      setIsCheckingIn(null);
    }
  };

  const isLoading = locationLoading || establishmentsLoading;
  const hasError = Boolean(locationError);
  const hasNearbyEstablishments = nearbyEstablishments.length > 0;

  return {
    isModalOpen,
    openModal,
    closeModal,
    nearbyEstablishments,
    isLoading,
    hasError,
    hasNearbyEstablishments,
    isCheckingIn,
    handleCheckIn,
    userLocation
  };
}
