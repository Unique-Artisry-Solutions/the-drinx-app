
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
}

const MapView: React.FC<MapViewProps> = ({
  establishments = [],
  userLocation = null,
  height = 'h-[50vh]',
  interactive = true,
  onMarkerClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const { toast } = useToast();
  
  // Set the Mapbox token directly
  const mapboxToken = 'pk.eyJ1IjoidHJhdmFsaXNvMTQiLCJhIjoiY204ODI4bjIwMG5jMTJxcHU2MHBrcmpubyJ9.EoN25lrcBgX-5Fusy-Imeg';

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 12,
        center: userLocation 
          ? [userLocation.longitude, userLocation.latitude] 
          : establishments.length > 0 
            ? [establishments[0].longitude, establishments[0].latitude]
            : [-74.006, 40.7128], // Default to NYC
      });

      // Add navigation controls if interactive
      if (interactive) {
        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'top-right'
        );
      }

      // Setup map
      map.current.on('load', () => {
        if (!map.current) return;

        // Add user location marker if available
        if (userLocation) {
          const userMarkerElement = document.createElement('div');
          userMarkerElement.className = 'w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center';
          userMarkerElement.innerHTML = '<span class="animate-pulse w-3 h-3 bg-white rounded-full"></span>';
          
          new mapboxgl.Marker(userMarkerElement)
            .setLngLat([userLocation.longitude, userLocation.latitude])
            .addTo(map.current);
            
          // Add pulse effect around user location
          map.current.addSource('user-location', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [userLocation.longitude, userLocation.latitude],
              },
              properties: {},
            },
          });
          
          map.current.addLayer({
            id: 'user-location-pulse',
            type: 'circle',
            source: 'user-location',
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 20, 22, 60],
              'circle-color': '#3B82F6',
              'circle-opacity': 0.2,
              'circle-opacity-transition': { duration: 1000 },
              'circle-stroke-width': 2,
              'circle-stroke-color': '#3B82F6',
              'circle-stroke-opacity': 0.5,
            },
          });
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
        if (establishments.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          
          // Add establishments to bounds
          establishments.forEach(establishment => {
            bounds.extend([establishment.longitude, establishment.latitude]);
          });
          
          // Add user location to bounds if available
          if (userLocation) {
            bounds.extend([userLocation.longitude, userLocation.latitude]);
          }
          
          map.current.fitBounds(bounds, {
            padding: 70,
            maxZoom: 15,
            duration: 1000
          });
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error initializing map",
        description: "Please check your Mapbox token and try again.",
        variant: "destructive"
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [establishments, userLocation, mapboxToken, interactive, onMarkerClick, toast]);

  return (
    <div className={`${height} rounded-xl overflow-hidden elevation-2`}>
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapView;
