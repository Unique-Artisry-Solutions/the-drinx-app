
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EstablishmentHeroProps {
  establishment: {
    name: string;
    address: string;
    image?: string;
    image_url?: string; // From Supabase
    cocktailCount?: number;
    cocktail_count?: number; // From Supabase
  };
}

const EstablishmentHero: React.FC<EstablishmentHeroProps> = ({ establishment }) => {
  // Handle both image and image_url (from database)
  const imageUrl = establishment.image || establishment.image_url || '/placeholder.svg';
  
  // Handle both cocktailCount (frontend property) and cocktail_count (database property)
  const mocktailCount = establishment.cocktailCount || establishment.cocktail_count || 0;
  
  return (
    <div className="h-48 md:h-64 bg-material-primary/10 rounded-xl bg-cover bg-center relative glow-hover" 
      style={{
        backgroundImage: `url(${imageUrl})`
      }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl"></div>
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex justify-between items-end">
          <div>
            <Badge 
              variant="secondary" 
              className={mocktailCount > 0 
                ? "mb-2 bg-gradient-to-r from-spiritless-green to-spiritless-green-light text-white" 
                : "mb-2 bg-gray-500/80 text-white"}
            >
              {mocktailCount > 0 ? `${mocktailCount} Mocktails` : "No Mocktails Available"}
            </Badge>
            <h1 className="text-3xl font-bold text-white">{establishment.name}</h1>
            <div className="flex items-center mt-1 text-white/90">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{establishment.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentHero;
