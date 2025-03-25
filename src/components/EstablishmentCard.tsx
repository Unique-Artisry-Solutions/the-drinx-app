
import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface EstablishmentCardProps {
  id: string;
  name: string;
  address: string;
  distance?: string;
  cocktailCount: number;
  image?: string;
  className?: string;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  id,
  name,
  address,
  distance,
  cocktailCount,
  image,
  className,
}) => {
  return (
    <Link to={`/establishment/${id}`}>
      <div 
        className={cn(
          "flex rounded-xl overflow-hidden bg-white elevation-2 border border-gray-100 transition-all-300 hover:elevation-3 hover:translate-y-[-2px]",
          className
        )}
      >
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 overflow-hidden">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-material-primary-container">
              <span className="text-material-on-primary-container text-xs text-center p-1">No Image</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-3">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-medium text-material-on-surface">{name}</h3>
            {distance && (
              <span className="text-xs bg-material-secondary-container text-material-on-secondary-container px-2 py-1 rounded-full flex items-center">
                <MapPin size={12} className="mr-1" /> {distance}
              </span>
            )}
          </div>
          
          <p className="text-xs text-material-on-surface-variant mt-1">{address}</p>
          
          <div className="mt-2 flex justify-between items-end">
            <div className="text-xs text-material-primary font-medium">
              {cocktailCount} {cocktailCount === 1 ? 'cocktail' : 'cocktails'} available
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EstablishmentCard;
