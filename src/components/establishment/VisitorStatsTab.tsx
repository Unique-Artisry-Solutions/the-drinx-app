
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart, CircleSlash } from 'lucide-react';

interface VisitorStatsTabProps {
  visitorStats: {
    totalVisits: number;
    uniqueVisitors: number;
    returningVisitors: number;
  };
  hasData?: boolean;
}

const VisitorStatsTab: React.FC<VisitorStatsTabProps> = ({ visitorStats, hasData = true }) => {
  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visitor Statistics</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <CircleSlash className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-material-on-surface-variant">No visitor data available</p>
          <p className="mt-2 text-material-on-surface-variant">Start attracting visitors to see statistics here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">Total Visits</h3>
            </div>
            <p className="text-2xl font-bold">{visitorStats.totalVisits}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="font-medium">Unique Visitors</h3>
            </div>
            <p className="text-2xl font-bold">{visitorStats.uniqueVisitors}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="font-medium">Returning Visitors</h3>
            </div>
            <p className="text-2xl font-bold">{visitorStats.returningVisitors}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-4">Visitor Trends</h3>
          <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
            <BarChart className="h-8 w-8 text-gray-400 mr-2" />
            <p className="text-material-on-surface-variant text-sm">
              Visitor trend charts will be displayed here
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorStatsTab;
