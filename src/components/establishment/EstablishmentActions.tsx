
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EstablishmentActionsProps {
  hasCheckedIn: boolean;
  isPromoter: boolean;
  onCheckIn: () => void;
  onBarCrawlRequest: () => void;
}

const EstablishmentActions: React.FC<EstablishmentActionsProps> = ({
  hasCheckedIn,
  isPromoter,
  onCheckIn,
  onBarCrawlRequest
}) => {
  return (
    <div className="flex gap-2">
      {!hasCheckedIn && (
        <Button size="sm" onClick={onCheckIn} variant="gradient" className="shadow-md hover:shadow-lg">
          Check In
        </Button>
      )}
      {isPromoter && (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onBarCrawlRequest} 
          className="border-white text-white bg-black/50 backdrop-blur-sm hover:bg-black/60"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add to Bar Crawl
        </Button>
      )}
    </div>
  );
};

export default EstablishmentActions;
