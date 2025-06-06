
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useEngagementScoring } from '@/hooks/useEngagementScoring';
import { 
  TrendingUp, 
  Award, 
  Users, 
  Target,
  ArrowUp,
  Clock,
  Star,
  Crown
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';

interface TierProgressionTrackingProps {
  promoterId: string;
}

const TierProgressionTracking: React.FC<TierProgressionTrackingProps> = ({ promoterId }) => {
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

  // Calculate tier distribution and progression opportunities
  const tierAnalysis = tiers.map(tier => {
    const currentMembers = followerScores.filter(score => {
      const followerTier = getTierForScore(score.overall_score || 0);
      return followerTier?.tier_name === tier.tier_name;
    });

    const upgradeEligible = followerScores.filter(score => {
      const currentScore = score.overall_score || 0;
      return currentScore >= (tier.min_score - 10) && currentScore < tier.min_score;
    });

    return {
      ...tier,
      currentMembers: currentMembers.length,
      upgradeEligible: upgradeEligible.length,
      averageScore: currentMembers.length > 0 
        ? Math.round(currentMembers.reduce((sum, s) => sum + (s.overall_score || 0), 0) / currentMembers.length)
        : 0
    };
  });

  // Mock progression timeline data
  const progressionTimeline = [
    { month: 'Jan', bronze: 45, silver: 25, gold: 15, platinum: 5 },
    { month: 'Feb', bronze: 42, silver: 28, gold: 18, platinum: 7 },
    { month: 'Mar', bronze: 38, silver: 32, gold: 22, platinum: 8 },
    { month: 'Apr', bronze: 35, silver: 35, gold: 20, platinum: 10 },
    { month: 'May', bronze: 32, silver: 33, gold: 25, platinum: 10 },
    { month: 'Jun', bronze: 30, silver: 35, gold: 23, platinum: 12 }
  ];

  // Upgrade pathway analysis
  const upgradeOpportunities = followerScores
    .map(score => {
      const currentTier = getTierForScore(score.overall_score || 0);
      const nextTier = tiers.find(t => t.min_score > (score.overall_score || 0));
      
      if (!nextTier) return null;
      
      const pointsNeeded = nextTier.min_score - (score.overall_score || 0);
      const timeToUpgrade = Math.ceil(pointsNeeded / 5); // Assume 5 points per week
      
      return {
        followerId: score.follower_id,
        currentScore: score.overall_score || 0,
        currentTier: currentTier?.tier_name || 'unranked',
        nextTier: nextTier.tier_name,
        pointsNeeded,
        timeToUpgrade,
        upgradeValue: nextTier.tier_benefits.length - (currentTier?.tier_benefits.length || 0)
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a?.pointsNeeded || 0) - (b?.pointsNeeded || 0))
    .slice(0, 10);

  const tierColors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700', 
    platinum: '#E5E4E2'
  };

  const tierIcons = {
    bronze: Award,
    silver: Star,
    gold: Crown,
    platinum: Target
  };

  return (
    <div className="space-y-6">
      {/* Tier Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {tierAnalysis.map((tier) => {
          const Icon = tierIcons[tier.tier_name as keyof typeof tierIcons] || Award;
          
          return (
            <Card key={tier.tier_name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Icon 
                    className="h-8 w-8" 
                    style={{ color: tierColors[tier.tier_name as keyof typeof tierColors] }}
                  />
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: tierColors[tier.tier_name as keyof typeof tierColors],
                      color: tierColors[tier.tier_name as keyof typeof tierColors]
                    }}
                  >
                    {tier.tier_name.toUpperCase()}
                  </Badge>
                </div>
                
                <p className="text-2xl font-bold">{tier.currentMembers}</p>
                <p className="text-sm text-muted-foreground">Current Members</p>
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>Upgrade Eligible</span>
                    <span className="font-medium text-green-600">+{tier.upgradeEligible}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Avg Score</span>
                    <span className="font-medium">{tier.averageScore}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tier Progression Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Tier Progression Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressionTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="bronze" 
                  stroke={tierColors.bronze} 
                  strokeWidth={2}
                  name="Bronze"
                />
                <Line 
                  type="monotone" 
                  dataKey="silver" 
                  stroke={tierColors.silver} 
                  strokeWidth={2}
                  name="Silver"
                />
                <Line 
                  type="monotone" 
                  dataKey="gold" 
                  stroke={tierColors.gold} 
                  strokeWidth={2}
                  name="Gold"
                />
                <Line 
                  type="monotone" 
                  dataKey="platinum" 
                  stroke={tierColors.platinum} 
                  strokeWidth={2}
                  name="Platinum"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Upgrade Velocity */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Tier Upgrades</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressionTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="platinum" fill={tierColors.platinum} name="To Platinum" />
                <Bar dataKey="gold" fill={tierColors.gold} name="To Gold" />
                <Bar dataKey="silver" fill={tierColors.silver} name="To Silver" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Immediate Upgrade Opportunities</CardTitle>
            <Badge variant="outline">
              {upgradeOpportunities.length} followers ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upgradeOpportunities.map((opportunity, index) => (
              <div key={opportunity?.followerId || index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">
                      Follower {opportunity?.followerId?.slice(0, 8)}...
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: tierColors[opportunity?.currentTier as keyof typeof tierColors],
                          color: tierColors[opportunity?.currentTier as keyof typeof tierColors]
                        }}
                      >
                        {opportunity?.currentTier?.toUpperCase()}
                      </Badge>
                      <ArrowUp className="h-4 w-4 text-muted-foreground" />
                      <Badge 
                        style={{ 
                          backgroundColor: tierColors[opportunity?.nextTier as keyof typeof tierColors],
                          color: 'white'
                        }}
                      >
                        {opportunity?.nextTier?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-xs">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress to {opportunity?.nextTier}</span>
                      <span>{opportunity?.pointsNeeded} points needed</span>
                    </div>
                    <Progress 
                      value={((opportunity?.currentScore || 0) / 100) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>~{opportunity?.timeToUpgrade} weeks</span>
                    </div>
                    <p className="text-muted-foreground">
                      {opportunity?.upgradeValue} new benefits
                    </p>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Boost Progress
                  </Button>
                </div>
              </div>
            ))}

            {upgradeOpportunities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No immediate upgrade opportunities</p>
                <p className="text-sm">Focus on increasing overall engagement</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Benefits & Incentives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tierAnalysis.map((tier) => (
              <div key={tier.tier_name} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: tierColors[tier.tier_name as keyof typeof tierColors] }}
                  />
                  <h4 className="font-medium">{tier.tier_name.toUpperCase()}</h4>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {tier.min_score}-{tier.max_score} points
                  </p>
                  
                  <div className="space-y-1">
                    {tier.tier_benefits.slice(0, 3).map((benefit, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {benefit}
                      </p>
                    ))}
                    {tier.tier_benefits.length > 3 && (
                      <p className="text-xs text-blue-600">
                        +{tier.tier_benefits.length - 3} more benefits
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TierProgressionTracking;
