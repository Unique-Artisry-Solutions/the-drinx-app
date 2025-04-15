
import React from 'react';
import { MapPin, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface EstablishmentHeaderProps {
  establishment: any;
  hasCheckedIn: boolean;
  isPromoter: boolean;
  onCheckIn: () => void;
  onBarCrawlRequest: () => void;
}

const EstablishmentHeader: React.FC<EstablishmentHeaderProps> = ({
  establishment,
  hasCheckedIn,
  isPromoter,
  onCheckIn,
  onBarCrawlRequest
}) => {
  return (
    <div className="h-48 md:h-64 bg-material-primary/10 rounded-xl mb-6 bg-cover bg-center relative glow-hover" 
      style={{
        backgroundImage: `url(${establishment.image || '/placeholder.svg'})`
      }}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl"></div>
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex justify-between items-end">
          <div>
            <Badge variant="secondary" className="mb-2 bg-gradient-to-r from-spiritless-green to-spiritless-green-light text-white">
              {establishment.cocktailCount} Mocktails
            </Badge>
            <h1 className="text-3xl font-bold text-white">{establishment.name}</h1>
            <div className="flex items-center mt-1 text-white/90">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{establishment.address}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {!hasCheckedIn && (
              <Button size="sm" onClick={onCheckIn} variant="gradient" className="shadow-md hover:shadow-lg">
                Check In
              </Button>
            )}
            {/* Only show the Add to Bar Crawl button for promoters */}
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
        </div>
      </div>
    </div>
  );
};

export default EstablishmentHeader;
