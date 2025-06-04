
import React from 'react';
import MapView from '@/components/map/MapView';
import { Layout } from '@/components/Layout';

const MapPage: React.FC = () => {
  // Mock data for MapView props
  const mockEstablishments = [];
  const mockUserLocation = { latitude: 40.7128, longitude: -74.0060 };
  const handleRefreshLocation = () => {
    console.log('Refreshing location...');
  };

  return (
    <Layout>
      <MapView 
        establishments={mockEstablishments}
        userLocation={mockUserLocation}
        onRefreshLocation={handleRefreshLocation}
        isLoadingLocation={false}
      />
    </Layout>
  );
};

export default MapPage;
