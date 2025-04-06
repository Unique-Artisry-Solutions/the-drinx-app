
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import BarCrawlCard from '@/components/establishment/BarCrawlCard';
import { BarCrawlRequest } from '@/hooks/useBarCrawlRequests';

interface AcceptedRequestsTabProps {
  acceptedRequests: BarCrawlRequest[];
  handleEndParticipation: (id: string) => void;
}

const AcceptedRequestsTab: React.FC<AcceptedRequestsTabProps> = ({ 
  acceptedRequests,
  handleEndParticipation 
}) => {
  return (
    <>
      {acceptedRequests.length === 0 ? (
        <Card className="vibrant-card bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-spiritless-green shadow-md">
          <CardContent className="p-8 text-center">
            <p className="text-material-on-surface-variant text-lg">
              You haven't accepted any Swig Circuit requests yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {acceptedRequests.map((crawl) => (
            <div key={crawl.id} className="transform transition-all duration-300 hover:-translate-y-1">
              <BarCrawlCard 
                crawl={crawl}
                handleEndParticipation={handleEndParticipation}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AcceptedRequestsTab;
