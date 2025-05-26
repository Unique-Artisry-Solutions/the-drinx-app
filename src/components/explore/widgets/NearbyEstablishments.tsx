
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star } from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
  image_url?: string;
  distance?: string;
}

interface NearbyEstablishmentsProps {
  establishments: Establishment[];
}

const NearbyEstablishments: React.FC<NearbyEstablishmentsProps> = ({ establishments }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Nearby Places</h3>
        <Button variant="ghost" size="sm">View All</Button>
      </div>
      <div className="space-y-3">
        {establishments.map((establishment) => (
          <div key={establishment.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            {establishment.image_url && (
              <img 
                src={establishment.image_url} 
                alt={establishment.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{establishment.name}</h4>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{establishment.distance || '0.5 mi'}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>4.5</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NearbyEstablishments;
