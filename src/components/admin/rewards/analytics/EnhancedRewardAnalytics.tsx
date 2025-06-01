import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';

interface EnhancedRewardAnalyticsProps {
  establishmentId?: string;
}

export function EnhancedRewardAnalytics({ establishmentId }: EnhancedRewardAnalyticsProps) {
  const [dateRange] = useState<DateRange | undefined>();
  const [selectedMetric, setSelectedMetric] = useState('points-earned');

  // Mock analytics data - preserved as placeholder
  const analyticsData = {
    totalPoints: 15420,
    totalRedemptions: 89,
    activeUsers: 234,
    conversionRate: 12.5
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Enhanced Reward Analytics</CardTitle>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="points-earned">Points Earned</SelectItem>
            <SelectItem value="redemptions">Redemptions</SelectItem>
            <SelectItem value="user-activity">User Activity</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{analyticsData.totalPoints.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{analyticsData.totalRedemptions}</div>
            <div className="text-sm text-muted-foreground">Redemptions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{analyticsData.activeUsers}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
          </div>
        </div>
        
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">
            Analytics chart for {selectedMetric} would appear here
            {establishmentId && ` for establishment ${establishmentId}`}
            {dateRange && ' for selected date range'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
