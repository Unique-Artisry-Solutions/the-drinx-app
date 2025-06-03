
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { useState, useCallback } from 'react'; // Commented out to preserve future functionality
// import { useToast } from '@/hooks/use-toast'; // Commented out to preserve future functionality
import { MapPin, Clock, Users } from 'lucide-react';
// import EstablishmentGrid from './EstablishmentGrid'; // Commented out to preserve future functionality

interface SampleEstablishment {
  id: string;
  name: string;
  address: string;
  rating: number;
  type: string;
  hours: string;
  capacity: number;
}

const sampleEstablishments: SampleEstablishment[] = [
  {
    id: '1',
    name: 'The Mocktail Lounge',
    address: '123 Main St',
    rating: 4.5,
    type: 'Lounge',
    hours: '5PM - 11PM',
    capacity: 50
  },
  {
    id: '2',
    name: 'Fresh & Clean Bar',
    address: '456 Oak Ave',
    rating: 4.8,
    type: 'Bar',
    hours: '4PM - 12AM',
    capacity: 75
  }
];

const BarCrawlControlWithSampleData: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {sampleEstablishments.map((establishment) => (
          <Card key={establishment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{establishment.name}</CardTitle>
                <Badge variant="secondary">{establishment.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {establishment.address}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {establishment.hours}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Capacity: {establishment.capacity}
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{establishment.rating}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BarCrawlControlWithSampleData;
