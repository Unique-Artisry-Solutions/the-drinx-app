
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRewards } from '@/hooks/rewards/useRewards';
import { useAchievements } from '@/hooks/rewards/useAchievements';
import RewardHistory from './RewardHistory';
import AchievementsList from './AchievementsList';
import RewardMilestoneCard from './RewardMilestoneCard';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Gift } from 'lucide-react';

const UserRewardDashboard: React.FC = () => {
  const {
    rewardProfile,
    isLoading: rewardsLoading,
    error: rewardsError,
    userTier,
    userPoints,
    nextTier,
    pointsToNextTier,
    rewardHistory
  } = useRewards();

  const {
    achievements,
    achievementsByCategory,
    isLoading: achievementsLoading,
    nextAchievement
  } = useAchievements();

  if (rewardsLoading || achievementsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (rewardsError) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Unable to load rewards data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              Current Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPoints}</div>
            <p className="text-xs text-muted-foreground">
              {rewardProfile?.lifetime_points} lifetime points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Current Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold">{userTier?.name || 'None'}</div>
              {userTier && (
                <Badge variant="outline" style={{ color: userTier.color }}>
                  {userTier.name}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gift className="h-4 w-4 text-green-500" />
              Available Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewardProfile?.availableRewards.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ready to redeem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Next Tier Progress */}
            {nextTier && (
              <RewardMilestoneCard
                type="next-tier"
                tier={nextTier}
                currentPoints={userPoints}
                pointsRequired={nextTier.points_required}
              />
            )}
            
            {/* Next Achievement */}
            {nextAchievement && (
              <RewardMilestoneCard
                type="achievement"
                achievement={nextAchievement}
              />
            )}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RewardHistory 
                transactions={rewardHistory.slice(0, 5)} 
                isLoading={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsList
            achievements={achievements}
            achievementsByCategory={achievementsByCategory}
            isLoading={achievementsLoading}
          />
        </TabsContent>

        <TabsContent value="history">
          <RewardHistory 
            transactions={rewardHistory}
            isLoading={rewardsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserRewardDashboard;
