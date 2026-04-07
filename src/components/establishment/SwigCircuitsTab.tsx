
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SwigCircuitCard from './SwigCircuitCard';
import { SwigCircuitRequest } from '@/hooks/useSwigCircuitRequests';

interface SwigCircuitsTabProps {
  swigCircuits: SwigCircuitRequest[];
  handleEndParticipation: (id: string) => void;
  handleAcceptRequest: (id: string) => void;
}

const SwigCircuitsTab: React.FC<SwigCircuitsTabProps> = ({
  swigCircuits,
  handleEndParticipation,
  handleAcceptRequest
}) => {
  const pendingCrawls = swigCircuits.filter(crawl => crawl.status === 'pending');
  const acceptedCrawls = swigCircuits.filter(crawl => crawl.status === 'accepted');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Swig Circuit Participation</CardTitle>
      </CardHeader>
      <CardContent>
        {swigCircuits.length > 0 ? (
          <div className="space-y-6">
            {pendingCrawls.map(crawl => (
              <SwigCircuitCard 
                key={crawl.id} 
                crawl={crawl} 
                handleEndParticipation={handleEndParticipation} 
                handleAcceptRequest={handleAcceptRequest}
              />
            ))}
            
            {acceptedCrawls.map(crawl => (
              <SwigCircuitCard 
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

export default SwigCircuitsTab;
