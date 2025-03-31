
import React from 'react';
import CocktailCard from '@/components/CocktailCard';

interface Cocktail {
  id: string;
  name: string;
  price: string | number;
  description: string;
  ingredients: string[];
  image?: string;
  establishment: {
    name: string;
    distance?: string;
  };
}

interface FeaturedCocktailsProps {
  cocktails: Cocktail[];
}

const FeaturedCocktails: React.FC<FeaturedCocktailsProps> = ({ cocktails }) => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-material-on-surface">Featured Cocktails</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cocktails.slice(0, 4).map(cocktail => (
          <CocktailCard 
            key={cocktail.id} 
            id={cocktail.id} 
            name={cocktail.name} 
            price={cocktail.price} 
            description={cocktail.description} 
            ingredients={cocktail.ingredients} 
            image={cocktail.image} 
            establishment={cocktail.establishment} 
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCocktails;
