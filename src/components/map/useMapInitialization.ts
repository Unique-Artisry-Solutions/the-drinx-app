
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useToast } from '@/hooks/use-toast';

// Set the Mapbox token - make sure this is a valid public token
mapboxgl.accessToken = 'pk.eyJ1IjoidHJhdmFsaXNvMTQiLCJhIjoiY204ODI4bjIwMG5jMTJxcHU2MHBrcmpubyJ9.EoN25lrcBgX-5Fusy-Imeg';

interface UseMapInitializationProps {
  containerRef: React.RefObject<HTMLDivElement>;
  mapStyle: string;
  userLocation?: { latitude: number; longitude: number } | null;
  establishments?: Array<{ longitude: number; latitude: number }>;
  interactive?: boolean;
}

const useMapInitialization = ({
  containerRef,
  mapStyle,
  userLocation,
  establishments = [],
  interactive = true,
}: UseMapInitializationProps) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      console.log("Initializing map with token:", mapboxgl.accessToken);
      
      // Determine initial center position
      let initialCenter: [number, number] = [-74.006, 40.7128]; // Default to NYC
      
      if (userLocation) {
        initialCenter = [userLocation.longitude, userLocation.latitude];
      } else if (establishments.length > 0) {
        initialCenter = [establishments[0].longitude, establishments[0].latitude];
      }
      
      console.log("Map initial center:", initialCenter);
      
      // Initialize map
      mapRef.current = new mapboxgl.Map({
        container: containerRef.current,
        style: mapStyle,
        zoom: 12,
        center: initialCenter,
        attributionControl: true,
      });

      // Disable interactions if not interactive
      if (!interactive) {
        mapRef.current.dragPan.disable();
        mapRef.current.doubleClickZoom.disable();
        mapRef.current.scrollZoom.disable();
        mapRef.current.touchZoomRotate.disable();
      }

      // Set initialization status when map is loaded
      mapRef.current.on('load', () => {
        console.log("Map loaded successfully");
        setMapInitialized(true);
      });

      mapRef.current.on('error', (e) => {
        console.error("Map error:", e);
        toast({
          title: "Map error",
          description: "There was an error loading the map.",
          variant: "destructive"
        });
      });

      // Cleanup function
      return () => {
        console.log("Cleaning up map");
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
          setMapInitialized(false);
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error initializing map",
        description: "Please check your internet connection and try again.",
        variant: "destructive"
      });
    }
  }, [containerRef, interactive, toast]);

  // Update map style when it changes
  useEffect(() => {
    if (mapRef.current && mapInitialized) {
      mapRef.current.setStyle(mapStyle);
    }
  }, [mapStyle, mapInitialized]);

  return { map: mapRef.current, mapInitialized };
};

export default useMapInitialization;
