
import React from 'react';
import CocktailCard from '@/components/CocktailCard';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface Cocktail {
  id: string;
  name: string;
  price: string;
  description: string;
  ingredients?: string[];
  image?: string;
  establishment: {
    id: string;
    name: string;
    distance?: string;
  };
}

interface CocktailsSectionProps {
  cocktails: Cocktail[];
  resetFilters: () => void;
}

const CocktailsSection: React.FC<CocktailsSectionProps> = ({
  cocktails,
  resetFilters
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';
  
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-foreground">Featured Cocktails</h2>
        <span className="text-sm text-muted-foreground">{cocktails.length} results</span>
      </div>
      
      {cocktails.length > 0 ? (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ${
          isLightTheme ? 'bg-card/50' : 'bg-card/30 backdrop-blur-sm'
        }`}>
          {cocktails.map(cocktail => (
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
      ) : (
        <div className="text-center py-6 border border-dashed rounded-lg">
          <p className="mb-2 text-muted-foreground">No cocktails found matching your criteria.</p>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default CocktailsSection;
