
import React from 'react';
import CocktailCard from '@/components/CocktailCard';
import { Button } from '@/components/ui/button';

interface Cocktail {
  id: string;
  name: string;
  price: string | number;
  description: string;
  ingredients: string[];
  image?: string;
  establishment: {
    id: string;
    name: string;
    distance?: string;
  };
}

interface AllCocktailsProps {
  cocktails: Cocktail[];
  onResetFilters: () => void;
}

const AllCocktails: React.FC<AllCocktailsProps> = ({ cocktails, onResetFilters }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium text-material-on-surface mb-4">All Cocktails</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cocktails.map(cocktail => (
          <CocktailCard 
            key={cocktail.id} 
            id={cocktail.id} 
            name={cocktail.name} 
            price={cocktail.price.toString()} 
            description={cocktail.description} 
            ingredients={cocktail.ingredients} 
            image={cocktail.image} 
            establishment={cocktail.establishment} 
          />
        ))}
      </div>
      
      {cocktails.length === 0 && (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-material-on-surface-variant">No cocktails found matching your criteria.</p>
          <button 
            className="text-material-primary mt-2" 
            onClick={onResetFilters}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AllCocktails;
