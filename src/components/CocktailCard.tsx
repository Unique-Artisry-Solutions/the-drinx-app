
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
    name: string;
    distance?: string;
  };
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
  
  return <Link to={`/cocktail/${id}`}>
      <div className={cn("rounded-xl overflow-hidden elevation-2 border transition-all-300 hover:elevation-3 hover:translate-y-[-2px]", 
        isLightTheme ? "bg-white border-gray-200" : "bg-white border-gray-100", 
        className)}>
        <div className="relative">
          <div className="h-48 w-full bg-gray-200 overflow-hidden">
            {image ? 
              <img src={image} alt={name} className="w-full h-full object-cover transition-transform-300 hover:scale-105" /> : 
              <div className="w-full h-full flex items-center justify-center bg-material-primary-container">
                <span className="text-material-on-primary-container">No Image</span>
              </div>
            }
          </div>
          <div className="absolute top-3 right-3 bg-material-primary text-material-on-primary px-3 py-1 rounded-full text-sm font-medium">
            {price}
          </div>
        </div>

        <div className={cn(
          "p-4 py-[23px]", 
          isLightTheme 
            ? "bg-[#f5f3ed] text-gray-800" 
            : "bg-[#02022b]/[0.94] text-material-on-surface"
        )}>
          <h3 className={cn(
            "text-lg font-medium mb-1",
            isLightTheme ? "text-gray-800" : "text-material-on-surface"
          )}>
            {name}
          </h3>
          <p className={cn(
            "text-sm mb-3",
            isLightTheme ? "text-gray-600" : "text-material-on-surface-variant"
          )}>
            {establishment.name} {establishment.distance && `· ${establishment.distance}`}
          </p>

          <p className={cn(
            "text-sm line-clamp-2 mb-2",
            isLightTheme ? "text-gray-700" : "text-material-on-surface"
          )}>
            {description}
          </p>

          {ingredients && ingredients.length > 0 && 
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {ingredients.map((ingredient, index) => 
                  <span key={index} className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    isLightTheme 
                      ? "bg-gray-200 text-gray-700" 
                      : "bg-material-secondary-container text-material-on-secondary-container"
                  )}>
                    {ingredient}
                  </span>
                )}
              </div>
            </div>
          }
        </div>
      </div>
    </Link>;
};

export default CocktailCard;
