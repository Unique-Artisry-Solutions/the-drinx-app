
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, CrosshairIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EstablishmentMarker from './EstablishmentMarker';
import UserLocationMarker from './UserLocationMarker';
import MapControls from './MapControls';
import useMapInitialization from './useMapInitialization';
import BarCrawlRequestModal from '@/components/establishment/BarCrawlRequestModal';

interface Establishment {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cocktailCount: number;
}

interface MapViewProps {
  establishments: Establishment[];
  userLocation: { latitude: number; longitude: number } | null;
  onRefreshLocation: () => void;
  isLoadingLocation: boolean;
  singleEstablishmentView?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  establishments,
  userLocation,
  onRefreshLocation,
  isLoadingLocation,
  singleEstablishmentView = false
}) => {
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [isBarCrawlModalOpen, setIsBarCrawlModalOpen] = useState(false);
  const { toast } = useToast();
  const { mapContainer, mapInstance, isMapLoaded } = useMapInitialization(
    establishments,
    userLocation,
    singleEstablishmentView
  );

  // When in single establishment view, auto-select the establishment
  useEffect(() => {
    if (singleEstablishmentView && establishments.length === 1) {
      setSelectedEstablishment(establishments[0]);
    }
  }, [singleEstablishmentView, establishments]);
  
  const handleMarkerClick = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    
    // Center map on establishment
    if (mapInstance) {
      mapInstance.flyTo({
        center: [establishment.longitude, establishment.latitude],
        zoom: 15,
        speed: 1.2
      });
    }
  };
  
  const handleRequestBarCrawl = () => {
    if (!selectedEstablishment) return;
    
    if (!localStorage.getItem('user_authenticated')) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to request bar crawl participation',
        variant: 'destructive',
      });
      return;
    }
    
    setIsBarCrawlModalOpen(true);
  };

  return (
    <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: singleEstablishmentView ? '100%' : '600px' }}>
      <div ref={mapContainer} className="h-full w-full" />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Map className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
            <p className="mt-2 text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
      
      {!singleEstablishmentView && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            size="sm"
            variant="outline" 
            className="bg-white"
            onClick={onRefreshLocation}
            disabled={isLoadingLocation}
          >
            <CrosshairIcon className="h-4 w-4 mr-2" />
            {isLoadingLocation ? 'Locating...' : 'My Location'}
          </Button>
        </div>
      )}
      
      {selectedEstablishment && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white p-3 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{selectedEstablishment.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {selectedEstablishment.cocktailCount} Mocktails
                </Badge>
              </div>
              
              {!singleEstablishmentView && (
                <Button size="sm" onClick={handleRequestBarCrawl}>
                  Request Bar Crawl
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {isBarCrawlModalOpen && selectedEstablishment && (
        <BarCrawlRequestModal
          isOpen={isBarCrawlModalOpen}
          onClose={() => setIsBarCrawlModalOpen(false)}
          establishment={selectedEstablishment}
        />
      )}
      
      {!singleEstablishmentView && <MapControls />}
    </div>
  );
};

export default MapView;
