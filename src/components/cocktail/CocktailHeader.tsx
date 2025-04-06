
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface CocktailHeaderProps {
  name: string;
  image?: string;
  ingredients?: string[];
  description?: string;
  establishment?: string | { name: string };
  price?: string;
}

const CocktailHeader: React.FC<CocktailHeaderProps> = ({ 
  name, 
  image, 
  ingredients, 
  description, 
  establishment,
  price 
}) => {
  const establishmentName = typeof establishment === 'object' 
    ? establishment.name 
    : establishment;

  return (
    <div className="mb-6">
      <div 
        className="h-64 w-full rounded-xl bg-cover bg-center mb-4"
        style={{ backgroundImage: `url(${image || '/placeholder.svg'})` }}
      />
      
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {ingredients?.map((ingredient: string, i: number) => (
          <Badge key={i} variant="outline" className="bg-material-secondary-container/50">
            {ingredient}
          </Badge>
        ))}
      </div>
      
      <p className="text-material-on-surface">{description}</p>
      
      {(establishmentName || price) && (
        <div className="mt-4 flex items-center text-material-on-surface-variant">
          {establishmentName && (
            <>
              <MapPin size={16} className="mr-1" />
              <span>{establishmentName}</span>
            </>
          )}
          {price && (
            <>
              <span className="mx-2 text-material-on-surface-variant">•</span>
              <span>{price}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CocktailHeader;
