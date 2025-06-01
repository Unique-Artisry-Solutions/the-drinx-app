import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CampaignPerformanceProps {
  campaignId: string;
}

export function CampaignPerformance({ campaignId }: CampaignPerformanceProps) {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock performance data - preserved as placeholder
  const performanceMetrics = {
    impressions: 5420,
    clicks: 234,
    conversions: 45,
    spend: 128.50
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Campaign Performance</CardTitle>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{performanceMetrics.impressions.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Impressions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{performanceMetrics.clicks}</div>
            <div className="text-sm text-muted-foreground">Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{performanceMetrics.conversions}</div>
            <div className="text-sm text-muted-foreground">Conversions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${performanceMetrics.spend}</div>
            <div className="text-sm text-muted-foreground">Spend</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
