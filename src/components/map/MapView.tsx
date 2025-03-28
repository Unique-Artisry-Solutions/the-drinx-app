
import React, { useRef, useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapControls from '@/components/map/MapControls';
import useMapInitialization from './useMapInitialization';
import UserLocationMarker from './UserLocationMarker';
import EstablishmentMarker from './EstablishmentMarker';
import { useToast } from '@/hooks/use-toast';

interface MapViewProps {
  establishments?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    cocktailCount: number;
  }[];
  userLocation?: { latitude: number; longitude: number } | null;
  height?: string;
  interactive?: boolean;
  onMarkerClick?: (establishmentId: string) => void;
  onRefreshLocation?: () => void;
  isLoadingLocation?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  establishments = [],
  userLocation = null,
  height = 'h-[50vh]',
  interactive = true,
  onMarkerClick,
  onRefreshLocation,
  isLoadingLocation = false,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/light-v11');
  const animationRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Use custom hook for map initialization
  const { map, mapInitialized } = useMapInitialization({
    containerRef: mapContainer,
    mapStyle,
    userLocation,
    establishments,
    interactive,
  });

  // Map control handlers
  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (map) {
      if (userLocation) {
        // Focus on user location with animation
        map.flyTo({
          center: [userLocation.longitude, userLocation.latitude],
          zoom: 14,
          duration: 1000
        });
      } else if (establishments.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        establishments.forEach(establishment => {
          bounds.extend([establishment.longitude, establishment.latitude]);
        });
        
        map.fitBounds(bounds, {
          padding: 70,
          maxZoom: 15,
          duration: 1000
        });
      }
    }
  };

  const handleToggleMapStyle = () => {
    const newStyle = mapStyle === 'mapbox://styles/mapbox/light-v11' 
      ? 'mapbox://styles/mapbox/dark-v11'
      : 'mapbox://styles/mapbox/light-v11';
    
    setMapStyle(newStyle);
  };

  // Update markers when user location or establishments change
  useEffect(() => {
    if (!map || !mapInitialized) {
      console.log("Map not ready for markers:", { map, mapInitialized });
      return;
    }

    console.log("Updating markers:", { 
      establishments: establishments.length, 
      userLocation: !!userLocation 
    });

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Add user location marker if available
    if (userLocation) {
      userMarkerRef.current = UserLocationMarker({ map, userLocation });
      
      // Center map on user location immediately when user location becomes available
      map.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 14,
        duration: 1000
      });
    }

    // Add establishment markers
    establishments.forEach(establishment => {
      const marker = EstablishmentMarker({ 
        map, 
        establishment, 
        onMarkerClick 
      });
        
      markersRef.current[establishment.id] = marker;
    });
    
    // Cancel any existing animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [establishments, userLocation, mapInitialized, onMarkerClick, map]);

  // When user location changes, center map on user location
  useEffect(() => {
    if (map && userLocation) {
      map.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 14,
        duration: 1000
      });
    }
  }, [userLocation, map]);

  // Cleanup animation frame when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  // Handle errors and show fallback UI if map fails to load
  if (!mapboxgl.supported()) {
    return (
      <div className={`${height} rounded-xl bg-gray-100 flex items-center justify-center text-center p-4`}>
        <div>
          <p className="text-gray-700 mb-2">Your browser doesn't support Mapbox GL</p>
          <p className="text-sm text-gray-500">Try using a more recent browser version</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${height} rounded-xl overflow-hidden elevation-2 relative`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {interactive && map && (
        <MapControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRecenter={handleRecenter}
          onToggleMapStyle={handleToggleMapStyle}
          onRefreshLocation={onRefreshLocation || (() => {})}
          isLoading={isLoadingLocation}
          mapStyle={mapStyle}
        />
      )}
    </div>
  );
};

export default MapView;
