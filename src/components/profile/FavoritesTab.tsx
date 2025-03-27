
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
}

interface Cocktail {
  id: string;
  name: string;
  price: number | string;
  establishment: string | { name: string };
}

interface FavoritesTabProps {
  favoriteCocktails: Cocktail[];
}

const FavoritesTab: React.FC<FavoritesTabProps> = ({ favoriteCocktails }) => {
  return (
    <div className="space-y-4">
      <h2 className="font-medium">My Favorite Mocktails</h2>
      
      {favoriteCocktails.map((cocktail) => {
        // Format price properly
        let displayPrice: string;
        if (typeof cocktail.price === 'number') {
          displayPrice = (cocktail.price as number).toFixed(2);
        } else if (typeof cocktail.price === 'string') {
          displayPrice = cocktail.price.replace('$', '');
        } else {
          displayPrice = '0.00';
        }
        
        // Handle establishment that could be an object or string
        let establishmentName: string;
        if (typeof cocktail.establishment === 'object' && cocktail.establishment !== null) {
          establishmentName = cocktail.establishment.name;
        } else if (typeof cocktail.establishment === 'string') {
          establishmentName = cocktail.establishment;
        } else {
          establishmentName = 'Unknown';
        }
        
        return (
          <Card key={cocktail.id} className="relative">
            <CardContent className="p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-material-primary/10 flex items-center justify-center mr-3">
                <Star size={16} className="text-material-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{cocktail.name}</h3>
                <div className="flex items-center text-sm text-material-on-surface-variant">
                  <span>{establishmentName} · ${displayPrice}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FavoritesTab;
