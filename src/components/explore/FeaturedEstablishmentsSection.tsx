
import React from 'react';
import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';
import EstablishmentCard from '@/components/EstablishmentCard';

interface Establishment {
  id: string;
  name: string;
  address: string;
  image?: string;
  distance?: string;
  cocktailCount: number;
}

interface FeaturedEstablishmentsSectionProps {
  establishments: Establishment[];
}

const FeaturedEstablishmentsSection: React.FC<FeaturedEstablishmentsSectionProps> = ({ 
  establishments 
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Building className="h-5 w-5 mr-2 text-spiritless-pink" />
          Featured Establishments
        </h2>
        <Link to="/map" className="text-sm text-spiritless-pink hover:underline">
          View all
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {establishments.slice(0, 4).map((establishment) => (
          <EstablishmentCard 
            key={establishment.id}
            id={establishment.id}
            name={establishment.name}
            address={establishment.address}
            image={establishment.image}
            distance={establishment.distance}
            cocktailCount={establishment.cocktailCount}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedEstablishmentsSection;
