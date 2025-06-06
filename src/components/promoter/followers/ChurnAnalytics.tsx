
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, TrendingDown, Users, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ChurnAnalyticsProps {
  promoterId: string;
}

interface ChurnRiskFollower {
  id: string;
  subscriber_id: string;
  churn_risk_score: number;
  last_engagement_at: string | null;
  follower_tier: string;
  days_since_engagement: number;
}

const ChurnAnalytics: React.FC<ChurnAnalyticsProps> = ({ promoterId }) => {
  const { data: churnData, isLoading } = useQuery({
    queryKey: ['churn-analytics', promoterId],
    queryFn: async () => {
      // Get followers with churn risk scores
      const { data: followers, error } = await supabase
        .from('promoter_followers')
        .select('id, subscriber_id, churn_risk_score, last_engagement_at, follower_tier')
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (error) throw error;

      // Calculate days since last engagement
      const followersWithChurnData = followers.map(follower => ({
        ...follower,
        days_since_engagement: follower.last_engagement_at 
          ? Math.floor((new Date().getTime() - new Date(follower.last_engagement_at).getTime()) / (1000 * 3600 * 24))
          : 999
      }));

      // Categorize followers by churn risk
      const highRisk = followersWithChurnData.filter(f => f.churn_risk_score >= 0.7 || f.days_since_engagement > 30);
      const mediumRisk = followersWithChurnData.filter(f => f.churn_risk_score >= 0.4 && f.churn_risk_score < 0.7);
      const lowRisk = followersWithChurnData.filter(f => f.churn_risk_score < 0.4 && f.days_since_engagement <= 30);

      // Calculate engagement distribution
      const recentlyEngaged = followersWithChurnData.filter(f => f.days_since_engagement <= 7).length;
      const weeklyEngaged = followersWithChurnData.filter(f => f.days_since_engagement <= 14 && f.days_since_engagement > 7).length;
      const monthlyEngaged = followersWithChurnData.filter(f => f.days_since_engagement <= 30 && f.days_since_engagement > 14).length;
      const inactive = followersWithChurnData.filter(f => f.days_since_engagement > 30).length;

      return {
        totalFollowers: followersWithChurnData.length,
        highRisk,
        mediumRisk,
        lowRisk,
        engagementDistribution: {
          recentlyEngaged,
          weeklyEngaged,
          monthlyEngaged,
          inactive
        }
      };
    },
    enabled: !!promoterId
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse bg-gray-200 h-20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getChurnPercentage = (count: number) => {
    return churnData?.totalFollowers ? Math.round((count / churnData.totalFollowers) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Churn Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              High Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {churnData?.highRisk.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {getChurnPercentage(churnData?.highRisk.length || 0)}% of followers
            </div>
            <Progress 
              value={getChurnPercentage(churnData?.highRisk.length || 0)} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-yellow-500" />
              Medium Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {churnData?.mediumRisk.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {getChurnPercentage(churnData?.mediumRisk.length || 0)}% of followers
            </div>
            <Progress 
              value={getChurnPercentage(churnData?.mediumRisk.length || 0)} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              Low Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {churnData?.lowRisk.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              {getChurnPercentage(churnData?.lowRisk.length || 0)}% of followers
            </div>
            <Progress 
              value={getChurnPercentage(churnData?.lowRisk.length || 0)} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Engagement Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Engagement Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last 7 days</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{churnData?.engagementDistribution.recentlyEngaged || 0}</span>
                <Badge variant="secondary">
                  {getChurnPercentage(churnData?.engagementDistribution.recentlyEngaged || 0)}%
                </Badge>
              </div>
            </div>
            <Progress value={getChurnPercentage(churnData?.engagementDistribution.recentlyEngaged || 0)} />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">8-14 days ago</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{churnData?.engagementDistribution.weeklyEngaged || 0}</span>
                <Badge variant="secondary">
                  {getChurnPercentage(churnData?.engagementDistribution.weeklyEngaged || 0)}%
                </Badge>
              </div>
            </div>
            <Progress value={getChurnPercentage(churnData?.engagementDistribution.weeklyEngaged || 0)} />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">15-30 days ago</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{churnData?.engagementDistribution.monthlyEngaged || 0}</span>
                <Badge variant="secondary">
                  {getChurnPercentage(churnData?.engagementDistribution.monthlyEngaged || 0)}%
                </Badge>
              </div>
            </div>
            <Progress value={getChurnPercentage(churnData?.engagementDistribution.monthlyEngaged || 0)} />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-600">30+ days ago</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">{churnData?.engagementDistribution.inactive || 0}</span>
                <Badge variant="destructive">
                  {getChurnPercentage(churnData?.engagementDistribution.inactive || 0)}%
                </Badge>
              </div>
            </div>
            <Progress value={getChurnPercentage(churnData?.engagementDistribution.inactive || 0)} />
          </div>
        </CardContent>
      </Card>

      {/* High Risk Followers */}
      {churnData?.highRisk && churnData.highRisk.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">High Risk Followers - Immediate Action Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {churnData.highRisk.slice(0, 5).map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                  <div>
                    <div className="font-medium">
                      Follower {follower.subscriber_id.slice(0, 8)}...
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {follower.days_since_engagement === 999 
                        ? 'Never engaged' 
                        : `${follower.days_since_engagement} days since last engagement`}
                    </div>
                  </div>
                  <Badge variant="destructive">
                    Risk: {Math.round(follower.churn_risk_score * 100)}%
                  </Badge>
                </div>
              ))}
              {churnData.highRisk.length > 5 && (
                <div className="text-center text-sm text-muted-foreground">
                  +{churnData.highRisk.length - 5} more high-risk followers
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChurnAnalytics;
