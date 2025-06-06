
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEngagementScoring } from '@/hooks/useEngagementScoring';
import { RefreshCw, TrendingUp, Users, Award, AlertTriangle } from 'lucide-react';

interface EnhancedFollowerAnalyticsProps {
  promoterId: string;
}

const EnhancedFollowerAnalytics: React.FC<EnhancedFollowerAnalyticsProps> = ({ promoterId }) => {
  const { 
    followersWithScores, 
    isLoading, 
    calculateAllScores, 
    scoreDistribution 
  } = useEngagementScoring(promoterId);

  const totalFollowers = followersWithScores?.length || 0;
  const avgScore = followersWithScores?.reduce((sum, follower) => {
    return sum + (follower.engagement_score?.[0]?.overall_score || 0);
  }, 0) / totalFollowers || 0;

  const atRiskFollowers = followersWithScores?.filter(
    follower => (follower.churn_risk_score || 0) > 0.7
  ).length || 0;

  const topPerformers = followersWithScores?.filter(
    follower => (follower.engagement_score?.[0]?.overall_score || 0) >= 80
  ).length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFollowers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg. Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgScore)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{topPerformers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{atRiskFollowers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Engagement Score Distribution</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculateAllScores.mutate()}
              disabled={calculateAllScores.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${calculateAllScores.isPending ? 'animate-spin' : ''}`} />
              Recalculate All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {scoreDistribution?.excellent || 0}
              </div>
              <Badge variant="default">Excellent (80+)</Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {scoreDistribution?.good || 0}
              </div>
              <Badge variant="secondary">Good (60-79)</Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-yellow-600">
                {scoreDistribution?.average || 0}
              </div>
              <Badge variant="outline">Average (40-59)</Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {scoreDistribution?.poor || 0}
              </div>
              <Badge variant="destructive">Poor (20-39)</Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-600">
                {scoreDistribution?.inactive || 0}
              </div>
              <Badge variant="destructive">Inactive (0-19)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Followers List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Followers with Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading followers...</div>
            ) : followersWithScores?.slice(0, 10).map((follower) => {
              const score = follower.engagement_score?.[0]?.overall_score || 0;
              const scoreColor = score >= 80 ? 'text-green-600' : 
                               score >= 60 ? 'text-blue-600' : 
                               score >= 40 ? 'text-yellow-600' : 
                               score >= 20 ? 'text-orange-600' : 'text-red-600';

              return (
                <div key={follower.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      Follower {follower.subscriber_id.slice(0, 8)}...
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {follower.discovery_source && (
                        <span>Source: {follower.discovery_source} • </span>
                      )}
                      Tier: {follower.follower_tier}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${scoreColor}`}>
                      {Math.round(score)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {follower.engagement_count} interactions
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedFollowerAnalytics;
