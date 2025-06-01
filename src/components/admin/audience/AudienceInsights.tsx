import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, BarChart3 } from 'lucide-react';

interface SegmentAnalytics {
  id: string;
  name: string;
  totalMembers: number;
  engagementRate: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'stable';
}

const AudienceInsights: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Mock data for demo
  const segmentAnalytics: SegmentAnalytics[] = [
    {
      id: '1',
      name: 'High-Value Customers',
      totalMembers: 1250,
      engagementRate: 0.68,
      conversionRate: 0.23,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Event Attendees',
      totalMembers: 890,
      engagementRate: 0.75,
      conversionRate: 0.31,
      trend: 'up'
    },
    {
      id: '3',
      name: 'Loyalty Program Members',
      totalMembers: 1580,
      engagementRate: 0.82,
      conversionRate: 0.45,
      trend: 'stable'
    },
    {
      id: '4',
      name: 'New Users (Last 30 Days)',
      totalMembers: 320,
      engagementRate: 0.55,
      conversionRate: 0.15,
      trend: 'down'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
          <CardDescription>Overview of audience segment performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Segment Performance</h3>
              <p className="text-sm text-muted-foreground">
                Analyzing audience behavior over the last {selectedTimeframe}
              </p>
            </div>
            <select
              className="border rounded px-2 py-1"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {segmentAnalytics.map((segment) => (
              <Card key={segment.id}>
                <CardHeader>
                  <CardTitle>{segment.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">
                      {segment.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : segment.trend === 'down' ? (
                        <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                      ) : (
                        <TrendingUp className="h-4 w-4 mr-1 rotate-90" />
                      )}
                      {segment.trend}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Total Members: {segment.totalMembers}</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-2 text-green-500" />
                      <span>Engagement Rate: {(segment.engagementRate * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Conversion Rate: {(segment.conversionRate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Analysis</CardTitle>
          <CardDescription>Explore detailed reports and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed analytics and reporting features will be added in the next iteration.
          </p>
          <Button>Generate Report</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudienceInsights;
