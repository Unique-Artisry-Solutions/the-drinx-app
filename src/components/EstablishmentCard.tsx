
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock } from 'lucide-react';

interface EstablishmentCardProps {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance?: number;
  isOpen?: boolean;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  id,
  name,
  address,
  rating,
  distance,
  isOpen = true
}) => {
  return (
    <Link to={`/establishment/${id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate">{name}</h3>
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm truncate">{address}</span>
          </div>
          
          <div className="flex items-center justify-between">
            {distance !== undefined && (
              <Badge variant="secondary" className="text-xs">
                {distance.toFixed(1)} mi away
              </Badge>
            )}
            <div className={`flex items-center text-sm ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
              <Clock className="w-4 h-4 mr-1" />
              <span>{isOpen ? 'Open' : 'Closed'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EstablishmentCard;
