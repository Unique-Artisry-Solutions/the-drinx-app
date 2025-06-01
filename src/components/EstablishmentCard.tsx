
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Phone } from 'lucide-react';

interface EstablishmentCardProps {
  id?: string;
  name: string;
  address: string;
  phone?: string;
  hours?: string;
  rating?: number;
  image_url?: string;
  image?: string;
  description?: string;
  tags?: string[];
  distance?: string;
  cocktailCount?: number;
  onSelect?: (establishment: any) => void;
  onClick?: () => void;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({ 
  id,
  name,
  address,
  phone,
  hours,
  rating,
  image_url,
  image,
  description,
  tags,
  distance,
  cocktailCount,
  onSelect,
  onClick 
}) => {
  const establishment = {
    id: id || '',
    name,
    address,
    phone,
    hours,
    rating,
    image_url,
    image,
    description,
    tags,
    distance,
    cocktailCount
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (onSelect) {
      onSelect(establishment);
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCardClick}>
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground mb-3">
            {description}
          </p>
        )}
        
        <div className="space-y-2">
          {rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-sm">{rating}/5</span>
            </div>
          )}
          
          {hours && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{hours}</span>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span className="text-sm">{phone}</span>
            </div>
          )}

          {distance && (
            <div className="text-sm text-muted-foreground">
              {distance}
            </div>
          )}

          {cocktailCount !== undefined && (
            <div className="text-sm text-muted-foreground">
              {cocktailCount} mocktails
            </div>
          )}
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Button className="w-full mt-4" onClick={handleCardClick}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default EstablishmentCard;
