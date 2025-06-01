
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth } from 'date-fns';

interface SegmentTrendsChartProps {
  segments: { id: string; name: string }[];
}

const SegmentTrendsChart = ({ segments }: SegmentTrendsChartProps) => {
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('30d');

  // Mock data for the chart
  const generateTrendData = () => {
    const data = [];
    const today = new Date();
    let startDate = new Date();

    if (selectedTimeRange === '30d') {
      startDate.setDate(today.getDate() - 30);
    } else if (selectedTimeRange === '90d') {
      startDate.setDate(today.getDate() - 90);
    } else if (selectedTimeRange === 'mtd') {
      startDate = startOfMonth(today);
    } else if (selectedTimeRange === 'ytd') {
      startDate = new Date(today.getFullYear(), 0, 1);
    }

    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      const date = format(currentDate, 'MMM dd');
      const value = Math.floor(Math.random() * 100) + 50; // Random value for the trend
      data.push({ date, value });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  const trendData = generateTrendData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segment Trends</CardTitle>
        <CardDescription>
          Analyze trends for selected audience segments over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                {segments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="mtd">Month to Date</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SegmentTrendsChart;
