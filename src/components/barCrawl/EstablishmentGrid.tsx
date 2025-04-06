
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
  address: string;
  image?: string;
  cocktailCount?: number;
  distance?: string;
}

interface EstablishmentGridProps {
  establishments: Establishment[];
}

const EstablishmentGrid: React.FC<EstablishmentGridProps> = ({ establishments }) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {establishments.map((establishment) => (
        <Card key={establishment.id} className="overflow-hidden hover:shadow-md transition-shadow h-full">
          <Link to={`/establishment/${establishment.id}`} className="flex flex-col h-full" onClick={scrollToTop}>
            <div className="h-32 bg-gray-200 relative">
              {establishment.image ? (
                <img 
                  src={establishment.image} 
                  alt={establishment.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No image available
                </div>
              )}
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="font-semibold text-base mb-1 line-clamp-1 text-left">{establishment.name}</h3>
              <p className="text-gray-600 text-xs flex items-start mb-2 text-left">
                <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{establishment.address}</span>
              </p>
              <div className="flex justify-between items-center mt-auto pt-2 text-xs text-gray-500">
                <span>
                  {establishment.cocktailCount || 0} cocktails
                </span>
                {establishment.distance && (
                  <span className="text-white text-[10px] px-1.5 py-0.5 rounded-full bg-gray-500/50">
                    {establishment.distance}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default EstablishmentGrid;
