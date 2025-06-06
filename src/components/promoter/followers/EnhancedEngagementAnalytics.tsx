
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useEngagementScoring } from '@/hooks/useEngagementScoring';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface EnhancedEngagementAnalyticsProps {
  promoterId: string;
}

const TIER_COLORS = {
  bronze: '#CD7F32',
  silver: '#C0C0C0', 
  gold: '#FFD700',
  platinum: '#E5E4E2'
};

const EnhancedEngagementAnalytics: React.FC<EnhancedEngagementAnalyticsProps> = ({ promoterId }) => {
  const { tiers, followerScores, isLoading, getTierForScore } = useEngagementScoring(promoterId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate engagement distribution
  const engagementDistribution = followerScores.reduce((acc: any, score: any) => {
    const tier = getTierForScore(score.overall_score || 0);
    const tierName = tier?.tier_name || 'unranked';
    acc[tierName] = (acc[tierName] || 0) + 1;
    return acc;
  }, {});

  const distributionData = Object.entries(engagementDistribution).map(([tier, count]) => ({
    tier: tier.charAt(0).toUpperCase() + tier.slice(1),
    count,
    percentage: Math.round((count as number / followerScores.length) * 100)
  }));

  // Score trend data (mock for now)
  const scoreTrendData = [
    { period: 'Week 1', avgScore: 45, newFollowers: 12 },
    { period: 'Week 2', avgScore: 52, newFollowers: 18 },
    { period: 'Week 3', avgScore: 48, newFollowers: 15 },
    { period: 'Week 4', avgScore: 61, newFollowers: 22 }
  ];

  // Engagement breakdown
  const avgScores = followerScores.reduce((acc: any, score: any) => {
    acc.activity += score.activity_score || 0;
    acc.interaction += score.interaction_score || 0;
    acc.loyalty += score.loyalty_score || 0;
    acc.recency += score.recency_score || 0;
    return acc;
  }, { activity: 0, interaction: 0, loyalty: 0, recency: 0 });

  const followerCount = followerScores.length || 1;
  const breakdownData = [
    { 
      category: 'Activity', 
      score: Math.round(avgScores.activity / followerCount),
      icon: Activity,
      color: 'text-blue-500'
    },
    { 
      category: 'Interaction', 
      score: Math.round(avgScores.interaction / followerCount),
      icon: Users,
      color: 'text-green-500'
    },
    { 
      category: 'Loyalty', 
      score: Math.round(avgScores.loyalty / followerCount),
      icon: Award,
      color: 'text-purple-500'
    },
    { 
      category: 'Recency', 
      score: Math.round(avgScores.recency / followerCount),
      icon: Target,
      color: 'text-orange-500'
    }
  ];

  const overallAverage = Math.round(
    breakdownData.reduce((sum, item) => sum + item.score, 0) / breakdownData.length
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                <p className="text-2xl font-bold">{overallAverage}</p>
                <p className="text-xs text-green-600">+5.2% from last week</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Engagement</p>
                <p className="text-2xl font-bold">
                  {followerScores.filter(s => (s.overall_score || 0) >= 70).length}
                </p>
                <p className="text-xs text-purple-600">
                  {Math.round((followerScores.filter(s => (s.overall_score || 0) >= 70).length / followerCount) * 100)}% of followers
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tiers</p>
                <p className="text-2xl font-bold">{tiers.length}</p>
                <p className="text-xs text-orange-600">Engagement levels</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Tier</p>
                <p className="text-2xl font-bold">
                  {distributionData.find(d => d.tier === 'Platinum')?.count || 0}
                </p>
                <p className="text-xs text-yellow-600">Platinum members</p>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
          <TabsTrigger value="distribution">Tier Distribution</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {breakdownData.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.category} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 ${item.color}`} />
                          <span className="font-medium">{item.category}</span>
                        </div>
                        <Badge variant="outline">{item.score}/100</Badge>
                      </div>
                      <Progress value={item.score} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {item.score >= 80 ? 'Excellent' : 
                         item.score >= 60 ? 'Good' : 
                         item.score >= 40 ? 'Average' : 'Needs Improvement'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tier Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ tier, percentage }) => `${tier}: ${percentage}%`}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={TIER_COLORS[entry.tier.toLowerCase() as keyof typeof TIER_COLORS] || '#8884d8'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tier Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {distributionData.map((item) => (
                    <div key={item.tier} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ 
                            backgroundColor: TIER_COLORS[item.tier.toLowerCase() as keyof typeof TIER_COLORS] || '#8884d8' 
                          }}
                        />
                        <span className="font-medium">{item.tier}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.count}</p>
                        <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scoreTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avgScore" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Average Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newFollowers" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="New Followers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Top Performing Segment</h4>
                    <p className="text-sm text-blue-700">
                      {distributionData[0]?.tier || 'Gold'} tier shows highest engagement with {distributionData[0]?.percentage || 35}% of followers
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Growth Opportunity</h4>
                    <p className="text-sm text-green-700">
                      {followerScores.filter(s => (s.overall_score || 0) >= 40 && (s.overall_score || 0) < 70).length} followers 
                      are close to tier upgrade
                    </p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900">Attention Needed</h4>
                    <p className="text-sm text-orange-700">
                      {followerScores.filter(s => (s.overall_score || 0) < 30).length} followers 
                      have low engagement scores
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Boost Low Performers</h4>
                      <p className="text-sm text-muted-foreground">
                        Create targeted content for followers with low engagement scores
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Reward Top Tiers</h4>
                      <p className="text-sm text-muted-foreground">
                        Offer exclusive benefits to maintain high-engagement followers
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-medium">Encourage Interaction</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on interactive content to improve overall scores
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedEngagementAnalytics;
