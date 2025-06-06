
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEngagementScoring } from '@/hooks/useEngagementScoring';
import { Trophy, Star, Award, Crown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import EngagementScoreWidget from './EngagementScoreWidget';

interface EngagementScoringDashboardProps {
  promoterId: string;
}

const EngagementScoringDashboard: React.FC<EngagementScoringDashboardProps> = ({ promoterId }) => {
  const { tiers, followerScores, isLoading, getTierForScore } = useEngagementScoring(promoterId);

  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'platinum': return <Crown className="h-4 w-4" />;
      case 'gold': return <Trophy className="h-4 w-4" />;
      case 'silver': return <Award className="h-4 w-4" />;
      case 'bronze': return <Star className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const tierDistribution = tiers.reduce((acc, tier) => {
    const count = followerScores.filter(score => {
      const followerTier = getTierForScore(score.overall_score || 0);
      return followerTier?.tier_name === tier.tier_name;
    }).length;
    acc[tier.tier_name] = count;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Scoring Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading engagement data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tier Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <Card key={tier.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {tier.tier_name} Tier
              </CardTitle>
              <div style={{ color: tier.tier_color }}>
                {getTierIcon(tier.tier_name)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tierDistribution[tier.tier_name] || 0}</div>
              <p className="text-xs text-muted-foreground">
                {tier.min_score}-{tier.max_score} points
              </p>
              <div className="mt-2">
                <Badge 
                  variant="outline" 
                  style={{ 
                    borderColor: tier.tier_color,
                    color: tier.tier_color 
                  }}
                >
                  {tier.tier_benefits.length} benefits
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tiers.map((tier) => {
              const count = tierDistribution[tier.tier_name] || 0;
              const percentage = followerScores.length > 0 ? (count / followerScores.length) * 100 : 0;
              
              return (
                <div key={tier.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tier.tier_color }}
                      ></div>
                      <span className="font-medium capitalize">{tier.tier_name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({tier.min_score}-{tier.max_score} pts)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{count} followers</span>
                      <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    style={{
                      '--progress-background': tier.tier_color
                    } as React.CSSProperties}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      {followerScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followerScores
                .sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))
                .slice(0, 5)
                .map((score) => {
                  const tier = getTierForScore(score.overall_score || 0);
                  return (
                    <div key={score.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: tier?.tier_color || '#gray' }}
                        >
                          <span className="text-white text-xs font-bold">
                            {(score.overall_score || 0).toFixed(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            Follower {score.follower_id?.slice(0, 8)}...
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tier?.tier_name || 'Unranked'} tier
                          </div>
                        </div>
                      </div>
                      <EngagementScoreWidget
                        followerId={score.follower_id || ''}
                        score={score.overall_score || 0}
                        tier={tier?.tier_name as any || 'bronze'}
                        compact={true}
                      />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EngagementScoringDashboard;
