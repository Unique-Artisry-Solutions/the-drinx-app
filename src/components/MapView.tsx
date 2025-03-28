
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from '@/hooks/use-toast';
import MapControls from './MapControls';

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
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();
  const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/light-v11');
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);
  
  // Set the Mapbox token directly
  const mapboxToken = 'pk.eyJ1IjoidHJhdmFsaXNvMTQiLCJhIjoiY204ODI4bjIwMG5jMTJxcHU2MHBrcmpubyJ9.EoN25lrcBgX-5Fusy-Imeg';

  // Map control handlers
  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (map.current) {
      if (userLocation) {
        map.current.flyTo({
          center: [userLocation.longitude, userLocation.latitude],
          zoom: 13,
          duration: 1000
        });
      } else if (establishments.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        establishments.forEach(establishment => {
          bounds.extend([establishment.longitude, establishment.latitude]);
        });
        
        map.current.fitBounds(bounds, {
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
    
    if (map.current) {
      map.current.setStyle(newStyle);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        zoom: 12,
        center: userLocation 
          ? [userLocation.longitude, userLocation.latitude] 
          : establishments.length > 0 
            ? [establishments[0].longitude, establishments[0].latitude]
            : [-74.006, 40.7128], // Default to NYC
      });

      // Remove default navigation controls as we're providing our own
      if (!interactive) {
        map.current.dragPan.disable();
        map.current.doubleClickZoom.disable();
        map.current.scrollZoom.disable();
        map.current.touchZoomRotate.disable();
      }

      map.current.on('load', () => {
        setMapInitialized(true);
      });

      // Cleanup
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
          setMapInitialized(false);
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error initializing map",
        description: "Please check your Mapbox token and try again.",
        variant: "destructive"
      });
    }
  }, [mapContainer, mapboxToken, mapStyle, interactive, toast]);

  // Update map when user location or establishments change
  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    // Add user location marker if available
    if (userLocation) {
      const userMarkerElement = document.createElement('div');
      userMarkerElement.className = 'w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center';
      userMarkerElement.innerHTML = '<span class="animate-pulse w-3 h-3 bg-white rounded-full"></span>';
      
      userMarkerRef.current = new mapboxgl.Marker(userMarkerElement)
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map.current);
    }

    // Add establishment markers
    establishments.forEach(establishment => {
      const el = document.createElement('div');
      el.className = 'flex items-center justify-center';
      el.innerHTML = `
        <div class="w-8 h-8 bg-material-primary text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform duration-200 hover:scale-110">
          <span class="text-xs font-bold">${establishment.cocktailCount}</span>
        </div>
      `;
      
      el.addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(establishment.id);
        }
      });
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([establishment.longitude, establishment.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<p class="font-medium">${establishment.name}</p>`)
        )
        .addTo(map.current!);
        
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
        map.current.fitBounds(bounds, {
          padding: 70,
          maxZoom: 15,
          duration: 1000
        });
      }
    }
  }, [establishments, userLocation, mapInitialized, onMarkerClick]);

  // Update map style when it changes
  useEffect(() => {
    if (map.current && mapInitialized) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle, mapInitialized]);

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
