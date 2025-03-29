
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Establishment {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cocktailCount: number;
}

const useMapInitialization = (
  establishments: Establishment[],
  userLocation: { latitude: number; longitude: number } | null,
  singleEstablishmentView: boolean = false,
  mapboxToken?: string
) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const markerRefs = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Set the token
    const token = mapboxToken || localStorage.getItem('mapbox_token') || 'pk.eyJ1Ijoic3Bpcml0bGVzcy1hcHAiLCJhIjoiY2xsMnV3NGo2MGQxdDNmbW55dHJpaXJjdCJ9.UxBiZHmQg7QKl3mOEfZNEA';
    mapboxgl.accessToken = token;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [userLocation?.longitude || -74.0060, userLocation?.latitude || 40.7128],
        zoom: userLocation ? 13 : 10,
      });
      
      map.current.on('load', () => {
        setIsMapLoaded(true);
        setMapError(null);
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Failed to load map. Please check your Mapbox token.');
      });
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Update markers when establishments or user location changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Remove all existing markers
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};
    
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    
    // Set boundaries for map
    const bounds = new mapboxgl.LngLatBounds();

    // Add markers for establishments
    establishments.forEach(establishment => {
      const el = document.createElement('div');
      el.className = 'establishment-marker';
      el.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-material-primary flex items-center justify-center text-white shadow-lg">
          ${establishment.cocktailCount}
        </div>
      `;
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([establishment.longitude, establishment.latitude])
        .addTo(map.current!);
      
      markerRefs.current[establishment.id] = marker;
      
      // Extend bounds to include this marker
      bounds.extend([establishment.longitude, establishment.latitude]);
    });
    
    // Add user location marker if available
    if (userLocation) {
      const el = document.createElement('div');
      el.className = 'user-marker';
      el.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse"></div>
      `;
      
      userMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map.current);
      
      // Extend bounds to include user location
      bounds.extend([userLocation.longitude, userLocation.latitude]);
    }
    
    // Fit map to bounds - but only once on initial load
    if ((establishments.length > 0 || userLocation) && !initializedRef.current) {
      if (singleEstablishmentView && establishments.length === 1) {
        // For single establishment view, zoom closer
        map.current.flyTo({
          center: [establishments[0].longitude, establishments[0].latitude],
          zoom: 15,
          essential: true
        });
      } else if (bounds.isEmpty()) {
        // Default view if bounds are empty
        map.current.flyTo({
          center: [-74.0060, 40.7128], // NYC
          zoom: 10
        });
      } else {
        // Fit to bounds with padding
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15
        });
      }
      
      // Mark as initialized to prevent continuous zooming
      initializedRef.current = true;
    }
  }, [establishments, userLocation, isMapLoaded, singleEstablishmentView]);

  return {
    mapContainer,
    mapInstance: map.current,
    isMapLoaded,
    mapError
  };
};

export default useMapInitialization;
