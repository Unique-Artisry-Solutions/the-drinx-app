
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BarCrawlCard from './BarCrawlCard';
import { BarCrawlRequest } from '@/hooks/useBarCrawlRequests';

interface BarCrawlsTabProps {
  barCrawls: BarCrawlRequest[];
  handleEndParticipation: (id: string) => void;
  handleAcceptRequest: (id: string) => void;
}

const BarCrawlsTab: React.FC<BarCrawlsTabProps> = ({
  barCrawls,
  handleEndParticipation,
  handleAcceptRequest
}) => {
  const pendingCrawls = barCrawls.filter(crawl => crawl.status === 'pending');
  const acceptedCrawls = barCrawls.filter(crawl => crawl.status === 'accepted');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Swig Circuit Participation</CardTitle>
      </CardHeader>
      <CardContent>
        {barCrawls.length > 0 ? (
          <div className="space-y-6">
            {pendingCrawls.map(crawl => (
              <BarCrawlCard 
                key={crawl.id} 
                crawl={crawl} 
                handleEndParticipation={handleEndParticipation} 
                handleAcceptRequest={handleAcceptRequest}
              />
            ))}
            
            {acceptedCrawls.map(crawl => (
              <BarCrawlCard 
                key={crawl.id} 
                crawl={crawl} 
                handleEndParticipation={handleEndParticipation}
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No Swig Circuit requests at this time.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BarCrawlsTab;
