
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, TrendingUp, CircleSlash } from 'lucide-react';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import { useLoyaltyProgramMetrics } from '@/hooks/analytics/useLoyaltyProgramMetrics';

interface LoyaltyProgramPanelProps {
  establishmentId: string;
}

const LoyaltyProgramPanel: React.FC<LoyaltyProgramPanelProps> = ({ establishmentId }) => {
  const {
    memberCount, 
    activeMembers,
    redemptionRate,
    averagePoints,
    memberRetentionRate,
    data,
    isLoading,
    error
  } = useLoyaltyProgramMetrics(establishmentId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Loading loyalty program metrics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (memberCount === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program Performance</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <CircleSlash className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium text-material-on-surface-variant">No loyalty program data available</p>
          <p className="mt-2 text-material-on-surface-variant">
            Start a loyalty program to see analytics here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Program Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <AnalyticsMetricCard
              title="Total Members" 
              value={memberCount}
              icon={Users}
              iconColor="text-blue-500"
              backgroundColor="bg-blue-50"
            />
            <AnalyticsMetricCard
              title="Active Members" 
              value={activeMembers} 
              icon={Users}
              iconColor="text-green-500"
              backgroundColor="bg-green-50"
            />
            <AnalyticsMetricCard
              title="Redemption Rate" 
              value={`${redemptionRate}%`}
              icon={Award} 
              iconColor="text-purple-500"
              backgroundColor="bg-purple-50"
            />
            <AnalyticsMetricCard
              title="Retention Rate" 
              value={`${memberRetentionRate}%`}
              icon={TrendingUp}
              iconColor="text-orange-500"
              backgroundColor="bg-orange-50"
            />
          </div>
          
          <AnalyticsLineChart
            title="Loyalty Program Trends"
            description="Member signups, redemptions, and active members over time"
            data={data}
            series={[
              { key: 'signups', name: 'New Signups', color: '#8884d8' },
              { key: 'redemptions', name: 'Redemptions', color: '#82ca9d' },
              { key: 'activeMembers', name: 'Active Members', color: '#ffc658' }
            ]}
            height={300}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyProgramPanel;
