
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MapPin, Star, Route, Clock, Check } from 'lucide-react';

interface EstablishmentCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  rating?: number;
  distance?: string;
  address?: string;
  isCheckedIn?: boolean;
  isOpen?: boolean;
  openingTime?: string;
  highestRatedDrink?: {
    name: string;
    rating: number;
  };
  onCheckIn?: () => void;
  onAddToSwigCircuit?: () => void;
}

/**
 * An enhanced establishment card with more prominent action buttons
 * Designed to reduce friction for primary user actions
 */
export const ActionableEstablishmentCard: React.FC<EstablishmentCardProps> = ({
  id,
  name,
  imageUrl,
  rating,
  distance,
  address,
  isCheckedIn = false,
  isOpen = true,
  openingTime,
  highestRatedDrink,
  onCheckIn,
  onAddToSwigCircuit
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
      <div className="relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
        
        {/* Status badge */}
        {isOpen ? (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <span className="mr-1">Open</span>
            <Clock className="h-3 w-3" />
          </div>
        ) : (
          <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <span className="mr-1">Opens {openingTime}</span>
            <Clock className="h-3 w-3" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
          {rating && (
            <div className="flex items-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded">
              <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>
        
        {address && (
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{address}</span>
            {distance && <span className="ml-1 text-xs">({distance})</span>}
          </div>
        )}
        
        {highestRatedDrink && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 mt-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Popular: </span>
            <span className="font-medium">{highestRatedDrink.name}</span>
            <div className="flex items-center mt-1">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-xs ml-1">{highestRatedDrink.rating}</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="border"
        >
          <Link to={`/establishment/${id}`}>View Details</Link>
        </Button>
        
        <div className="flex gap-2">
          {!isCheckedIn && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={onCheckIn}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              Check In
            </Button>
          )}
          
          {isCheckedIn && (
            <Button variant="outline" size="sm" className="text-green-600 border-green-200 bg-green-50" disabled>
              <Check className="h-3.5 w-3.5 mr-1" />
              Checked In
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddToSwigCircuit} 
            className="border-purple-200"
          >
            <Route className="h-3.5 w-3.5 mr-1" />
            Add to Bar Crawl
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActionableEstablishmentCard;
