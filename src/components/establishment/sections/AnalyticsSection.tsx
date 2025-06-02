
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

interface AnalyticsSectionProps {
  establishmentId: string;
  visitorStats: {
    totalVisits: number;
    uniqueVisitors: number;
    returningVisitors: number;
    hasData: boolean;
    isLoading: boolean;
    error: string | null;
  };
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ visitorStats }) => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const metrics = [
    { value: 'revenue', label: 'Revenue', icon: DollarSign },
    { value: 'customers', label: 'Customers', icon: Users },
    { value: 'visits', label: 'Visits', icon: TrendingUp },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Date Range:</span>
            <div className="text-sm text-gray-600">
              Last 7 days
            </div>
          </div>
          <Select onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => (
                <SelectItem key={metric.value} value={metric.value}>
                  {metric.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Visits</p>
                  <p className="text-2xl font-bold">{visitorStats.totalVisits}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unique Visitors</p>
                  <p className="text-2xl font-bold">{visitorStats.uniqueVisitors}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Returning Visitors</p>
                  <p className="text-2xl font-bold">{visitorStats.returningVisitors}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-2">
            <div>
              <Badge variant="secondary">
                <TrendingUp className="w-4 h-4 mr-2" />
                {selectedMetric}
              </Badge>
            </div>
            <p>Overview analytics content for {selectedMetric} and date range.</p>
          </TabsContent>
          <TabsContent value="detailed">
            <p>Detailed analytics content for {selectedMetric} and date range.</p>
          </TabsContent>
        </Tabs>

        <Button variant="outline">Generate Report</Button>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSection;
