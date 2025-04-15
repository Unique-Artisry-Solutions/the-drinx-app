
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import CocktailCard from '@/components/CocktailCard';

interface MenuTabContentProps {
  cocktails: any[];
}

const MenuTabContent: React.FC<MenuTabContentProps> = ({ cocktails }) => {
  return (
    <div className="space-y-4">
      {cocktails && cocktails.length > 0 ? (
        cocktails.map(cocktail => (
          <CocktailCard 
            key={cocktail.id} 
            id={cocktail.id} 
            name={cocktail.name} 
            price={cocktail.price} 
            description={cocktail.description} 
            ingredients={cocktail.ingredients} 
            image={cocktail.image || cocktail.image_url} 
            establishment={cocktail.establishment} 
          />
        ))
      ) : (
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-500 mr-2" />
          <AlertDescription className="text-amber-800">
            No mocktails are currently available at this establishment. Check back later for updates to the menu.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default MenuTabContent;
