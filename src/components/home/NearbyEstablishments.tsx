
import React from 'react';
import EstablishmentCard from '@/components/EstablishmentCard';

interface Establishment {
  id: string;
  name: string;
  address: string;
  distance?: string;
  cocktailCount: number;
  image?: string;
  latitude: number;
  longitude: number;
}

interface NearbyEstablishmentsProps {
  establishments: Establishment[];
  onViewMap: () => void;
}

const NearbyEstablishments: React.FC<NearbyEstablishmentsProps> = ({ 
  establishments,
  onViewMap
}) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-material-on-surface">Nearby Establishments</h2>
        <button 
          className="text-sm text-material-primary" 
          onClick={onViewMap}
        >
          View map
        </button>
      </div>
      
      <div className="space-y-3">
        {establishments.slice(0, 5).map(establishment => (
          <EstablishmentCard 
            key={establishment.id} 
            id={establishment.id} 
            name={establishment.name} 
            address={establishment.address} 
            distance={establishment.distance} 
            cocktailCount={establishment.cocktailCount} 
            image={establishment.image} 
          />
        ))}
      </div>
    </section>
  );
};

export default NearbyEstablishments;
