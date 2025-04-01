
import React from 'react';
import Layout from '@/components/Layout';
import FavoritesTab from '@/components/profile/FavoritesTab';
import { Cocktail } from '@/types/ProfileTypes';
import { sampleCocktails } from '@/data/sampleData';
import BackButton from '@/components/navigation/BackButton';

const FavoritesPage: React.FC = () => {
  // Make sure we select cocktails that have establishments with IDs
  const favoriteCocktails: Cocktail[] = sampleCocktails.slice(0, 3).map(cocktail => ({
    ...cocktail,
    // Ensure establishment includes id if it's an object
    establishment: typeof cocktail.establishment === 'object' 
      ? cocktail.establishment 
      : { name: cocktail.establishment as string }
  }));

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <BackButton className="mb-2" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-material-on-background">Favorites</h1>
              <p className="text-material-on-surface-variant">
                Your favorite mocktails
              </p>
            </div>
          </div>
        </div>
        
        <FavoritesTab favoriteCocktails={favoriteCocktails} />
      </div>
    </Layout>
  );
};

export default FavoritesPage;
