
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';

interface CampaignPerformanceProps {
  campaignId: string;
}

export const CampaignPerformance: React.FC<CampaignPerformanceProps> = ({ campaignId }) => {
  const _campaignId = campaignId; // Keep variable to avoid TS6133 error

  // Mock performance data - would fetch from API in real implementation
  const performanceData = {
    impressions: 12500,
    clicks: 850,
    conversions: 127,
    spend: 245.50,
    revenue: 1890.25,
    ctr: 6.8,
    conversionRate: 14.9,
    roas: 7.7
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    format = 'number' 
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    trend?: number; 
    format?: 'number' | 'currency' | 'percentage' 
  }) => {
    const formatValue = (val: number, fmt: string) => {
      switch (fmt) {
        case 'currency':
          return `$${val.toFixed(2)}`;
        case 'percentage':
          return `${val.toFixed(1)}%`;
        default:
          return val.toLocaleString();
      }
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{formatValue(value, format)}</p>
              {trend !== undefined && (
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">+{trend}%</span>
                </div>
              )}
            </div>
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Campaign Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Impressions"
              value={performanceData.impressions}
              icon={Users}
              trend={12.5}
            />
            <MetricCard
              title="Clicks"
              value={performanceData.clicks}
              icon={Target}
              trend={8.3}
            />
            <MetricCard
              title="Conversions"
              value={performanceData.conversions}
              icon={TrendingUp}
              trend={15.2}
            />
            <MetricCard
              title="Revenue"
              value={performanceData.revenue}
              icon={DollarSign}
              format="currency"
              trend={22.1}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Click-Through Rate"
          value={performanceData.ctr}
          icon={Target}
          format="percentage"
          trend={3.2}
        />
        <MetricCard
          title="Conversion Rate"
          value={performanceData.conversionRate}
          icon={TrendingUp}
          format="percentage"
          trend={5.8}
        />
        <MetricCard
          title="Return on Ad Spend"
          value={performanceData.roas}
          icon={DollarSign}
          format="number"
          trend={18.4}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Campaign Status</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Spend</span>
              <span className="font-bold">${performanceData.spend.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Revenue</span>
              <span className="font-bold text-green-600">${performanceData.revenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Net Profit</span>
              <span className="font-bold text-green-600">
                ${(performanceData.revenue - performanceData.spend).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignPerformance;
