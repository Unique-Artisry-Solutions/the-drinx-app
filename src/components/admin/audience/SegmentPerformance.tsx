
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface SegmentPerformanceProps {
  segmentId: string;
}

export function SegmentPerformance({ }: SegmentPerformanceProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock performance data - preserved as placeholder
  const performanceData = [
    { date: '2024-01-01', engagement: 85, conversion: 12, growth: 5 },
    { date: '2024-01-08', engagement: 88, conversion: 14, growth: 8 },
    { date: '2024-01-15', engagement: 92, conversion: 16, growth: 12 },
    { date: '2024-01-22', engagement: 87, conversion: 15, growth: 7 }
  ];

  const segmentMetrics = {
    totalMembers: 1245,
    avgEngagement: 88.5,
    conversionRate: 14.2,
    growthRate: 8.1
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Segment Performance</CardTitle>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{segmentMetrics.totalMembers.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{segmentMetrics.avgEngagement}%</div>
                  <div className="text-sm text-muted-foreground">Avg Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{segmentMetrics.conversionRate}%</div>
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{segmentMetrics.growthRate}%</div>
                  <div className="text-sm text-muted-foreground">Growth Rate</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="engagement" fill="#8884d8" />
                    <Bar dataKey="conversion" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span>Performance Trend</span>
                      <Badge variant="default">Improving</Badge>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span>Engagement Quality</span>
                      <Badge variant="secondary">High</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
