
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import MapView from '@/components/map/MapView';
import { cn } from '@/lib/utils';

interface LocationCardProps {
  establishment: any;
  userLocation: {
    latitude: number;
    longitude: number;
  } | null | undefined;
  isLightTheme: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ 
  establishment,
  userLocation,
  isLightTheme
}) => {
  const mapEstablishments = [{
    id: establishment.id,
    name: establishment.name,
    latitude: establishment.latitude,
    longitude: establishment.longitude,
    cocktailCount: establishment.cocktail_count || 0
  }];
  
  return (
    <Card className="vibrant-card">
      <CardHeader>
        <CardTitle className={cn(
          "text-lg",
          isLightTheme ? "text-gray-800" : "gradient-text"
        )}>
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[250px] overflow-hidden rounded-b-lg">
        <MapView 
          establishments={mapEstablishments} 
          userLocation={userLocation} 
          onRefreshLocation={() => {}} 
          isLoadingLocation={false} 
          singleEstablishmentView={true} 
        />
      </CardContent>
    </Card>
  );
};

export default LocationCard;
