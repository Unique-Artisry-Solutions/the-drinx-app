
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

interface CocktailCardProps {
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
  } | undefined;
  className?: string;
}

const CocktailCard: React.FC<CocktailCardProps> = ({
  id,
  name,
  price,
  description,
  ingredients,
  image,
  establishment,
  className
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';
  
  // Default establishment data if it's undefined
  const establishmentName = establishment?.name || 'Unknown Venue';
  const establishmentDistance = establishment?.distance;
  
  return (
    <Link to={`/cocktail/${id}`}>
      <div className={cn(
        "rounded-xl overflow-hidden elevation-2 border transition-all-300 hover:elevation-3 hover:translate-y-[-2px]",
        "bg-card border-border", 
        className
      )}>
        <div className="relative">
          <div className="h-48 w-full bg-gray-200 overflow-hidden">
            {image ? (
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover transition-transform-300 hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3 bg-spiritless-pink text-white px-3 py-1 rounded-full text-sm font-medium">
            {price}
          </div>
        </div>

        <div className="p-4 py-[23px]">
          <h3 className="text-lg font-medium mb-1 text-foreground">
            {name}
          </h3>
          <p className="text-sm mb-3 text-muted-foreground">
            {establishmentName} {establishmentDistance && `· ${establishmentDistance}`}
          </p>

          <p className="text-sm line-clamp-2 mb-2 text-foreground">
            {description}
          </p>

          {ingredients && ingredients.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {ingredients.map((ingredient, index) => (
                  <span 
                    key={index} 
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      isLightTheme 
                        ? "bg-muted text-foreground" 
                        : "bg-muted text-foreground"
                    )}
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CocktailCard;
