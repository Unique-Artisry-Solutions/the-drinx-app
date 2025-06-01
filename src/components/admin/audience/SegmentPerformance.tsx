import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface SegmentPerformanceProps {
  segmentId: string;
  name: string;
  description: string;
  size: number;
  status: 'active' | 'inactive';
}

interface PerformanceData {
  name: string;
  conversions: number;
  engagement: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  change: string;
}

const SegmentPerformance = () => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');

  const segments = [
    { id: 'all', name: 'All Users' },
    { id: 'high-value', name: 'High Value Customers' },
    { id: 'new-users', name: 'New Users' }
  ];

  const metricCards = [
    { title: 'Total Users', value: '12,456', icon: Users, change: '+8.2%' },
    { title: 'Conversion Rate', value: '4.5%', icon: Target, change: '+0.3%' },
    { title: 'Engagement Score', value: '78', icon: Activity, change: '-1.1%' },
    { title: 'Growth Rate', value: '+2.1%', icon: TrendingUp, change: '+0.5%' }
  ];

  const performanceData = [
    { name: 'Week 1', conversions: 45, engagement: 68 },
    { name: 'Week 2', conversions: 52, engagement: 74 },
    { name: 'Week 3', conversions: 48, engagement: 71 },
    { name: 'Week 4', conversions: 61, engagement: 79 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Segment Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Analyze performance metrics for different audience segments
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Segment" />
            </SelectTrigger>
            <SelectContent>
              {segments.map((segment) => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm text-muted-foreground">
                  {card.change} from last period
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Conversion and engagement rates over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="conversions" fill="#8884d8" name="Conversions" />
              <Bar dataKey="engagement" fill="#82ca9d" name="Engagement" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SegmentPerformance;
