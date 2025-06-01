import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Phone } from 'lucide-react';

interface EstablishmentCardProps {
  establishment: {
    id: string;
    name: string;
    address: string;
    phone?: string;
    hours?: string;
    rating?: number;
    image_url?: string;
    description?: string;
    tags?: string[];
  };
  onSelect?: (establishment: any) => void;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({ 
  establishment, 
  onSelect 
}) => {
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(establishment);
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCardClick}>
      <CardHeader>
        <CardTitle className="text-lg">{establishment.name}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {establishment.address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {establishment.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {establishment.description}
          </p>
        )}
        
        <div className="space-y-2">
          {establishment.rating && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="text-sm">{establishment.rating}/5</span>
            </div>
          )}
          
          {establishment.hours && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{establishment.hours}</span>
            </div>
          )}
          
          {establishment.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span className="text-sm">{establishment.phone}</span>
            </div>
          )}
        </div>

        {establishment.tags && establishment.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {establishment.tags.map((tag, index) => (
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
