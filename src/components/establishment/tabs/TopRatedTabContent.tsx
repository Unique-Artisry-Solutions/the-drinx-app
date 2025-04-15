
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import CocktailCard from '@/components/CocktailCard';
import { cn } from '@/lib/utils';

interface TopRatedTabContentProps {
  topRatedCocktails: any[];
  isLightTheme: boolean;
}

const TopRatedTabContent: React.FC<TopRatedTabContentProps> = ({ 
  topRatedCocktails,
  isLightTheme
}) => {
  return (
    <div className="space-y-4">
      {topRatedCocktails.length > 0 ? (
        <>
          <h3 className={cn(
            "text-lg font-medium mb-3",
            isLightTheme ? "text-gray-800" : "vibrant-header"
          )}>
            Most Popular Mocktails
          </h3>
          {topRatedCocktails.map((cocktail, index) => (
            <div key={cocktail.id} className="relative">
              {index === 0 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-md">Top Pick</Badge>
                </div>
              )}
              <CocktailCard 
                id={cocktail.id} 
                name={cocktail.name} 
                price={cocktail.price} 
                description={cocktail.description} 
                ingredients={cocktail.ingredients} 
                image={cocktail.image} 
                establishment={cocktail.establishment} 
              />
            </div>
          ))}
        </> 
      ) : (
        <Alert>
          <AlertDescription>
            No ratings available yet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TopRatedTabContent;
