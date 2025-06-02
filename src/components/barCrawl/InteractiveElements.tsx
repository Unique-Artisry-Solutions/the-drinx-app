
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Share2 } from 'lucide-react';

interface InteractiveElementsProps {
  onShare?: () => void;
  onJoin?: () => void;
  onCheckIn?: (locationId: string) => void;
  isParticipant?: boolean;
  currentLocation?: string;
}

const InteractiveElements: React.FC<InteractiveElementsProps> = ({
  onShare,
  onJoin,
  onCheckIn,
  isParticipant = false,
  currentLocation
}) => {
  const [checkedInLocations, setCheckedInLocations] = useState<string[]>([]);

  const handleCheckIn = (locationId: string) => {
    setCheckedInLocations(prev => [...prev, locationId]);
    onCheckIn?.(locationId);
  };

  const locations = [
    { id: '1', name: 'First Stop Bar', isActive: true },
    { id: '2', name: 'Second Venue', isActive: false },
    { id: '3', name: 'Final Destination', isActive: false }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Circuit Progress</span>
            <Badge variant="outline">
              {checkedInLocations.length}/{locations.length} Completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className={location.isActive ? 'font-semibold' : 'text-gray-600'}>
                    {location.name}
                  </span>
                  {location.isActive && (
                    <Badge variant="default" className="bg-green-500">
                      Current
                    </Badge>
                  )}
                </div>
                
                {isParticipant && location.isActive && !checkedInLocations.includes(location.id) && (
                  <Button 
                    size="sm" 
                    onClick={() => handleCheckIn(location.id)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Check In
                  </Button>
                )}
                
                {checkedInLocations.includes(location.id) && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Completed ✓
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-3">
        {!isParticipant && onJoin && (
          <Button onClick={onJoin} className="flex-1">
            <Users className="w-4 h-4 mr-2" />
            Join Circuit
          </Button>
        )}
        
        {onShare && (
          <Button variant="outline" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
};

export default InteractiveElements;
