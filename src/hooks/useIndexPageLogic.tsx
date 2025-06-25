
import { useState, useEffect } from 'react';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useEstablishments } from '@/hooks/useEstablishments';

export const useIndexPageLogic = () => {
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string | null>(null);
  const { userLocation, isLoading: locationLoading } = useUserLocation();
  const { establishments, isLoading: establishmentsLoading } = useEstablishments({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    maxDistance: 10,
    searchTerm: ''
  });

  const isLoading = locationLoading || establishmentsLoading;

  const handleEstablishmentSelect = (establishmentId: string) => {
    setSelectedEstablishmentId(establishmentId);
  };

  const clearSelection = () => {
    setSelectedEstablishmentId(null);
  };

  // Fixed the calculateDistance call - it's now properly exported from userLocation hook
  const getNearbyEstablishments = () => {
    if (!userLocation || !establishments) return [];
    
    return establishments
      .filter(est => est.distanceValue && est.distanceValue <= 5)
      .sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0))
      .slice(0, 10);
  };

  return {
    selectedEstablishmentId,
    establishments: establishments || [],
    nearbyEstablishments: getNearbyEstablishments(),
    userLocation,
    isLoading,
    handleEstablishmentSelect,
    clearSelection
  };
};
