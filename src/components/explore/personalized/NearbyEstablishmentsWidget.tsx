
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock } from 'lucide-react';

export interface NearbyEstablishment {
  id: string;
  name: string;
  description: string;
  distance: string;
  rating: number;
  isOpen: boolean;
  imageUrl?: string;
}

export interface NearbyEstablishmentsWidgetProps {
  establishments?: NearbyEstablishment[];
}

const defaultEstablishments: NearbyEstablishment[] = [
  {
    id: '1',
    name: 'The Mocktail Lounge',
    description: 'Creative non-alcoholic cocktails',
    distance: '0.3 miles',
    rating: 4.8,
    isOpen: true
  },
  {
    id: '2',
    name: 'Sober Social Club',
    description: 'Community-focused sober bar',
    distance: '0.7 miles',
    rating: 4.5,
    isOpen: true
  },
  {
    id: '3',
    name: 'Zero Proof Kitchen',
    description: 'Farm-to-table mocktails',
    distance: '1.2 miles',
    rating: 4.6,
    isOpen: false
  }
];

export const NearbyEstablishmentsWidget: React.FC<NearbyEstablishmentsWidgetProps> = ({ 
  establishments = defaultEstablishments 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nearby Places
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {establishments.map((establishment) => (
            <div key={establishment.id} className="p-3 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{establishment.name}</h4>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{establishment.rating}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{establishment.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{establishment.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className={establishment.isOpen ? 'text-green-600' : 'text-red-600'}>
                      {establishment.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-6">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
