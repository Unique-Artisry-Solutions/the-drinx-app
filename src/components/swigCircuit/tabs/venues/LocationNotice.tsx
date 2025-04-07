
import React from 'react';
import { Button } from '@/components/ui/button';

interface LocationNoticeProps {
  userLocation: { latitude: number; longitude: number } | null;
}

const LocationNotice: React.FC<LocationNoticeProps> = ({ userLocation }) => {
  if (userLocation) return null;
  
  return (
    <div className="text-center py-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
      <p className="text-amber-800">
        Location services are disabled. Enable location services in your browser to see nearby venues.
      </p>
      <Button 
        variant="outline" 
        className="mt-2" 
        onClick={() => window.location.reload()}
      >
        Retry
      </Button>
    </div>
  );
};

export default LocationNotice;
