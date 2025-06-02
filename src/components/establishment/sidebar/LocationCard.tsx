
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe, Clock } from 'lucide-react';

interface LocationCardProps {
  establishment: {
    name: string;
    address: string;
    phone?: string;
    website?: string;
    coordinates?: { latitude: number; longitude: number } | null;
    isOpen?: boolean;
    nextOpenTime?: string;
  };
}

const LocationCard: React.FC<LocationCardProps> = ({ establishment }) => {
  const {
    name,
    address,
    phone,
    website,
    coordinates,
    isOpen,
    nextOpenTime
  } = establishment;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location & Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-1">{name}</h4>
          <p className="text-sm text-muted-foreground">{address}</p>
        </div>

        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{phone}</span>
          </div>
        )}

        {website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Badge variant={isOpen ? "default" : "secondary"}>
            {isOpen ? "Open Now" : "Closed"}
          </Badge>
          {!isOpen && nextOpenTime && (
            <span className="text-xs text-muted-foreground">
              Opens {nextOpenTime}
            </span>
          )}
        </div>

        {coordinates && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Coordinates: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCard;
