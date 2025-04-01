
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Establishment {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cocktailCount: number;
}

interface EstablishmentInfoCardProps {
  establishment: Establishment;
  singleEstablishmentView: boolean;
  onRequestBarCrawl: () => void;
}

const EstablishmentInfoCard: React.FC<EstablishmentInfoCardProps> = ({
  establishment,
  singleEstablishmentView,
  onRequestBarCrawl
}) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <div className="bg-white p-3 rounded-lg shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{establishment.name}</h3>
            <Badge variant="outline" className="mt-1">
              {establishment.cocktailCount} Mocktails
            </Badge>
          </div>
          
          {!singleEstablishmentView && (
            <Button size="sm" onClick={onRequestBarCrawl}>
              Request Bar Crawl
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstablishmentInfoCard;
