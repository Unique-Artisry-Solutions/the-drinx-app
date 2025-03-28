
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import MapView from '@/components/MapView';
import EstablishmentCard from '@/components/EstablishmentCard';
import BarCrawlControl from '@/components/BarCrawlControl';
import LocationSearch from '@/components/LocationSearch';
import { useToast } from '@/hooks/use-toast';
import { Heart, Filter, Map, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Sample data - would be fetched from API in a real application
import { sampleEstablishments } from '@/data/sampleData';

const MapPage = () => {
  const [establishments, setEstablishments] = useState(sampleEstablishments);
  const [filteredEstablishments, setFilteredEstablishments] = useState(sampleEstablishments);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [favoriteEstablishments, setFavoriteEstablishments] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
          toast({
            title: "Location access denied",
            description: "Enable location services to find nearby establishments.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  const handleMarkerClick = (establishmentId: string) => {
    setSelectedEstablishment(establishmentId);
    
    // Scroll to the establishment card
    const element = document.getElementById(`establishment-${establishmentId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEstablishmentClick = (establishmentId: string) => {
    navigate(`/establishment/${establishmentId}`);
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
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'map' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map size={16} className="mr-2" />
              Map
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List size={16} className="mr-2" />
              List
            </Button>
          </div>
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
          />
        )}

        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-material-on-surface">
              {userLocation ? 'Nearby Establishments' : 'All Establishments'}
            </h2>
            
            <Badge variant="outline">
              {filteredEstablishments.length} {filteredEstablishments.length === 1 ? 'Result' : 'Results'}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {filteredEstablishments.map((establishment) => (
              <div 
                id={`establishment-${establishment.id}`}
                key={establishment.id}
                className={`relative ${selectedEstablishment === establishment.id ? 'animate-pulse-subtle' : ''}`}
              >
                <EstablishmentCard
                  id={establishment.id}
                  name={establishment.name}
                  address={establishment.address}
                  distance={establishment.distance}
                  cocktailCount={establishment.cocktailCount}
                  image={establishment.image}
                  onClick={() => handleEstablishmentClick(establishment.id)}
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(establishment.id);
                  }}
                >
                  <Heart 
                    size={16} 
                    className={favoriteEstablishments.includes(establishment.id) ? "fill-red-500 text-red-500" : ""}
                  />
                </Button>
              </div>
            ))}
            
            {filteredEstablishments.length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-material-on-surface-variant">No establishments found matching your criteria.</p>
                <Button
                  variant="link"
                  onClick={() => setFilteredEstablishments(establishments)}
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
