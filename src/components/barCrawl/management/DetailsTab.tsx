
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Clock, Edit } from 'lucide-react';

interface DetailsTabProps {
  barCrawl: {
    id: string;
    name: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    maxParticipants?: number;
    currentParticipants?: number;
    theme?: string;
    status?: string;
    price?: number;
  };
  onEdit?: () => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ barCrawl, onEdit }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Name</h3>
            <p>{barCrawl.name}</p>
          </div>
          
          {barCrawl.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{barCrawl.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {barCrawl.date && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold">Date</p>
                  <p className="text-gray-600">{barCrawl.date}</p>
                </div>
              </div>
            )}
            
            {barCrawl.time && (
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold">Time</p>
                  <p className="text-gray-600">{barCrawl.time}</p>
                </div>
              </div>
            )}
            
            {barCrawl.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold">Starting Location</p>
                  <p className="text-gray-600">{barCrawl.location}</p>
                </div>
              </div>
            )}
            
            {barCrawl.maxParticipants && (
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold">Participants</p>
                  <p className="text-gray-600">
                    {barCrawl.currentParticipants || 0} / {barCrawl.maxParticipants}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {barCrawl.status && (
              <div>
                <p className="font-semibold mb-1">Status</p>
                <Badge variant={barCrawl.status === 'active' ? 'default' : 'secondary'}>
                  {barCrawl.status.charAt(0).toUpperCase() + barCrawl.status.slice(1)}
                </Badge>
              </div>
            )}
            
            {barCrawl.theme && (
              <div>
                <p className="font-semibold mb-1">Theme</p>
                <Badge variant="outline">{barCrawl.theme}</Badge>
              </div>
            )}
            
            {barCrawl.price && (
              <div>
                <p className="font-semibold mb-1">Price</p>
                <p className="text-lg font-bold text-green-600">${barCrawl.price}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsTab;
