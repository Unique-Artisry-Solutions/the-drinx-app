
import React from 'react';
import MapView from '@/components/map/MapView';

interface MapData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cocktailCount: number; // Changed from optional to required
}

interface MapTabContentProps {
  establishments: MapData[];
}

const MapTabContent: React.FC<MapTabContentProps> = ({ establishments }) => {
  return (
    <div className="border rounded-lg overflow-hidden h-[450px]">
      <MapView 
        establishments={establishments} 
        userLocation={null}
        onRefreshLocation={() => {}}
        isLoadingLocation={false}
        singleEstablishmentView={false}
      />
    </div>
  );
};

export default MapTabContent;
