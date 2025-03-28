
import React from 'react';
import mapboxgl from 'mapbox-gl';

interface EstablishmentMarkerProps {
  map: mapboxgl.Map;
  establishment: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    cocktailCount: number;
  };
  onMarkerClick?: (establishmentId: string) => void;
}

const EstablishmentMarker = ({ 
  map, 
  establishment, 
  onMarkerClick 
}: EstablishmentMarkerProps) => {
  // Create marker element
  const el = document.createElement('div');
  el.className = 'flex items-center justify-center';
  el.innerHTML = `
    <div class="w-8 h-8 bg-material-primary text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform duration-200 hover:scale-110">
      <span class="text-xs font-bold">${establishment.cocktailCount}</span>
    </div>
  `;
  
  // Add click event listener
  el.addEventListener('click', () => {
    if (onMarkerClick) {
      onMarkerClick(establishment.id);
    }
  });
  
  // Create and add marker to map
  const marker = new mapboxgl.Marker(el)
    .setLngLat([establishment.longitude, establishment.latitude])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<p class="font-medium">${establishment.name}</p>`)
    )
    .addTo(map);
    
  return marker;
};

export default EstablishmentMarker;
