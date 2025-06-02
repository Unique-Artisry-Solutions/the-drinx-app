
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EstablishmentCardProps {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance?: number;
  hours?: string;
  category?: string;
  imageUrl?: string;
  className?: string;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  id,
  name,
  address,
  rating,
  distance,
  hours,
  category,
  imageUrl,
  className = ""
}) => {
  return (
    <Link to={`/establishments/${id}`} className={`block ${className}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        {imageUrl && (
          <div className="w-full h-48 overflow-hidden rounded-t-lg">
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{name}</CardTitle>
            {category && (
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{address}</span>
            {distance && (
              <span className="ml-2">• {distance.toFixed(1)} mi</span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            
            {hours && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{hours}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EstablishmentCard;
