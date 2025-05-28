
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Gift, TrendingUp } from 'lucide-react';
import { useRewards } from '@/hooks/rewards/useRewards';
import { useAchievements } from '@/hooks/rewards/useAchievements';
import { AchievementsList } from './AchievementsList';
import RewardHistory from './RewardHistory';
import { RewardMilestoneCard } from './RewardMilestoneCard';
import { transformRewardTransaction, transformUserRewardProfile } from '@/types/rewards';

export const UserRewardDashboard: React.FC = () => {
  const { rewardProfile, isLoading: rewardsLoading } = useRewards();
  const { achievements, achievementsByCategory, isLoading: achievementsLoading } = useAchievements();

  if (rewardsLoading || achievementsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  // Transform the reward profile to ensure type consistency
  const profile = rewardProfile ? transformUserRewardProfile(rewardProfile) : null;

  // Ensure transaction history has all required fields
  const mockTransactionHistory = [
    {
      id: 'trans-1',
      user_id: profile?.id || 'user-1',
      userId: profile?.id || 'user-1',
      transaction_type: 'earn' as const,
      points: 50,
      description: 'Check-in reward',
      created_at: new Date().toISOString(),
      source: 'check-in'
    },
    {
      id: 'trans-2', 
      user_id: profile?.id || 'user-1',
      userId: profile?.id || 'user-1',
      transaction_type: 'earn' as const,
      points: 25,
      description: 'Review reward',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      source: 'review'
    }
  ].map(transformRewardTransaction);

  const transactionHistory = profile?.transactionHistory?.length ? 
    profile.transactionHistory : mockTransactionHistory;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.points || 0}</div>
            <p className="text-xs text-muted-foreground">
              {profile?.lifetime_points || profile?.lifetimePoints || 0} lifetime points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.currentTier?.name || 'Bronze'}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.currentTier?.benefits?.length || 0} benefits unlocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rewards</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.availableRewards?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to redeem
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RewardMilestoneCard
              type="next-tier"
              tier={profile?.currentTier}
              currentPoints={profile?.points || 0}
              pointsRequired={profile?.currentTier?.points_required || 500}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactionHistory.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.source}</p>
                      </div>
                      <Badge variant="outline">+{transaction.points} pts</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
            transactions={transactionHistory}
            isLoading={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
