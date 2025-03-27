
import React from 'react';
import { FavoritesTabProps } from '@/types/ProfileTypes';
import CocktailFavoriteCard from './CocktailFavoriteCard';

const FavoritesTab: React.FC<FavoritesTabProps> = ({ favoriteCocktails }) => {
  return (
    <div className="space-y-4">
      <h2 className="font-medium">My Favorite Mocktails</h2>
      
      {favoriteCocktails.map((cocktail) => (
        <CocktailFavoriteCard key={cocktail.id} cocktail={cocktail} />
      ))}
    </div>
  );
};

export default FavoritesTab;
