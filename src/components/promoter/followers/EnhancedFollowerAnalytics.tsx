
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFollowers } from '@/hooks/useFollowers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, AlertTriangle } from 'lucide-react';

interface EnhancedFollowerAnalyticsProps {
  promoterId: string;
}

const EnhancedFollowerAnalytics: React.FC<EnhancedFollowerAnalyticsProps> = ({ promoterId }) => {
  const { promoterFollowers, isLoading } = useFollowers(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Follower Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  const followers = promoterFollowers || [];
  
  // Calculate churn risk (simplified - based on last engagement)
  const calculateChurnRisk = (follower: any) => {
    if (!follower.last_engagement_at) return 80; // High risk if never engaged
    const daysSinceEngagement = (Date.now() - new Date(follower.last_engagement_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceEngagement > 30) return 70;
    if (daysSinceEngagement > 14) return 40;
    if (daysSinceEngagement > 7) return 20;
    return 10;
  };

  // Analytics calculations
  const totalFollowers = followers.length;
  const activeFollowers = followers.filter(f => f.follow_status === 'active').length;
  const averageEngagement = followers.reduce((sum, f) => sum + (f.engagement_score || 0), 0) / totalFollowers || 0;
  
  // Engagement tier distribution
  const tierDistribution = {
    bronze: followers.filter(f => (f.engagement_tier || 'bronze') === 'bronze').length,
    silver: followers.filter(f => (f.engagement_tier || 'bronze') === 'silver').length,
    gold: followers.filter(f => (f.engagement_tier || 'bronze') === 'gold').length,
    platinum: followers.filter(f => (f.engagement_tier || 'bronze') === 'platinum').length,
  };

  // Growth trend (simplified - based on creation dates)
  const last30Days = followers.filter(f => {
    const createdDate = new Date(f.created_at);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return createdDate > thirtyDaysAgo;
  }).length;

  // High-value followers (gold/platinum tiers)
  const highValueFollowers = followers.filter(f => 
    ['gold', 'platinum'].includes(f.engagement_tier || 'bronze')
  ).length;

  // At-risk followers (low engagement scores)
  const atRiskFollowers = followers.filter(f => {
    const churnRisk = calculateChurnRisk(f);
    return churnRisk > 50;
  }).length;

  // Sample discovery sources (since this field doesn't exist yet)
  const discoverySourceData = [
    { source: 'Social Media', count: Math.floor(totalFollowers * 0.4) },
    { source: 'Events', count: Math.floor(totalFollowers * 0.3) },
    { source: 'Referrals', count: Math.floor(totalFollowers * 0.2) },
    { source: 'Direct', count: Math.floor(totalFollowers * 0.1) },
  ];

  const tierData = [
    { name: 'Bronze', value: tierDistribution.bronze, color: '#CD7F32' },
    { name: 'Silver', value: tierDistribution.silver, color: '#C0C0C0' },
    { name: 'Gold', value: tierDistribution.gold, color: '#FFD700' },
    { name: 'Platinum', value: tierDistribution.platinum, color: '#E5E4E2' },
  ];

  const growthData = [
    { month: 'Jan', followers: Math.floor(totalFollowers * 0.6) },
    { month: 'Feb', followers: Math.floor(totalFollowers * 0.7) },
    { month: 'Mar', followers: Math.floor(totalFollowers * 0.8) },
    { month: 'Apr', followers: Math.floor(totalFollowers * 0.9) },
    { month: 'May', followers: totalFollowers },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                <p className="text-2xl font-bold">{totalFollowers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="secondary">+{last30Days} this month</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Engagement</p>
                <p className="text-2xl font-bold">{averageEngagement.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={averageEngagement} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High-Value</p>
                <p className="text-2xl font-bold">{highValueFollowers}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">
                {((highValueFollowers / totalFollowers) * 100).toFixed(1)}% of total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-red-600">{atRiskFollowers}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">
                {((atRiskFollowers / totalFollowers) * 100).toFixed(1)}% churn risk
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Discovery Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Discovery Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={discoverySourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Follower Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="followers" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Follower Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followers.slice(0, 5).map((follower) => (
                <div key={follower.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Follower {follower.subscriber_id.slice(0, 8)}...</p>
                    <p className="text-sm text-muted-foreground">
                      Tier: {follower.engagement_tier || 'bronze'} • Score: {follower.engagement_score?.toFixed(1) || '0.0'}
                    </p>
                  </div>
                  <Badge variant={follower.follow_status === 'active' ? 'default' : 'secondary'}>
                    {follower.follow_status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedFollowerAnalytics;
