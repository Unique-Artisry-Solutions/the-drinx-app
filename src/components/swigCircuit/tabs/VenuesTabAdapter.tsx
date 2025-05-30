
import React, { useState, useEffect } from 'react';
import { Establishment } from '@/types/ProfileTypes';
import VenuesTab from './VenuesTab';
import { useEstablishments } from '@/hooks/useEstablishments';

interface VenuesTabAdapterProps {
  selectedEstablishments: Establishment[];
  onSaveEstablishments: (establishments: Establishment[]) => void;
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
  onBack: () => void;
  onContinue: () => void;
}

const VenuesTabAdapter: React.FC<VenuesTabAdapterProps> = ({
  selectedEstablishments,
  onSaveEstablishments,
  maxDistance,
  setMaxDistance,
  onBack,
  onContinue
}) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get establishments using the useEstablishments hook
  const { 
    establishments: availableEstablishments, 
    isLoading: isLoadingEstablishments 
  } = useEstablishments({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    maxDistance
  });

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLocating(false);
          setLocationError(null);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationError(error.message);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
      setIsLocating(false);
    }
  }, []);

  // Map setMaxDistance to onDistanceChange
  const handleDistanceChange = (distance: number) => {
    setMaxDistance(distance);
  };

  return (
    <VenuesTab
      maxDistance={maxDistance}
      onDistanceChange={handleDistanceChange}
      isLocating={isLocating}
      userLocation={userLocation}
      isLoadingEstablishments={isLoadingEstablishments}
      availableEstablishments={availableEstablishments}
      selectedEstablishments={selectedEstablishments}
      onSaveEstablishments={onSaveEstablishments}
      onBack={onBack}
      onContinue={onContinue}
    />
  );
};

export default VenuesTabAdapter;
