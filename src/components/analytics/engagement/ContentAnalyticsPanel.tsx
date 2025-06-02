
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ContentAnalyticsPanelProps {
  data?: any;
  isLoading?: boolean;
}

const mockContentData = [
  { type: 'Reviews', count: 145, engagement: 78 },
  { type: 'Check-ins', count: 234, engagement: 92 },
  { type: 'Photos', count: 89, engagement: 65 },
  { type: 'Comments', count: 167, engagement: 83 },
];

const ContentAnalyticsPanel: React.FC<ContentAnalyticsPanelProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Engagement</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockContentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" name="Total Count" />
            <Bar dataKey="engagement" fill="#82ca9d" name="Engagement Score" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ContentAnalyticsPanel;
