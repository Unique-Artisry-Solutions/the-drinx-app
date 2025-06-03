
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeSeriesData } from '@/lib/rewards/types';

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title?: string;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, title = "Points Over Time" }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart 
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pointsEarned" stroke="#8884d8" name="Points Earned" />
            <Line type="monotone" dataKey="pointsRedeemed" stroke="#82ca9d" name="Points Redeemed" />
            <Line type="monotone" dataKey="netPoints" stroke="#ffc658" name="Net Change" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesChart;
