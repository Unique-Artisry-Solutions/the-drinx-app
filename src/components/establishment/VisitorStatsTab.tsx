
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart, CircleSlash } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface VisitorStatsTabProps {
  visitorStats: {
    totalVisits: number;
    uniqueVisitors: number;
    returningVisitors: number;
  };
  visitorTrends?: Array<{
    name: string;
    visitors: number;
    returningVisitors: number;
    uniqueVisitors: number;
    date: string;
  }>;
  hasData?: boolean;
}

const VisitorStatsTab: React.FC<VisitorStatsTabProps> = ({ 
  visitorStats, 
  visitorTrends = [], 
  hasData = true 
}) => {
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
          {visitorTrends && visitorTrends.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={visitorTrends}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="returningVisitors" 
                    stackId="2" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
              <BarChart className="h-8 w-8 text-gray-400 mr-2" />
              <p className="text-material-on-surface-variant text-sm">
                Not enough visitor data to display trends
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorStatsTab;
