
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, TrendingUp, Zap } from 'lucide-react';
import { ComparisonItem } from '@/components/admin/systemBreakdown/components/ComparisonItem';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';

interface LoyaltyStats {
  memberCount: number;
  activeMembers: number;
  redemptionRate: number;
  averagePoints: number;
  memberRetentionRate: number;
}

interface LoyaltyAnalyticsSectionProps {
  stats: LoyaltyStats;
  programActive: boolean;
  rewardsCount: number;
}

const LoyaltyAnalyticsSection: React.FC<LoyaltyAnalyticsSectionProps> = ({ 
  stats, 
  programActive,
  rewardsCount 
}) => {
  // Sample data for charts
  const enrollmentData = [
    { name: 'Jan', members: 18 },
    { name: 'Feb', members: 22 },
    { name: 'Mar', members: 30 },
    { name: 'Apr', members: 25 },
    { name: 'May', members: 40 },
    { name: 'Jun', members: 45 },
  ];
  
  const activityData = [
    { name: 'Jan', pointsEarned: 1250, pointsRedeemed: 850 },
    { name: 'Feb', pointsEarned: 1400, pointsRedeemed: 1100 },
    { name: 'Mar', pointsEarned: 2000, pointsRedeemed: 1300 },
    { name: 'Apr', pointsEarned: 1800, pointsRedeemed: 1500 },
    { name: 'May', pointsEarned: 2400, pointsRedeemed: 1800 },
    { name: 'Jun', pointsEarned: 2800, pointsRedeemed: 2000 }
  ];
  
  const comparisonData = [
    { label: 'Members that Redeem Rewards', percentage: stats.redemptionRate || 0 },
    { label: 'Member Retention Rate', percentage: stats.memberRetentionRate || 0 },
    { label: 'Program Completion Rate', percentage: 72 }
  ];

  if (!programActive) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Loyalty Program Not Active</h3>
            <p className="text-gray-500 mb-4">Activate your loyalty program to start collecting analytics data.</p>
            <p className="text-sm text-gray-400">You can activate your program in the Configuration tab.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stats.memberCount === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No Analytics Data Yet</h3>
            <p className="text-gray-500 mb-4">
              Your loyalty program is active, but you don't have any members yet.
            </p>
            <p className="text-sm text-gray-400">
              As customers join your program, you'll see analytics data here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Total Members" 
          value={stats.memberCount}
          icon={Users}
          iconColor="text-blue-500"
          backgroundColor="bg-blue-50"
        />
        <AnalyticsMetricCard
          title="Active Members" 
          value={stats.activeMembers} 
          icon={Zap}
          iconColor="text-green-500"
          backgroundColor="bg-green-50"
        />
        <AnalyticsMetricCard
          title="Avg. Points Balance" 
          value={stats.averagePoints}
          icon={Award} 
          iconColor="text-purple-500"
          backgroundColor="bg-purple-50"
        />
        <AnalyticsMetricCard
          title="Retention Rate" 
          value={`${stats.memberRetentionRate}%`}
          icon={TrendingUp}
          iconColor="text-orange-500"
          backgroundColor="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsLineChart
          title="Membership Growth"
          description="New enrollments over time"
          data={enrollmentData}
          series={[
            { key: 'members', name: 'New Members', color: '#8884d8' }
          ]}
          height={280}
        />
        
        <AnalyticsLineChart
          title="Points Activity"
          description="Points earned vs. redeemed over time"
          data={activityData}
          series={[
            { key: 'pointsEarned', name: 'Points Earned', color: '#82ca9d' },
            { key: 'pointsRedeemed', name: 'Points Redeemed', color: '#ffc658' }
          ]}
          height={280}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Redemptions by Reward</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center justify-center">
              <p className="text-gray-500">
                {rewardsCount === 0 ? 
                  "No rewards have been created yet" : 
                  "Redemption data will appear here as customers redeem rewards"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Program Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparisonData.map((item, index) => (
                <ComparisonItem
                  key={index}
                  label={item.label}
                  percentage={item.percentage}
                  color={
                    item.percentage >= 70 ? 'bg-green-500' :
                    item.percentage >= 40 ? 'bg-amber-500' : 'bg-red-500'
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoyaltyAnalyticsSection;
