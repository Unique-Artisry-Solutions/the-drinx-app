
import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { AudienceSegment } from '@/types/AudienceTypes';
import { format } from 'date-fns';

interface SegmentTrendsChartProps {
  dateRange?: DateRange;
  segments: AudienceSegment[];
  isLoading: boolean;
}

export function SegmentTrendsChart({ segments, isLoading }: SegmentTrendsChartProps) {
  const [metric, setMetric] = useState('growth');

  // Mock trend data - preserved as placeholder
  const trendData = [
    { date: '2024-01-01', segment1: 120, segment2: 80, segment3: 200 },
    { date: '2024-01-02', segment1: 125, segment2: 85, segment3: 195 },
    { date: '2024-01-03', segment1: 130, segment2: 90, segment3: 205 },
    { date: '2024-01-04', segment1: 128, segment2: 88, segment3: 210 },
    { date: '2024-01-05', segment1: 135, segment2: 92, segment3: 208 }
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Segment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segment Effectiveness Trends</CardTitle>
        <div className="flex items-center gap-4">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="growth">Growth Rate</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="conversion">Conversion</SelectItem>
              <SelectItem value="retention">Retention</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {segments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Select segments from the overlap analysis to view trends
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => format(new Date(value), 'PPP')}
              />
              <Legend />
              {segments.slice(0, 3).map((segment, index) => (
                <Line
                  key={segment.id}
                  type="monotone"
                  dataKey={`segment${index + 1}`}
                  stroke={colors[index]}
                  strokeWidth={2}
                  name={segment.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
