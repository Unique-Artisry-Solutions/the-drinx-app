
import React, { useRef, useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapControls from '@/components/MapControls';
import useMapInitialization from './useMapInitialization';
import UserLocationMarker from './UserLocationMarker';
import EstablishmentMarker from './EstablishmentMarker';

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
        map.flyTo({
          center: [userLocation.longitude, userLocation.latitude],
          zoom: 13,
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
    if (!map || !mapInitialized) return;

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

    // Fit bounds to include all markers if establishments exist
    if (establishments.length > 0 || userLocation) {
      const bounds = new mapboxgl.LngLatBounds();
      
      // Add establishments to bounds
      establishments.forEach(establishment => {
        bounds.extend([establishment.longitude, establishment.latitude]);
      });
      
      // Add user location to bounds if available
      if (userLocation) {
        bounds.extend([userLocation.longitude, userLocation.latitude]);
      }
      
      // Only fit bounds if we have coordinates to fit
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 70,
          maxZoom: 15,
          duration: 1000
        });
      }
    }
    
    // Cancel any existing animation frame
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [establishments, userLocation, mapInitialized, onMarkerClick, map]);

  // Cleanup animation frame when component unmounts
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`${height} rounded-xl overflow-hidden elevation-2 relative`}>
      <div ref={mapContainer} className="w-full h-full" />
      
      {interactive && (
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
