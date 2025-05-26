
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';

interface NearbyEstablishmentsWidgetProps {
  establishments: any[];
}

const NearbyEstablishmentsWidget: React.FC<NearbyEstablishmentsWidgetProps> = ({ establishments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Nearby Establishments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {establishments.map((establishment) => (
            <div key={establishment.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <img 
                  src={establishment.image_url} 
                  alt={establishment.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-establishment.jpg';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{establishment.name}</h3>
                <p className="text-sm text-muted-foreground">{establishment.address}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{establishment.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Open</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyEstablishmentsWidget;
