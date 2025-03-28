
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MapView from '@/components/MapView';
import BarCrawlControl from '@/components/BarCrawlControl';
import LocationSearch from '@/components/LocationSearch';
import EstablishmentList from '@/components/EstablishmentList';
import ViewModeToggle from '@/components/ViewModeToggle';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments } from '@/data/sampleData';

const MapPage = () => {
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [filteredEstablishments, setFilteredEstablishments] = useState(sampleEstablishments);
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [favoriteEstablishments, setFavoriteEstablishments] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    userLocation, 
    isLoading: isLoadingLocation, 
    refreshLocation,
    calculateDistance,
    formatDistance
  } = useUserLocation();

  // Calculate distances when user location changes
  useEffect(() => {
    if (userLocation && establishments.length > 0) {
      const updatedEstablishments = establishments.map(est => ({
        ...est,
        distance: formatDistance(calculateDistance(est.latitude, est.longitude))
      }));
      
      setEstablishments(updatedEstablishments);
      setFilteredEstablishments(updatedEstablishments);
    }
  }, [userLocation, establishments, calculateDistance, formatDistance]);

  const handleMarkerClick = (establishmentId: string) => {
    setSelectedEstablishment(establishmentId);
    
    // Scroll to the establishment card
    const element = document.getElementById(`establishment-${establishmentId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEstablishmentClick = (establishmentId: string) => {
    // This is handled in the EstablishmentList component
  };

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredEstablishments(establishments);
      return;
    }
    
    const filtered = establishments.filter(est => 
      est.name.toLowerCase().includes(query.toLowerCase()) || 
      est.address.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredEstablishments(filtered);
    
    toast({
      title: `${filtered.length} establishments found`,
      description: filtered.length > 0 
        ? "Results updated based on your search." 
        : "Try a different search term.",
    });
  };

  const toggleFavorite = (establishmentId: string) => {
    if (favoriteEstablishments.includes(establishmentId)) {
      setFavoriteEstablishments(favoriteEstablishments.filter(id => id !== establishmentId));
      toast({
        title: "Removed from favorites",
        description: "Establishment removed from your favorites.",
      });
    } else {
      setFavoriteEstablishments([...favoriteEstablishments, establishmentId]);
      toast({
        title: "Added to favorites",
        description: "Establishment added to your favorites.",
      });
    }
  };

  const saveBarCrawl = (selectedEstablishments: any[]) => {
    // In a real app, this would save to a database or local storage
    console.log('Bar crawl saved:', selectedEstablishments);
    
    // Navigate to profile page to view the bar crawl
    navigate('/profile');
  };

  // Transform establishment data for the map
  const mapEstablishments = filteredEstablishments.map(e => ({
    id: e.id,
    name: e.name,
    latitude: e.latitude,
    longitude: e.longitude,
    cocktailCount: e.cocktailCount,
  }));

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-material-on-background">Nearby Map</h1>
            <p className="text-material-on-surface-variant">
              Find spirit-free cocktails around you
            </p>
          </div>
          
          <ViewModeToggle 
            viewMode={viewMode} 
            onViewModeChange={setViewMode} 
          />
        </div>

        <LocationSearch onSearch={handleSearch} />
        
        <BarCrawlControl 
          establishments={establishments} 
          onSaveBarCrawl={saveBarCrawl} 
        />

        {viewMode === 'map' && (
          <MapView 
            establishments={mapEstablishments}
            userLocation={userLocation}
            onMarkerClick={handleMarkerClick}
            onRefreshLocation={refreshLocation}
            isLoadingLocation={isLoadingLocation}
          />
        )}

        <EstablishmentList 
          establishments={filteredEstablishments}
          selectedEstablishment={selectedEstablishment}
          favoriteEstablishments={favoriteEstablishments}
          onToggleFavorite={toggleFavorite}
          onEstablishmentClick={handleEstablishmentClick}
        />
      </div>
    </Layout>
  );
};

export default MapPage;
