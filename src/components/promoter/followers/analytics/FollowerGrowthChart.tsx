
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users, Calendar } from 'lucide-react';

interface GrowthData {
  date: string;
  newFollowers: number;
  totalFollowers: number;
  unfollowers: number;
}

interface FollowerGrowthChartProps {
  data: GrowthData[];
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
}

const FollowerGrowthChart: React.FC<FollowerGrowthChartProps> = ({
  data,
  timeRange,
  onTimeRangeChange
}) => {
  const totalGrowth = data.length > 0 ? data[data.length - 1].totalFollowers - data[0].totalFollowers : 0;
  const growthPercentage = data.length > 0 && data[0].totalFollowers > 0 
    ? ((totalGrowth / data[0].totalFollowers) * 100).toFixed(1) 
    : '0';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Follower Growth</CardTitle>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => onTimeRangeChange(e.target.value as any)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
            <option value="1y">1 Year</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-2xl font-bold">{totalGrowth > 0 ? '+' : ''}{totalGrowth}</span>
            <span className="text-sm text-muted-foreground">
              ({growthPercentage}% growth)
            </span>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalFollowers" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Total Followers"
              />
              <Line 
                type="monotone" 
                dataKey="newFollowers" 
                stroke="#10B981" 
                strokeWidth={2}
                name="New Followers"
              />
              <Line 
                type="monotone" 
                dataKey="unfollowers" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="Unfollowers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerGrowthChart;
