import React, { useState, useEffect } from 'react';
import { Grid } from 'lucide-react';
import Layout from '@/components/Layout';
import SearchFilter from '@/components/SearchFilter';
import EstablishmentList from '@/components/EstablishmentList';
import MapView from '@/components/map/MapView';
import ViewModeToggle from '@/components/ViewModeToggle';
import { useEstablishments } from '@/hooks/useEstablishments';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { EstablishmentWithDistance } from '@/types/establishment';

enum ViewMode {
  Map = 'map',
  List = 'list'
}

const MapPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<ViewMode>(isMobile ? ViewMode.List : ViewMode.Map);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const { 
    userLocation, 
    isLoading: isLocating, 
    error: locationError, 
    refreshLocation 
  } = useUserLocation();
  
  const { 
    establishments: supabaseEstablishments, 
    isLoading,
    error: establishmentsError,
    filterEstablishments,
    performSearch 
  } = useEstablishments({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    searchTerm: searchTerm,
  });

  const establishments: EstablishmentWithDistance[] = supabaseEstablishments.map(est => {
    const distanceValue = typeof est.distance_in_miles !== 'undefined' ? 
      est.distance_in_miles : 
      (typeof est.distanceValue !== 'undefined' ? est.distanceValue : 0);

    return {
      id: est.id,
      name: est.name,
      address: est.address,
      latitude: est.latitude,
      longitude: est.longitude,
      cocktailCount: est.cocktail_count || est.cocktailCount || 0,
      image: est.image_url || est.image,
      distanceValue,
      distance: typeof est.distance === 'string' ? est.distance : `${distanceValue} mi`
    };
  });

  useEffect(() => {
    if (isMobile) {
      setViewMode(ViewMode.List);
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
    setViewMode(prevMode => prevMode === ViewMode.Map ? ViewMode.List : ViewMode.Map);
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
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="p-2 sm:p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Explore Mocktails</h1>
            {!isMobile && (
              <ViewModeToggle 
                viewMode={viewMode.toLowerCase() as 'map' | 'list'} 
                onViewModeChange={(mode) => setViewMode(mode === 'map' ? ViewMode.Map : ViewMode.List)} 
              />
            )}
          </div>
          <SearchFilter 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onApplyFilters={applyFilters}
            initialSearchTerm={searchTerm}
          />
        </div>
        
        <div className="flex-1">
          {viewMode === ViewMode.Map ? (
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
        
        {isMobile && (
          <div className="fixed bottom-20 right-4">
            <button 
              onClick={toggleViewMode}
              className="bg-material-primary text-white p-3 rounded-full shadow-lg"
              aria-label="Toggle view mode"
            >
              <Grid size={24} />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MapPage;
