
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MapView from '@/components/map/MapView';
import BarCrawlControl from '@/components/BarCrawlControl';
import LocationSearch from '@/components/LocationSearch';
import EstablishmentList from '@/components/EstablishmentList';
import ViewModeToggle from '@/components/ViewModeToggle';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useEstablishments } from '@/hooks/useEstablishments';
import { useFavorites } from '@/hooks/useFavorites';

const MapPage = () => {
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [mapboxToken, setMapboxToken] = useState<string | null>(localStorage.getItem('mapbox_token'));
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    userLocation,
    isLoading: isLoadingLocation,
    refreshLocation
  } = useUserLocation();
  
  const { 
    establishments, 
    filteredEstablishments, 
    isLoading: isLoadingEstablishments,
    handleSearch
  } = useEstablishments();
  
  const { 
    favoriteEstablishments, 
    toggleFavorite 
  } = useFavorites();

  // Listen for storage events to detect token changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('mapbox_token');
      setMapboxToken(token);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleMarkerClick = (establishmentId: string) => {
    setSelectedEstablishment(establishmentId);

    // Scroll to the establishment card
    const element = document.getElementById(`establishment-${establishmentId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  
  const handleEstablishmentClick = (establishmentId: string) => {
    // This is handled in the EstablishmentList component
  };
  
  const saveBarCrawl = async (selectedEstablishments: any[]) => {
    try {
      // In a real app with Supabase integration, this would save to Supabase
      console.log('Bar crawl saved:', selectedEstablishments);
      
      // Store bar crawl in localStorage for now
      const barCrawls = JSON.parse(localStorage.getItem('barCrawls') || '[]');
      barCrawls.push({
        id: Date.now().toString(),
        establishments: selectedEstablishments,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('barCrawls', JSON.stringify(barCrawls));
      
      toast({
        title: "Bar crawl saved!",
        description: `Your bar crawl with ${selectedEstablishments.length} establishments has been saved.`,
      });

      // Navigate to profile page to view the bar crawl
      navigate('/profile');
    } catch (error) {
      console.error('Error saving bar crawl:', error);
      toast({
        title: "Error saving bar crawl",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Transform establishment data for the map
  const mapEstablishments = filteredEstablishments.map(e => ({
    id: e.id,
    name: e.name,
    latitude: e.latitude,
    longitude: e.longitude,
    cocktailCount: e.cocktailCount
  }));
  
  return <Layout>
      <div className="animate-fade-in mx-[5%]">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-material-on-background">Nearby Map</h1>
            <p className="text-material-on-surface-variant">
              Find spirit-free cocktails around you
            </p>
          </div>
          
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>

        <LocationSearch onSearch={handleSearch} />
        
        <BarCrawlControl establishments={establishments} onSaveBarCrawl={saveBarCrawl} />

        {viewMode === 'map' && (
          <MapView 
            establishments={mapEstablishments} 
            userLocation={userLocation} 
            onRefreshLocation={refreshLocation} 
            isLoadingLocation={isLoadingLocation} 
            onMarkerClick={handleMarkerClick} 
            mapboxToken={mapboxToken || undefined} 
          />
        )}

        <EstablishmentList 
          establishments={filteredEstablishments} 
          selectedEstablishment={selectedEstablishment} 
          favoriteEstablishments={favoriteEstablishments} 
          onToggleFavorite={toggleFavorite} 
          onEstablishmentClick={handleEstablishmentClick} 
          isLoading={isLoadingEstablishments}
        />
      </div>
    </Layout>;
};

export default MapPage;
