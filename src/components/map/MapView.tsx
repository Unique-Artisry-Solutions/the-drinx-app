
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import BarCrawlRequestModal from '@/components/establishment/BarCrawlRequestModal';
import useMapInitialization from './useMapInitialization';
import MapControls from './MapControls';
import MapLoading from './MapLoading';
import EstablishmentInfoCard from './EstablishmentInfoCard';
import { MapViewProps, Establishment } from './MapViewTypes';

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

  const handleMapControls = {
    handleZoomIn: () => {
      if (mapInstance) {
        mapInstance.zoomIn();
      }
    },
    handleZoomOut: () => {
      if (mapInstance) {
        mapInstance.zoomOut();
      }
    },
    handleRecenter: () => {
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
    },
    handleToggleMapStyle: () => {
      if (!mapInstance) return;
      
      const newStyle = mapStyle === 'streets-v12' ? 'satellite-v9' : 'streets-v12';
      setMapStyle(newStyle);
      mapInstance.setStyle(`mapbox://styles/mapbox/${newStyle}`);
    }
  };

  return (
    <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ height: height || (singleEstablishmentView ? '100%' : '600px') }}>
      <div ref={mapContainer} className="h-full w-full" />
      
      {!isMapLoaded && (
        <MapLoading 
          mapError={mapError} 
          tokenInput={tokenInput}
          setTokenInput={setTokenInput}
          handleSaveToken={handleSaveToken}
        />
      )}
      
      <TooltipProvider>
        {!singleEstablishmentView && isMapLoaded && (
          <div className="absolute top-4 right-4 z-10">
            <button
              className="bg-white p-2 rounded-md shadow-md flex items-center text-sm"
              onClick={onRefreshLocation}
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? 'Locating...' : 'My Location'}
            </button>
          </div>
        )}
      
        {selectedEstablishment && (
          <EstablishmentInfoCard 
            establishment={selectedEstablishment}
            singleEstablishmentView={singleEstablishmentView}
            onRequestBarCrawl={handleRequestBarCrawl}
          />
        )}
        
        {!singleEstablishmentView && (
          <MapControls 
            onZoomIn={handleMapControls.handleZoomIn}
            onZoomOut={handleMapControls.handleZoomOut}
            onRecenter={handleMapControls.handleRecenter}
            onToggleMapStyle={handleMapControls.handleToggleMapStyle}
            onRefreshLocation={onRefreshLocation}
            isLoading={isLoadingLocation}
            mapStyle={mapStyle}
          />
        )}
      </TooltipProvider>
      
      {isBarCrawlModalOpen && selectedEstablishment && (
        <BarCrawlRequestModal
          isOpen={isBarCrawlModalOpen}
          onClose={() => setIsBarCrawlModalOpen(false)}
          establishment={selectedEstablishment}
        />
      )}
    </div>
  );
};

export default MapView;
