
import React from 'react';
import MapView from '@/components/map/MapView';
import EstablishmentCard from '@/components/EstablishmentCard';

interface MapEstablishment {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cocktailCount: number;
}

interface Establishment {
  id: string;
  name: string;
  address: string;
  distance?: string;
  cocktailCount: number;
  image?: string;
  latitude: number;
  longitude: number;
}

interface MapSectionProps {
  establishments: Establishment[];
  mapHeight: string;
  userLocation: { latitude: number; longitude: number } | null;
  onRefreshLocation: () => void;
  isLoadingLocation: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({
  establishments,
  mapHeight,
  userLocation,
  onRefreshLocation,
  isLoadingLocation
}) => {
  // Transform establishment data for the map
  const mapEstablishments = establishments.map(e => ({
    id: e.id,
    name: e.name,
    latitude: e.latitude,
    longitude: e.longitude,
    cocktailCount: e.cocktailCount
  }));

  return (
    <>
      <div className={mapHeight}>
        <MapView 
          establishments={mapEstablishments} 
          userLocation={userLocation} 
          onRefreshLocation={onRefreshLocation} 
          isLoadingLocation={isLoadingLocation} 
        />
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-medium text-material-on-surface mb-4">Establishments</h2>
        <div className="space-y-3">
          {establishments.map(establishment => (
            <EstablishmentCard 
              key={establishment.id} 
              id={establishment.id} 
              name={establishment.name} 
              address={establishment.address} 
              distance={establishment.distance} 
              cocktailCount={establishment.cocktailCount} 
              image={establishment.image} 
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MapSection;
