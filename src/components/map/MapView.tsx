import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Map, MapPin, CrosshairIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EstablishmentMarker from './EstablishmentMarker';
import UserLocationMarker from './UserLocationMarker';
import MapControls from './MapControls';
import useMapInitialization from './useMapInitialization';
import BarCrawlRequestModal from '@/components/establishment/BarCrawlRequestModal';
import { TooltipProvider } from '@/components/ui/tooltip';

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
  onMarkerClick?: (establishmentId: string) => void;
  height?: string;
  mapboxToken?: string;
}

const MapView: React.FC<MapViewProps> = ({
  establishments,
  userLocation,
  onRefreshLocation,
  isLoadingLocation,
  singleEstablishmentView = false,
  onMarkerClick,
  height,
  mapboxToken
}) => {
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [isBarCrawlModalOpen, setIsBarCrawlModalOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState('streets-v12');
  const [tokenInput, setTokenInput] = useState('');
  const [customToken, setCustomToken] = useState<string | undefined>(
    mapboxToken || localStorage.getItem('mapbox_token') || undefined
  );
  const { toast } = useToast();
  const { 
    mapContainer, 
    mapInstance, 
    isMapLoaded,
    mapError
  } = useMapInitialization(
    establishments,
    userLocation,
    singleEstablishmentView,
    customToken
  );

  useEffect(() => {
    if (singleEstablishmentView && establishments.length === 1) {
      setSelectedEstablishment(establishments[0]);
    }
  }, [singleEstablishmentView, establishments]);
  
  const handleMarkerClick = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    
    if (onMarkerClick) {
      onMarkerClick(establishment.id);
    }
    
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

  const handleSaveToken = () => {
    if (!tokenInput.trim()) {
      toast({
        title: 'Invalid token',
        description: 'Please enter a valid Mapbox token',
        variant: 'destructive',
      });
      return;
    }
    
    localStorage.setItem('mapbox_token', tokenInput);
    setCustomToken(tokenInput);
    
    toast({
      title: 'Token saved',
      description: 'Mapbox token has been saved',
    });
  };

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstance && userLocation) {
      mapInstance.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 13
      });
    } else if (mapInstance && establishments.length > 0) {
      mapInstance.flyTo({
        center: [establishments[0].longitude, establishments[0].latitude],
        zoom: 12
      });
    }
  };

  const handleToggleMapStyle = () => {
    if (!mapInstance) return;
    
    const newStyle = mapStyle === 'streets-v12' ? 'satellite-v9' : 'streets-v12';
    setMapStyle(newStyle);
    mapInstance.setStyle(`mapbox://styles/mapbox/${newStyle}`);
  };

  return (
    <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: height || (singleEstablishmentView ? '100%' : '600px') }}>
      <div ref={mapContainer} className="h-full w-full" />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <Map className="h-12 w-12 mx-auto text-gray-400 animate-pulse" />
            <p className="mt-2 text-gray-500">Loading map...</p>
            
            {mapError && (
              <div className="mt-4 max-w-md mx-auto">
                <p className="text-red-500 mb-2">{mapError}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Enter your Mapbox token below. You can get one from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">mapbox.com</a> dashboard.</p>
                  <Input
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Enter Mapbox token..."
                    className="bg-white"
                  />
                  <Button onClick={handleSaveToken} className="w-full">
                    Save Token
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!singleEstablishmentView && (
        <TooltipProvider>
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
        </TooltipProvider>
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
      
      {!singleEstablishmentView && (
        <TooltipProvider>
          <MapControls 
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRecenter={handleRecenter}
            onToggleMapStyle={handleToggleMapStyle}
            onRefreshLocation={onRefreshLocation}
            isLoading={isLoadingLocation}
            mapStyle={mapStyle}
          />
        </TooltipProvider>
      )}
    </div>
  );
};

export default MapView;
