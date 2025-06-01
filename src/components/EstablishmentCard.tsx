
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, Clock } from 'lucide-react';
import { Establishment } from '@/types/SupabaseTables';

interface EstablishmentCardProps {
  establishment: Establishment;
  distance?: number;
  onClick?: (establishment: Establishment) => void;
  showDistance?: boolean;
  showRating?: boolean;
  variant?: 'default' | 'compact';
  isLightTheme?: boolean;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  establishment,
  distance,
  onClick,
  showDistance = true,
  showRating = true,
  variant = 'default',
  isLightTheme: _isLightTheme = false
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(establishment);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${variant === 'compact' ? 'h-auto' : 'h-full'}`}
      onClick={handleClick}
    >
      <CardHeader className={variant === 'compact' ? 'pb-2' : ''}>
        <div className="flex justify-between items-start">
          <CardTitle className={variant === 'compact' ? 'text-lg' : 'text-xl'}>
            {establishment.name}
          </CardTitle>
          {establishment.is_verified && (
            <Badge variant="secondary" className="ml-2">
              Verified
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {establishment.address}
          {showDistance && distance && (
            <span className="ml-2">• {distance.toFixed(1)} km away</span>
          )}
        </div>
      </CardHeader>

      <CardContent className={variant === 'compact' ? 'pt-0' : ''}>
        <div className="space-y-3">
          {/* Rating and Reviews */}
          {showRating && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">4.5</span>
                <span className="text-muted-foreground ml-1">(127 reviews)</span>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Popular</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Open until 10 PM</span>
            </div>
          </div>

          {/* Description */}
          {establishment.description && variant !== 'compact' && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {establishment.description}
            </p>
          )}

          {/* Action Button */}
          <div className="flex justify-between items-center pt-2">
            <Link 
              to={`/establishment/${establishment.id}`}
              onClick={handleViewDetails}
            >
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <Badge variant="outline">
              {Math.floor(Math.random() * 20) + 5} mocktails
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstablishmentCard;
