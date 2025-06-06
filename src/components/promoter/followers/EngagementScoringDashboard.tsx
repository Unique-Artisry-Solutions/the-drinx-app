
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useEngagementScoring } from '@/hooks/useEngagementScoring';
import { TrendingUp, TrendingDown, Users, Target, Settings, BarChart3 } from 'lucide-react';

interface EngagementScoringDashboardProps {
  promoterId: string;
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'platinum': return 'bg-gray-200 text-gray-800';
    case 'gold': return 'bg-yellow-100 text-yellow-800';
    case 'silver': return 'bg-gray-100 text-gray-700';
    case 'bronze': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const EngagementScoringDashboard: React.FC<EngagementScoringDashboardProps> = ({ promoterId }) => {
  const {
    followersWithScores,
    scoringRules,
    tierThresholds,
    isLoading,
    calculateAllScores,
    updateScoringRule,
    scoreDistribution,
    tierDistribution
  } = useEngagementScoring(promoterId);

  const [isCalculating, setIsCalculating] = useState(false);

  const handleRecalculateAll = async () => {
    setIsCalculating(true);
    try {
      await calculateAllScores.mutateAsync();
    } finally {
      setIsCalculating(false);
    }
  };

  const handleWeightUpdate = async (ruleId: string, newWeight: number) => {
    await updateScoringRule.mutateAsync({
      ruleId,
      updates: { current_weight: newWeight / 100 }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Scoring Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading engagement data...</div>
        </CardContent>
      </Card>
    );
  }

  const avgScore = followersWithScores?.reduce((sum, f) => sum + (f.engagement_score || 0), 0) / (followersWithScores?.length || 1) || 0;
  const topPerformers = followersWithScores?.filter(f => (f.engagement_score || 0) >= 75) || [];
  const needsAttention = followersWithScores?.filter(f => (f.engagement_score || 0) < 25) || [];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{avgScore.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Top Performers</p>
                <p className="text-2xl font-bold">{topPerformers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Needs Attention</p>
                <p className="text-2xl font-bold">{needsAttention.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Followers</p>
                <p className="text-2xl font-bold">{followersWithScores?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Tier Distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tier Distribution</CardTitle>
                <Button 
                  onClick={handleRecalculateAll}
                  disabled={isCalculating}
                  size="sm"
                >
                  {isCalculating ? 'Calculating...' : 'Recalculate All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {tierThresholds?.map((tier) => (
                  <div key={tier.id} className="text-center p-4 border rounded-lg">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: tier.color_code }}
                    />
                    <div className="font-medium capitalize">{tier.tier_name}</div>
                    <div className="text-2xl font-bold">
                      {tierDistribution?.[tier.tier_name] || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tier.min_score}-{tier.max_score || '100'} pts
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scoringRules?.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{rule.rule_name}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {rule.signal_type} Signal
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{(rule.current_weight * 100).toFixed(0)}%</div>
                      <Progress value={rule.current_weight * 100} className="w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {scoreDistribution?.bronze || 0}
                    </div>
                    <div className="text-sm">Bronze (0-24)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {scoreDistribution?.silver || 0}
                    </div>
                    <div className="text-sm">Silver (25-49)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {scoreDistribution?.gold || 0}
                    </div>
                    <div className="text-sm">Gold (50-74)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {scoreDistribution?.platinum || 0}
                    </div>
                    <div className="text-sm">Platinum (75+)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scoring Weight Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {scoringRules?.map((rule) => (
                  <div key={rule.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{rule.rule_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {rule.signal_type} component weight
                        </div>
                      </div>
                      <div className="font-medium">
                        {(rule.current_weight * 100).toFixed(0)}%
                      </div>
                    </div>
                    <Slider
                      value={[rule.current_weight * 100]}
                      onValueChange={([value]) => handleWeightUpdate(rule.id, value)}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Follower Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {followersWithScores?.slice(0, 10).map((follower) => (
                  <div key={follower.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">
                        Follower {follower.subscriber_id.slice(0, 8)}...
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last active: {follower.last_engagement_at ? 
                          new Date(follower.last_engagement_at).toLocaleDateString() : 
                          'Never'
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-medium">
                          {(follower.engagement_score || 0).toFixed(1)}
                        </div>
                        <Progress value={follower.engagement_score || 0} className="w-20" />
                      </div>
                      <Badge className={getTierColor(follower.engagement_tier)}>
                        {follower.engagement_tier}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EngagementScoringDashboard;
