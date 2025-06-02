
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RewardTrendsProps {
  data?: any;
}

const mockTrendData = [
  { month: 'Jan', points: 2400, redemptions: 45 },
  { month: 'Feb', points: 1398, redemptions: 32 },
  { month: 'Mar', points: 9800, redemptions: 78 },
  { month: 'Apr', points: 3908, redemptions: 56 },
  { month: 'May', points: 4800, redemptions: 89 },
  { month: 'Jun', points: 3800, redemptions: 67 },
];

const RewardTrends: React.FC<RewardTrendsProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reward Program Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="points" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Points Earned"
            />
            <Line 
              type="monotone" 
              dataKey="redemptions" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="Redemptions"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RewardTrends;
