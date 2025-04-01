
import React from 'react';
import { Link } from 'react-router-dom';
import { FavoritesTabProps } from '@/types/ProfileTypes';
import CocktailFavoriteCard from './CocktailFavoriteCard';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const FavoritesTab: React.FC<FavoritesTabProps> = ({ favoriteCocktails }) => {
  return (
    <div className="space-y-4">
      <h2 className="font-medium">My Favorite Mocktails</h2>
      
      {favoriteCocktails.map((cocktail) => (
        <Card key={cocktail.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-0 overflow-hidden">
            <Link to={`/cocktail/${cocktail.id}`} className="block">
              <CocktailFavoriteCard cocktail={cocktail} />
            </Link>
            
            {cocktail.establishment && (
              <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center">
                <span className="text-sm text-gray-600">Available at: {typeof cocktail.establishment === 'object' ? cocktail.establishment.name : cocktail.establishment}</span>
                {typeof cocktail.establishment === 'object' && 'id' in cocktail.establishment ? (
                  <Link 
                    to={`/establishment/${cocktail.establishment.id}`}
                    className="text-material-primary hover:text-material-primary/80 flex items-center text-sm"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                ) : (
                  <span className="text-material-primary/50 flex items-center text-sm">
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FavoritesTab;
