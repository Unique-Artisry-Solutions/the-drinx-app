
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Establishment {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  image?: string;
  specialOffer?: string;
}

interface NearbyEstablishmentsWidgetProps {
  establishments: Establishment[];
}

const NearbyEstablishmentsWidget: React.FC<NearbyEstablishmentsWidgetProps> = ({ 
  establishments 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Nearby Establishments
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/map">
              View Map
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {establishments.slice(0, 4).map((establishment) => (
          <div 
            key={establishment.id} 
            className="flex gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            {establishment.image && (
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                <img 
                  src={establishment.image} 
                  alt={establishment.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1">{establishment.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{establishment.address}</p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium">{establishment.rating}</span>
                  </div>
                  <Badge 
                    variant={establishment.isOpen ? "default" : "secondary"} 
                    className="text-xs"
                  >
                    {establishment.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{establishment.distance}</span>
                  </div>
                  {!establishment.isOpen && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Opens later</span>
                    </div>
                  )}
                </div>
                
                <Button variant="ghost" size="sm" asChild className="text-xs h-auto p-1">
                  <Link to={`/establishment/${establishment.id}`}>View</Link>
                </Button>
              </div>
              
              {establishment.specialOffer && (
                <div className="pt-1">
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {establishment.specialOffer}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NearbyEstablishmentsWidget;
