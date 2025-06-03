
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Globe, Clock } from 'lucide-react';
// import { useTheme } from 'next-themes'; // Commented out unused import
import { Establishment } from '@/types/ProfileTypes';
// import { BusinessHour } from '../BusinessHoursEditor'; // Commented out unused import

interface InfoTabContentProps {
  establishment: Establishment;
}

const InfoTabContent: React.FC<InfoTabContentProps> = ({ establishment }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span>{establishment.address}</span>
          </div>
          {establishment.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <span>{establishment.phone}</span>
            </div>
          )}
          {establishment.website && (
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-500" />
              <a href={establishment.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {establishment.website}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 text-gray-600">
            <Clock className="h-5 w-5" />
            <span>Hours information coming soon</span>
          </div>
        </CardContent>
      </Card>

      {establishment.description && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{establishment.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InfoTabContent;
