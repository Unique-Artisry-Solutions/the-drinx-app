
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useGamification } from '@/hooks/useGamification';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import BadgeSystem from './BadgeSystem';
import TierProgressionEngine from './TierProgressionEngine';
import LoyaltyRewardsManager from './LoyaltyRewardsManager';
import AchievementNotifications from './AchievementNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Award, Crown, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FollowerAchievement, LoyaltyPoints } from '@/types/gamification';

interface GamificationDashboardProps {
  promoterId: string;
  followerId?: string;
  mode?: 'promoter' | 'follower';
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  promoterId,
  followerId,
  mode = 'follower'
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { followers } = useSubscriptions(promoterId);
  
  const {
    badges,
    milestones,
    rewards,
    badgesLoading,
    milestonesLoading,
    rewardsLoading,
    awardBadge,
    processTierUpgrade,
    fetchFollowerAchievements,
    fetchLoyaltyPoints,
    calculateBadgeProgress,
    calculateTierProgress
  } = useGamification(promoterId);

  const [achievements, setAchievements] = useState<FollowerAchievement[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints | null>(null);
  const [newAchievements, setNewAchievements] = useState<FollowerAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current follower data
  const currentFollower = followerId 
    ? followers.find(f => f.id === followerId)
    : followers.find(f => f.subscriber_id === user?.id);

  const actualFollowerId = followerId || currentFollower?.id;

  // Load achievements and points data
  useEffect(() => {
    const loadData = async () => {
      if (!actualFollowerId) return;

      try {
        setIsLoading(true);
        const [achievementsData, pointsData] = await Promise.all([
          fetchFollowerAchievements(actualFollowerId),
          fetchLoyaltyPoints(actualFollowerId)
        ]);

        setAchievements(achievementsData);
        setLoyaltyPoints(pointsData);

        // Check for new achievements that haven't been viewed
        const unviewed = achievementsData.filter(a => !a.celebration_viewed);
        setNewAchievements(unviewed);
      } catch (error) {
        console.error('Error loading gamification data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load gamification data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [actualFollowerId, fetchFollowerAchievements, fetchLoyaltyPoints, toast]);

  // Calculate progress data
  const earnedBadges = achievements
    .filter(a => a.achievement_type === 'badge' && a.badge)
    .map(a => a.badge!)
    .filter(Boolean);

  const badgeProgress = currentFollower ? calculateBadgeProgress(actualFollowerId!, currentFollower) : [];
  const tierProgress = currentFollower ? calculateTierProgress(currentFollower, loyaltyPoints) : null;

  // Handle badge awarding (promoter mode)
  const handleAwardBadge = async (badgeId: string) => {
    if (!actualFollowerId) return;

    try {
      await awardBadge.mutateAsync({ followerId: actualFollowerId, badgeId });
      toast({
        title: 'Badge Awarded!',
        description: 'The badge has been successfully awarded to the follower.',
      });

      // Refresh data
      const updatedAchievements = await fetchFollowerAchievements(actualFollowerId);
      setAchievements(updatedAchievements);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to award badge',
        variant: 'destructive'
      });
    }
  };

  // Handle tier upgrade
  const handleTierUpgrade = async () => {
    if (!actualFollowerId) return;

    try {
      const upgraded = await processTierUpgrade.mutateAsync(actualFollowerId);
      if (upgraded) {
        toast({
          title: 'Tier Upgraded!',
          description: 'Congratulations on reaching a new tier!',
        });

        // Refresh data
        const [updatedAchievements, updatedPoints] = await Promise.all([
          fetchFollowerAchievements(actualFollowerId),
          fetchLoyaltyPoints(actualFollowerId)
        ]);
        setAchievements(updatedAchievements);
        setLoyaltyPoints(updatedPoints);
      } else {
        toast({
          title: 'No Upgrade Available',
          description: 'Requirements not yet met for next tier.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process tier upgrade',
        variant: 'destructive'
      });
    }
  };

  // Handle achievement celebration viewed
  const handleMarkViewed = (achievementId: string) => {
    setNewAchievements(prev => prev.filter(a => a.id !== achievementId));
    // TODO: Update celebration_viewed in database
  };

  if (isLoading || badgesLoading || milestonesLoading || rewardsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">Loading gamification data...</div>
      </div>
    );
  }

  if (!actualFollowerId) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {mode === 'follower' ? 'Follow this promoter to access gamification features!' : 'No follower data available.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Award className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
              <p className="text-2xl font-bold">{earnedBadges.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Crown className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Current Tier</p>
              <p className="text-2xl font-bold">{tierProgress?.current_tier || 1}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Gift className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Loyalty Points</p>
              <p className="text-2xl font-bold">{loyaltyPoints?.current_points || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Trophy className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Score</p>
              <p className="text-2xl font-bold">{currentFollower?.gamification_score || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Gamification Features */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="tiers">Tiers</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="achievements">History</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-4">
          <BadgeSystem
            badges={badges}
            badgeProgress={badgeProgress}
            earnedBadges={earnedBadges}
            onBadgeClick={mode === 'promoter' ? (badge) => handleAwardBadge(badge.id) : undefined}
          />
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          {tierProgress && (
            <TierProgressionEngine
              tierProgress={tierProgress}
              milestones={milestones}
              onUpgradeCheck={handleTierUpgrade}
              isProcessing={processTierUpgrade.isPending}
            />
          )}
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <LoyaltyRewardsManager
            rewards={rewards}
            loyaltyPoints={loyaltyPoints}
            currentTierLevel={currentFollower?.loyalty_tier_level || 1}
            onRewardRedeem={(rewardId) => {
              toast({
                title: 'Reward Redeemed!',
                description: 'Your reward has been successfully redeemed.',
              });
            }}
            redeemedRewards={[]} // TODO: Track redeemed rewards
          />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievement History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {achievement.badge?.icon || '🏆'}
                      </div>
                      <div>
                        <p className="font-medium">
                          {achievement.badge?.name || achievement.milestone?.milestone_name || 'Achievement'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Earned {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">+{achievement.points_earned} points</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {achievement.achievement_type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No achievements yet. Start engaging to earn your first badge!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Notifications */}
      <AchievementNotifications
        newAchievements={newAchievements}
        onMarkViewed={handleMarkViewed}
        onViewDetails={(achievement) => {
          // TODO: Show achievement detail modal
          console.log('View achievement details:', achievement);
        }}
      />
    </div>
  );
};

export default GamificationDashboard;
