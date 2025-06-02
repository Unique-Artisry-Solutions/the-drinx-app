
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock } from 'lucide-react';
import type { Establishment } from '@/types/SupabaseTables';

interface EstablishmentCardProps {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance?: number;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  id,
  name,
  address,
  rating,
  distance
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
          
          {distance !== undefined && (
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {distance.toFixed(1)} mi away
              </Badge>
              <div className="flex items-center text-green-600 text-sm">
                <Clock className="w-4 h-4 mr-1" />
                <span>Open</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

interface EstablishmentListProps {
  establishments: Establishment[];
  isLoading?: boolean;
}

const EstablishmentList: React.FC<EstablishmentListProps> = ({
  establishments,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (establishments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No establishments found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {establishments.map((establishment) => (
        <EstablishmentCard
          key={establishment.id}
          id={establishment.id}
          name={establishment.name}
          address={establishment.address || 'Address not available'}
          rating={4.5}
          distance={Math.random() * 10}
        />
      ))}
    </div>
  );
};

export default EstablishmentList;
