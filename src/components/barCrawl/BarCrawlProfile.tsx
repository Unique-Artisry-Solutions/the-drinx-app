
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarCrawlProfileProps {
  barCrawlId: string;
}

const BarCrawlProfile: React.FC<BarCrawlProfileProps> = ({ barCrawlId }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Bar Crawl Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bar Crawl ID: {barCrawlId}</p>
          <p>This is a placeholder for the bar crawl profile component.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarCrawlProfile;
