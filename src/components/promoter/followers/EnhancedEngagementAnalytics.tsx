
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageCircle, 
  Heart,
  Share2,
  Eye,
  Target,
  Award,
  Activity
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useEngagementScoring } from '@/hooks/useEngagementScoring';

interface EnhancedEngagementAnalyticsProps {
  promoterId: string;
}

const EnhancedEngagementAnalytics: React.FC<EnhancedEngagementAnalyticsProps> = ({ promoterId }) => {
  const { followers, isLoading } = useSubscriptions(promoterId);
  const { tiers, followerScores } = useEngagementScoring(promoterId);

  // Mock engagement data for demonstration
  const engagementData = [
    { date: '2024-01', views: 1200, likes: 340, comments: 89, shares: 23 },
    { date: '2024-02', views: 1350, likes: 385, comments: 102, shares: 31 },
    { date: '2024-03', views: 1580, likes: 445, comments: 127, shares: 38 },
    { date: '2024-04', views: 1420, likes: 390, comments: 95, shares: 28 },
    { date: '2024-05', views: 1680, likes: 478, comments: 134, shares: 42 },
    { date: '2024-06', views: 1850, likes: 523, comments: 156, shares: 48 }
  ];

  const tierDistribution = [
    { name: 'Bronze', value: 45, color: '#CD7F32' },
    { name: 'Silver', value: 35, color: '#C0C0C0' },
    { name: 'Gold', value: 15, color: '#FFD700' },
    { name: 'Platinum', value: 5, color: '#E5E4E2' }
  ];

  const engagementMetrics = {
    totalEngagements: 2847,
    averageEngagementRate: 4.2,
    topPerformingContent: 'Summer Event Announcement',
    monthlyGrowth: 12.5
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-200 h-3 w-full rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{followers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementMetrics.averageEngagementRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +0.8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagements</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementMetrics.totalEngagements.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +{engagementMetrics.monthlyGrowth}% this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Content</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{engagementMetrics.topPerformingContent}</div>
            <p className="text-xs text-muted-foreground">
              Best performing this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="views" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="likes" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              <Area type="monotone" dataKey="comments" stackId="1" stroke="#ffc658" fill="#ffc658" />
              <Area type="monotone" dataKey="shares" stackId="1" stroke="#ff7300" fill="#ff7300" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Breakdown and Tier Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={engagementData.slice(-4)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" name="Views" />
                <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
                <Bar dataKey="comments" fill="#ffc658" name="Comments" />
                <Bar dataKey="shares" fill="#ff7300" name="Shares" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follower Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={tierDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tierDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: 'Summer Event Announcement', engagements: 2847, type: 'Event' },
              { title: 'New Cocktail Menu Reveal', engagements: 1923, type: 'Promotion' },
              { title: 'Behind the Scenes Video', engagements: 1456, type: 'Content' },
              { title: 'Customer Spotlight', engagements: 1234, type: 'Social' }
            ].map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="font-medium">{content.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {String(content.engagements)} engagements
                  </div>
                </div>
                <Badge variant="outline">{content.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { range: '90-100', count: 12, percentage: 8 },
              { range: '80-89', count: 28, percentage: 18 },
              { range: '70-79', count: 45, percentage: 28 },
              { range: '60-69', count: 38, percentage: 24 },
              { range: '50-59', count: 23, percentage: 15 },
              { range: '0-49', count: 14, percentage: 9 }
            ].map((score, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium">{score.range}</div>
                <div className="flex-1">
                  <Progress value={score.percentage} className="h-2" />
                </div>
                <div className="w-12 text-sm text-muted-foreground">{score.count}</div>
                <div className="w-12 text-sm text-muted-foreground">{score.percentage}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedEngagementAnalytics;
