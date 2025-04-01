
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Share2, MapPin, Users, Beer, QrCode, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BarCrawlTabProps {
  barCrawlList: any[];
  shareBarCrawl: () => void;
}

const BarCrawlTab: React.FC<BarCrawlTabProps> = ({ barCrawlList, shareBarCrawl }) => {
  const [currentEstablishment, setCurrentEstablishment] = useState<any>(barCrawlList[0] || null);
  const [activeUsers, setActiveUsers] = useState<number>(Math.floor(Math.random() * 20) + 5);
  const [isParticipating, setIsParticipating] = useState<boolean>(true);
  const [promoCode, setPromoCode] = useState<string>("SPIRITLESS25");
  const [barCrawlId, setBarCrawlId] = useState<string>("bc-123");

  const toggleParticipation = () => {
    setIsParticipating(!isParticipating);
  };

  return (
    <div className="space-y-4">
      {isParticipating && currentEstablishment && (
        <Card className="border-spiritless-pink border-2">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Currently Participating</h3>
                  <p className="text-material-on-surface-variant text-sm">You're checked in to the bar crawl</p>
                </div>
                <Button variant="outline" size="sm" onClick={toggleParticipation}>
                  Leave Crawl
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Beer className="h-5 w-5 mr-2 text-material-primary" />
                    <span className="font-medium">Current Stop:</span>
                    <span className="ml-2">{currentEstablishment.name}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-material-primary" />
                    <span className="text-sm">{currentEstablishment.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-material-primary" />
                    <span className="text-sm">{activeUsers} app users here now</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-material-primary" />
                    <span className="text-sm font-medium">Promo Code:</span>
                    <span className="ml-2 bg-material-primary/10 text-material-primary px-2 py-1 rounded text-sm font-bold">
                      {promoCode}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-center items-center p-3 bg-gray-100 rounded-lg h-28">
                    <div className="text-center">
                      <QrCode className="h-14 w-14 mx-auto mb-1 text-material-primary" />
                      <p className="text-xs text-material-on-surface-variant">Scan for special offers</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link to={`/establishment/${currentEstablishment.id}`} className="flex-1">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <MapPin size={16} className="mr-1" />
                        View Location
                      </Button>
                    </Link>
                    <Link to={`/profile/bar-crawls/participants/${barCrawlId}`} className="flex-1">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <User size={16} className="mr-1" />
                        Locate Crawlers
                      </Button>
                    </Link>
                  </div>
                  
                  <Link to={`/bar-crawl-profile/${barCrawlId}`} className="w-full">
                    <Button className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90" size="sm">
                      View Bar Crawl Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Your Bar Crawl List</h3>
          {barCrawlList.length > 0 && (
            <Button size="sm" variant="outline" onClick={shareBarCrawl}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
        </div>
        
        {barCrawlList.length === 0 ? (
          <div className="text-center py-6 border border-dashed rounded-lg bg-gray-50">
            <p className="text-material-on-surface-variant">No establishments in your bar crawl list yet.</p>
            <Link to="/map">
              <Button variant="link" className="mt-1">
                Explore Map
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {barCrawlList.map((establishment) => (
              <div 
                key={establishment.id} 
                className={`border rounded-lg p-3 ${currentEstablishment?.id === establishment.id ? 'border-material-primary bg-material-primary/5' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{establishment.name}</h4>
                      {currentEstablishment?.id === establishment.id && (
                        <Badge className="ml-2 bg-material-primary">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-material-on-surface-variant mt-1">
                      {establishment.address}
                    </p>
                  </div>
                  
                  <Link to={`/establishment/${establishment.id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BarCrawlTab;
