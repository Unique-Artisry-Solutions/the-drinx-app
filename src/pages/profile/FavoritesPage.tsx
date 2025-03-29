
import React from 'react';
import Layout from '@/components/Layout';
import FavoritesTab from '@/components/profile/FavoritesTab';
import { Cocktail } from '@/types/ProfileTypes';
import { sampleCocktails } from '@/data/sampleData';

const FavoritesPage: React.FC = () => {
  const favoriteCocktails: Cocktail[] = sampleCocktails.slice(0, 3);

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-material-on-background">Favorites</h1>
            <p className="text-material-on-surface-variant">
              Your favorite mocktails
            </p>
          </div>
        </div>
        
        <FavoritesTab favoriteCocktails={favoriteCocktails} />
      </div>
    </Layout>
  );
};

export default FavoritesPage;
