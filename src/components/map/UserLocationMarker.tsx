
import React from 'react';
import mapboxgl from 'mapbox-gl';

interface UserLocationMarkerProps {
  map: mapboxgl.Map;
  userLocation: { latitude: number; longitude: number };
}

const UserLocationMarker = ({ map, userLocation }: UserLocationMarkerProps) => {
  // Create marker element
  const userMarkerElement = document.createElement('div');
  userMarkerElement.className = 'w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center';
  userMarkerElement.innerHTML = '<span class="animate-pulse w-3 h-3 bg-white rounded-full"></span>';
  
  // Create and add marker to map
  const marker = new mapboxgl.Marker(userMarkerElement)
    .setLngLat([userLocation.longitude, userLocation.latitude])
    .addTo(map);
    
  return marker;
};

export default UserLocationMarker;
