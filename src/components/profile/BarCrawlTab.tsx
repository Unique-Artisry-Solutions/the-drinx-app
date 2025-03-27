
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Establishment {
  id: string;
  name: string;
  address: string;
}

interface BarCrawlTabProps {
  barCrawlList: Establishment[];
  shareBarCrawl: () => void;
}

const BarCrawlTab: React.FC<BarCrawlTabProps> = ({ barCrawlList, shareBarCrawl }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-medium">My Bar Crawl List</h2>
        <Button onClick={shareBarCrawl}>Share Bar Crawl</Button>
      </div>
      
      {barCrawlList.length > 0 ? (
        <div className="space-y-3">
          {barCrawlList.map((est, index) => (
            <Card key={est.id} className="relative">
              <CardContent className="p-4 flex items-center">
                <div className="h-8 w-8 rounded-full bg-material-primary text-white flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{est.name}</h3>
                  <div className="flex items-center text-sm text-material-on-surface-variant">
                    <MapPin size={14} className="mr-1" />
                    {est.address}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-material-on-surface-variant">
            You haven't added any establishments to your bar crawl list yet.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate('/explore')}
          >
            Explore Establishments
          </Button>
        </div>
      )}
    </div>
  );
};

export default BarCrawlTab;
