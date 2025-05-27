
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import { TrendingDown, TrendingUp, Target } from 'lucide-react';

interface ConversionFunnelAnalysisProps {
  eventId: string;
}

const ConversionFunnelAnalysis: React.FC<ConversionFunnelAnalysisProps> = ({ eventId }) => {
  // Mock funnel data - in production, this would come from API
  const funnelStages = [
    {
      stage: 'Event Page Views',
      users: 2500,
      percentage: 100,
      conversionRate: 100,
      dropoffRate: 0
    },
    {
      stage: 'Ticket Info Viewed',
      users: 1875,
      percentage: 75,
      conversionRate: 75,
      dropoffRate: 25
    },
    {
      stage: 'Registration Started',
      users: 1125,
      percentage: 45,
      conversionRate: 60,
      dropoffRate: 40
    },
    {
      stage: 'Payment Initiated',
      users: 675,
      percentage: 27,
      conversionRate: 60,
      dropoffRate: 40
    },
    {
      stage: 'Purchase Completed',
      users: 540,
      percentage: 21.6,
      conversionRate: 80,
      dropoffRate: 20
    }
  ];

  const conversionByChannel = [
    { name: 'Social Media', visitors: 800, conversions: 120 },
    { name: 'Email Campaign', visitors: 600, conversions: 180 },
    { name: 'Direct Traffic', visitors: 400, conversions: 100 },
    { name: 'Referrals', visitors: 300, conversions: 90 },
    { name: 'Search', visitors: 400, conversions: 50 }
  ];

  const timeBasedConversion = [
    { name: 'Week 1', rate: 18.5 },
    { name: 'Week 2', rate: 21.2 },
    { name: 'Week 3', rate: 19.8 },
    { name: 'Week 4', rate: 23.1 },
    { name: 'Week 5', rate: 21.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Funnel Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Overall Conversion</div>
            </div>
            <div className="text-2xl font-bold mt-1">21.6%</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +2.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div className="text-sm font-medium">Highest Dropoff</div>
            </div>
            <div className="text-2xl font-bold mt-1">40%</div>
            <div className="text-xs text-muted-foreground mt-2">
              At registration stage
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Best Performer</div>
            </div>
            <div className="text-2xl font-bold mt-1">80%</div>
            <div className="text-xs text-muted-foreground mt-2">
              Payment to completion
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelStages.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{stage.stage}</div>
                      <div className="text-sm text-muted-foreground">
                        {stage.users.toLocaleString()} users ({stage.percentage}%)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <Badge 
                        variant={stage.dropoffRate > 30 ? "destructive" : "outline"}
                        className={stage.dropoffRate > 30 ? "text-red-600" : ""}
                      >
                        -{stage.dropoffRate}% dropoff
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {stage.conversionRate}% conversion
                    </Badge>
                  </div>
                </div>
                <Progress value={stage.percentage} className="h-3" />
                {index < funnelStages.length - 1 && (
                  <div className="absolute left-4 top-12 w-0.5 h-4 bg-gray-300" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={conversionByChannel}
              height={300}
              series={[
                { key: 'visitors', name: 'Visitors', color: '#8B5CF6' },
                { key: 'conversions', name: 'Conversions', color: '#10B981' }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsBarChart
              data={timeBasedConversion}
              height={300}
              series={[
                { key: 'rate', name: 'Conversion Rate (%)', color: '#3B82F6' }
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConversionFunnelAnalysis;
