
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryTabs from '@/components/CategoryTabs';
import EstablishmentCard from '@/components/EstablishmentCard';
import CocktailCard from '@/components/CocktailCard';
import { useEstablishments } from '@/hooks/useEstablishments';
import { useCocktails } from '@/hooks/useCocktails';
import RecommendationsWidget from '@/components/explore/personalized/RecommendationsWidget';

type CategoryType = 'popular' | 'trending' | 'new' | 'personalized' | 'swig-circuits' | 'promoters';

const Explore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('popular');
  const { establishments, isLoading: establishmentsLoading } = useEstablishments();
  const { cocktails, isLoading: cocktailsLoading } = useCocktails();

  const renderContent = () => {
    if (selectedCategory === 'personalized') {
      return (
        <div className="space-y-6">
          <RecommendationsWidget />
        </div>
      );
    }

    if (selectedCategory === 'swig-circuits') {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Swig Circuits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Join organized bar crawls and discover new establishments with fellow mocktail enthusiasts.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Swig Circuits content will go here */}
                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-500">No active Swig Circuits available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (establishmentsLoading || cocktailsLoading) {
      return <div>Loading...</div>;
    }

    return (
      <div className="space-y-6">
        {/* Establishments */}
        <Card>
          <CardHeader>
            <CardTitle>Establishments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {establishments?.slice(0, 6).map((establishment) => (
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
          </CardContent>
        </Card>

        {/* Cocktails */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Mocktails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cocktails?.slice(0, 6).map((cocktail) => (
                <CocktailCard key={cocktail.id} {...cocktail} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore</h1>
        <p className="text-muted-foreground">Discover new mocktails, establishments, and experiences</p>
      </div>

      <div className="mb-6">
        <CategoryTabs 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory} 
        />
      </div>

      {renderContent()}
    </div>
  );
};

export default Explore;
