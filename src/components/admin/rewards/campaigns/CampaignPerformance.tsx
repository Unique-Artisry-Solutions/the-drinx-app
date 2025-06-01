
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Award, Target } from 'lucide-react';
import { RewardCampaign } from '@/types/rewards/campaigns';

interface CampaignPerformanceProps {
  campaign: RewardCampaign;
}

interface PerformanceMetrics {
  total_users_reached?: number;
  total_rewards_claimed?: number;
  engagement_rate?: number;
  total_points_awarded?: number;
  daily_metrics?: Array<{
    date: string;
    users_reached: number;
    rewards_claimed: number;
    points_awarded: number;
    engagement_rate: number;
  }>;
}

export const CampaignPerformance: React.FC<CampaignPerformanceProps> = ({ campaign }) => {
  const metrics = (campaign.performance_metrics || {}) as PerformanceMetrics;

  // Safely access daily_metrics with fallback
  const dailyMetrics = metrics.daily_metrics || [];
  
  const chartData = dailyMetrics.map(day => ({
    date: day.date,
    users: day.users_reached || 0,
    rewards: day.rewards_claimed || 0,
    points: day.points_awarded || 0,
    engagement: (day.engagement_rate || 0) * 100
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{campaign.name}</CardTitle>
              {campaign.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {campaign.description}
                </p>
              )}
            </div>
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.total_users_reached || 0}
              </div>
              <div className="text-sm text-muted-foreground">Users Reached</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.total_rewards_claimed || 0}
              </div>
              <div className="text-sm text-muted-foreground">Rewards Claimed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((metrics.engagement_rate || 0) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.total_points_awarded || 0}
              </div>
              <div className="text-sm text-muted-foreground">Points Awarded</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Users Reached"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rewards" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Rewards Claimed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    name="Engagement %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaign Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>User Acquisition</span>
                  <span>{metrics.total_users_reached || 0} / 1000</span>
                </div>
                <Progress value={(metrics.total_users_reached || 0) / 10} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Engagement Rate</span>
                  <span>{((metrics.engagement_rate || 0) * 100).toFixed(1)}% / 25%</span>
                </div>
                <Progress value={(metrics.engagement_rate || 0) * 4 * 100} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Campaign Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(campaign.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(campaign.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget:</span>
                <span>{campaign.budget ? `$${campaign.budget}` : 'No limit'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active:</span>
                <span>{campaign.is_active ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignPerformance;
