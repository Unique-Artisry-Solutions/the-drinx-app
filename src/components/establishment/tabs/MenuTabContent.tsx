
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CocktailCard from '@/components/CocktailCard';

interface MenuTabContentProps {
  cocktails: any[];
}

const MenuTabContent: React.FC<MenuTabContentProps> = ({ cocktails }) => {
  return (
    <div className="space-y-4">
      {cocktails.length > 0 ? cocktails.map(cocktail => (
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
      )) : (
        <Alert>
          <AlertDescription>
            No mocktails available at this time.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MenuTabContent;
