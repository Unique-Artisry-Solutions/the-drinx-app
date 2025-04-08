
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsSectionProps {
  visitorStats: {
    totalVisits: number;
    uniqueVisitors: number;
    returningVisitors: number;
  };
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ visitorStats }) => {
  return (
    <Card className="mb-6 mx-4 md:mx-6 lg:mx-[10%]">
      <CardContent className="py-6">
        <h1 className="text-2xl font-bold mb-4">Analytics</h1>
        <p>Visitor statistics and performance metrics.</p>
        <div className="mt-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Visitor Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-blue-50">
                <h3 className="font-medium">Total Visits</h3>
                <p className="text-2xl font-bold">{visitorStats?.totalVisits || 278}</p>
              </Card>
              <Card className="p-4 bg-green-50">
                <h3 className="font-medium">Unique Visitors</h3>
                <p className="text-2xl font-bold">{visitorStats?.uniqueVisitors || 153}</p>
              </Card>
              <Card className="p-4 bg-amber-50">
                <h3 className="font-medium">Returning Visitors</h3>
                <p className="text-2xl font-bold">{visitorStats?.returningVisitors || 62}</p>
              </Card>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <p className="text-gray-500">Visitor trend chart would display here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSection;
