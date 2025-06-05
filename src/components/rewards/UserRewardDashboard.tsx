
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, TrendingUp, Gift, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AchievementsList from './AchievementsList';
import { RewardHistory } from './RewardHistory';
import RewardMilestoneCard from './RewardMilestoneCard';
import { useRewards } from '@/hooks/rewards/useRewards';
import { useAchievements } from '@/hooks/rewards/useAchievements';

const UserRewardDashboard: React.FC = () => {
  const { 
    userTier, 
    userPoints, 
    nextTier, 
    pointsToNextTier, 
    rewardHistory, 
    isLoading: rewardsLoading 
  } = useRewards();

  const { 
    achievements, 
    achievementsByCategory, 
    nextAchievement, 
    isLoading: achievementsLoading 
  } = useAchievements();

  if (rewardsLoading || achievementsLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Rewards Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and redeem rewards</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-3 py-1">
              <Trophy className="h-4 w-4 mr-1" />
              {userTier?.name || 'Bronze'}
            </Badge>
            <Badge className="text-lg px-3 py-1">
              <Star className="h-4 w-4 mr-1" />
              {userPoints} points
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPoints}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userTier?.name || 'Bronze'}</div>
              <p className="text-xs text-muted-foreground">
                {pointsToNextTier > 0 ? `${pointsToNextTier} to next tier` : 'Max tier reached'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {achievements.filter(a => a.isCompleted).length}
              </div>
              <p className="text-xs text-muted-foreground">
                of {achievements.length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rewards Claimed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rewardHistory?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                <Gift className="h-3 w-3 inline mr-1" />
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            <AchievementsList 
              achievements={achievements}
              achievementsByCategory={achievementsByCategory}
              isLoading={achievementsLoading}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Milestone */}
            {nextTier && (
              <RewardMilestoneCard
                type="next-tier"
                tier={nextTier}
                currentPoints={userPoints}
                pointsRequired={nextTier.minimumPoints}
              />
            )}

            {/* Next Achievement */}
            {nextAchievement && (
              <RewardMilestoneCard
                type="achievement"
                achievement={nextAchievement}
              />
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Gift className="h-4 w-4 mr-2" />
                  Browse Rewards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              </CardContent>
            </Card>

            {/* Recent Rewards */}
            <RewardHistory limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRewardDashboard;
