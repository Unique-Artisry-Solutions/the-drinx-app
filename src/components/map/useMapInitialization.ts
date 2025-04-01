
import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Establishment } from './MapViewTypes';

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

  // Initialize map with the given token
  const initializeMap = useCallback(() => {
    if (!mapContainer.current) return;
    
    try {
      // Set the token
      const token = mapboxToken || localStorage.getItem('mapbox_token') || 'pk.eyJ1Ijoic3Bpcml0bGVzcy1hcHAiLCJhIjoiY2xsMnV3NGo2MGQxdDNmbW55dHJpaXJjdCJ9.UxBiZHmQg7QKl3mOEfZNEA';
      mapboxgl.accessToken = token;
      
      // Create the map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [userLocation?.longitude || -74.0060, userLocation?.latitude || 40.7128],
        zoom: userLocation ? 13 : 10,
      });
      
      // Setup event listeners
      setupMapEventListeners();
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
    }
  }, [mapboxToken, userLocation]);

  // Set up event listeners for the map
  const setupMapEventListeners = useCallback(() => {
    if (!map.current) return;
    
    map.current.on('load', () => {
      setIsMapLoaded(true);
      setMapError(null);
    });
    
    map.current.on('error', (e) => {
      console.error('Mapbox error:', e);
      setMapError('Failed to load map. Please check your Mapbox token.');
    });
  }, []);

  // Create a marker element for an establishment
  const createEstablishmentMarkerElement = useCallback((establishment: Establishment) => {
    const el = document.createElement('div');
    el.className = 'establishment-marker';
    el.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-material-primary flex items-center justify-center text-white shadow-lg">
        ${establishment.cocktailCount}
      </div>
    `;
    return el;
  }, []);

  // Create a marker element for the user location
  const createUserMarkerElement = useCallback(() => {
    const el = document.createElement('div');
    el.className = 'user-marker';
    el.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse"></div>
    `;
    return el;
  }, []);

  // Add markers for all establishments
  const addEstablishmentMarkers = useCallback((bounds: mapboxgl.LngLatBounds) => {
    if (!map.current || !isMapLoaded) return;
    
    establishments.forEach(establishment => {
      const el = createEstablishmentMarkerElement(establishment);
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([establishment.longitude, establishment.latitude])
        .addTo(map.current!);
      
      markerRefs.current[establishment.id] = marker;
      
      // Extend bounds to include this marker
      bounds.extend([establishment.longitude, establishment.latitude]);
    });
  }, [establishments, isMapLoaded, createEstablishmentMarkerElement]);

  // Add a marker for the user's location
  const addUserLocationMarker = useCallback((bounds: mapboxgl.LngLatBounds) => {
    if (!map.current || !userLocation || !isMapLoaded) return;
    
    const el = createUserMarkerElement();
    
    userMarkerRef.current = new mapboxgl.Marker(el)
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map.current);
    
    // Extend bounds to include user location
    bounds.extend([userLocation.longitude, userLocation.latitude]);
  }, [userLocation, isMapLoaded, createUserMarkerElement]);

  // Set the map view based on markers and settings
  const setMapView = useCallback((bounds: mapboxgl.LngLatBounds) => {
    if (!map.current || !isMapLoaded || initializedRef.current) return;
    
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
  }, [establishments, isMapLoaded, singleEstablishmentView]);

  // Clear all markers from the map
  const clearMarkers = useCallback(() => {
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};
    
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, []);

  // Initialize the map
  useEffect(() => {
    initializeMap();
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initializeMap]);

  // Update markers when establishments or user location changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Clear existing markers
    clearMarkers();
    
    // Create bounds object for positioning the map
    const bounds = new mapboxgl.LngLatBounds();

    // Add establishment markers
    addEstablishmentMarkers(bounds);
    
    // Add user location marker if available
    addUserLocationMarker(bounds);
    
    // Set the map view based on markers
    setMapView(bounds);
  }, [
    establishments, 
    userLocation, 
    isMapLoaded, 
    singleEstablishmentView, 
    clearMarkers, 
    addEstablishmentMarkers, 
    addUserLocationMarker, 
    setMapView
  ]);

  return {
    mapContainer,
    mapInstance: map.current,
    isMapLoaded,
    mapError
  };
};

export default useMapInitialization;
