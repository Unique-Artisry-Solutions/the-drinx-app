
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
  className,
}) => {
  return (
    <Link to={`/cocktail/${id}`}>
      <div 
        className={cn(
          "rounded-xl overflow-hidden elevation-2 bg-white border border-gray-100 transition-all-300 hover:elevation-3 hover:translate-y-[-2px]",
          className
        )}
      >
        <div className="relative">
          <div className="h-48 w-full bg-gray-200 overflow-hidden">
            {image ? (
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover transition-transform-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-material-primary-container">
                <span className="text-material-on-primary-container">No Image</span>
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3 bg-material-primary text-material-on-primary px-3 py-1 rounded-full text-sm font-medium">
            {price}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-medium text-material-on-surface mb-1">{name}</h3>
          <p className="text-sm text-material-on-surface-variant mb-3">
            {establishment.name} {establishment.distance && `· ${establishment.distance}`}
          </p>

          <p className="text-sm text-material-on-surface line-clamp-2 mb-2">{description}</p>

          {ingredients && ingredients.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {ingredients.map((ingredient, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-material-secondary-container text-material-on-secondary-container px-2 py-1 rounded-full"
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
