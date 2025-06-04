
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarCrawlManagementProps {
  barCrawlId: string;
}

const BarCrawlManagement: React.FC<BarCrawlManagementProps> = ({ barCrawlId }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Bar Crawl Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bar Crawl ID: {barCrawlId}</p>
          <p>This is a placeholder for the bar crawl management component.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarCrawlManagement;
