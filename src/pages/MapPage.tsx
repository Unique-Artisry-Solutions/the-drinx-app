
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import EstablishmentList from '@/components/EstablishmentList';
import MapView from '@/components/map/MapView';
import { useEstablishments } from '@/hooks/useEstablishments';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import MapPageLoading from '@/components/map/MapPageLoading';
import MapPageHeader from '@/components/map/MapPageHeader';
import MobileViewToggle from '@/components/map/MobileViewToggle';

enum ViewMode {
  MAP = 'map',
  LIST = 'list'
}

interface Establishment {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cocktailCount: number;
  image?: string;
  distance?: string;
}

const MapPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? ViewMode.LIST : ViewMode.MAP);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { 
    userLocation, 
    isLoading: isLocating, 
    error: locationError, 
    refreshLocation 
  } = useUserLocation();
  
  const { 
    establishments: rawEstablishments, 
    isLoading,
    error: establishmentsError,
    filterEstablishments,
    performSearch 
  } = useEstablishments({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    searchTerm: searchTerm,
  });

  const establishments: Establishment[] = rawEstablishments.map(est => ({
    id: est.id,
    name: est.name,
    address: est.address,
    latitude: est.latitude,
    longitude: est.longitude,
    cocktailCount: est.cocktail_count || est.cocktailCount || 0,
    image: est.image_url || est.image,
    distance: est.distance
  }));

  useEffect(() => {
    if (isMobile) {
      setViewMode(ViewMode.LIST);
    }
  }, [isMobile]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterEstablishments(term);
    performSearch();
    
    if (term) {
      toast({
        title: "Search results",
        description: establishments.length > 0 
          ? `Found ${establishments.length} establishments matching "${term}"` 
          : `No establishments found matching "${term}"`
      });
    }
  };

  const handleFilterChange = (filters: any) => {
    console.log('Applied filters:', filters);
  };
  
  const applyFilters = () => {
    performSearch();
    toast({
      title: "Filters Applied",
      description: `Found ${establishments.length} establishments matching your criteria.`
    });
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === ViewMode.MAP ? ViewMode.LIST : ViewMode.MAP);
  };

  useEffect(() => {
    if (locationError) {
      console.error('Error getting location:', locationError);
      toast({
        title: "Location error",
        description: "Unable to get your location. Some features may be limited.",
        variant: "destructive"
      });
    }
    
    if (establishmentsError) {
      console.error('Error fetching establishments:', establishmentsError);
      toast({
        title: "Data loading error",
        description: "There was a problem fetching establishments.",
        variant: "destructive"
      });
    }
  }, [locationError, establishmentsError, toast]);

  if (isLoading) {
    return (
      <Layout>
        <MapPageLoading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        <MapPageHeader 
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onApplyFilters={applyFilters}
          viewMode={viewMode}
          onViewModeChange={toggleViewMode}
          isMobile={isMobile}
        />
        
        <div className="flex-1">
          {viewMode === ViewMode.MAP ? (
            <div className="h-full">
              <MapView 
                establishments={establishments}
                userLocation={userLocation}
                onRefreshLocation={refreshLocation}
                isLoadingLocation={isLocating}
              />
            </div>
          ) : (
            <div className="p-2 sm:p-4">
              <EstablishmentList 
                establishments={establishments} 
                selectedEstablishment={null}
                favoriteEstablishments={[]}
                onToggleFavorite={() => {}}
                onEstablishmentClick={() => {}}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
        
        {isMobile && <MobileViewToggle onToggle={toggleViewMode} />}
      </div>
    </Layout>
  );
};

export default MapPage;
