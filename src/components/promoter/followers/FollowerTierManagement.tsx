
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crown, Star, Trophy, Award, Users } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FollowerTierManagementProps {
  promoterId: string;
}

interface TierDistribution {
  tier: string;
  count: number;
  percentage: number;
  averageEngagement: number;
}

const TIER_CONFIG = {
  new: { icon: Users, color: 'bg-gray-500', label: 'New', description: 'Recently joined followers' },
  bronze: { icon: Award, color: 'bg-amber-600', label: 'Bronze', description: 'Regular followers' },
  silver: { icon: Star, color: 'bg-gray-400', label: 'Silver', description: 'Engaged followers' },
  gold: { icon: Trophy, color: 'bg-yellow-500', label: 'Gold', description: 'Highly engaged followers' },
  vip: { icon: Crown, color: 'bg-purple-600', label: 'VIP', description: 'Top tier followers' }
};

const FollowerTierManagement: React.FC<FollowerTierManagementProps> = ({ promoterId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tierData, isLoading } = useQuery({
    queryKey: ['follower-tiers', promoterId],
    queryFn: async () => {
      const { data: followers, error } = await supabase
        .from('promoter_followers')
        .select(`
          id,
          follower_tier,
          engagement_count,
          total_interactions,
          last_engagement_at,
          follower_engagement_scores(overall_score)
        `)
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');

      if (error) throw error;

      // Calculate tier distribution
      const tierCounts = followers.reduce((acc, follower) => {
        const tier = follower.follower_tier || 'new';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const total = followers.length;
      
      const tierDistribution: TierDistribution[] = Object.entries(TIER_CONFIG).map(([tier, config]) => {
        const count = tierCounts[tier] || 0;
        const tierFollowers = followers.filter(f => (f.follower_tier || 'new') === tier);
        const averageEngagement = tierFollowers.length > 0
          ? tierFollowers.reduce((sum, f) => sum + (f.follower_engagement_scores?.[0]?.overall_score || 0), 0) / tierFollowers.length
          : 0;

        return {
          tier,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          averageEngagement: Math.round(averageEngagement)
        };
      });

      return {
        followers,
        tierDistribution,
        totalFollowers: total
      };
    },
    enabled: !!promoterId
  });

  const updateTiers = useMutation({
    mutationFn: async () => {
      // Auto-assign tiers based on engagement scores
      if (!tierData?.followers) return;

      const updates = tierData.followers.map(follower => {
        const score = follower.follower_engagement_scores?.[0]?.overall_score || 0;
        let newTier = 'new';
        
        if (score >= 80) newTier = 'vip';
        else if (score >= 60) newTier = 'gold';
        else if (score >= 40) newTier = 'silver';
        else if (score >= 20) newTier = 'bronze';

        return supabase
          .from('promoter_followers')
          .update({ follower_tier: newTier })
          .eq('id', follower.id);
      });

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follower-tiers'] });
      toast({
        title: 'Tiers Updated',
        description: 'Follower tiers have been automatically updated based on engagement scores.'
      });
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Follower Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading tier data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Follower Tier Management</CardTitle>
          <Button onClick={() => updateTiers.mutate()} disabled={updateTiers.isPending}>
            {updateTiers.isPending ? 'Updating...' : 'Auto-Update Tiers'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {tierData?.tierDistribution.map(({ tier, count, percentage, averageEngagement }) => {
              const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
              const Icon = config.icon;
              
              return (
                <Card key={tier} className="relative overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${config.color}`} />
                      <span className="font-medium text-sm">{config.label}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Icon className="h-8 w-8 text-muted-foreground" />
                        <div className="text-right">
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </div>
                      </div>
                      
                      <Progress value={percentage} className="h-2" />
                      
                      <div className="text-xs text-muted-foreground">
                        Avg Score: {averageEngagement}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tier Benefits & Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(TIER_CONFIG).map(([tier, config]) => {
              const Icon = config.icon;
              const tierInfo = tierData?.tierDistribution.find(t => t.tier === tier);
              
              return (
                <div key={tier} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${config.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{config.label} Tier</div>
                      <div className="text-sm text-muted-foreground">{config.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{tierInfo?.count || 0} followers</div>
                    <Badge variant="outline" className="text-xs">
                      {tier === 'new' && 'New followers'}
                      {tier === 'bronze' && '20+ score'}
                      {tier === 'silver' && '40+ score'}
                      {tier === 'gold' && '60+ score'}
                      {tier === 'vip' && '80+ score'}
                    </Badge>
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

export default FollowerTierManagement;
