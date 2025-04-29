
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Gift, Star, Trophy } from 'lucide-react';
import { TierStatusIndicator } from './TierStatusIndicator';
import { RewardHistory } from './RewardHistory';
import { AchievementsList } from './AchievementsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRewards } from '@/hooks/rewards/useRewards';
import { useAchievements } from '@/hooks/rewards/useAchievements';

export function UserRewardDashboard() {
  const { rewardProfile, isLoading } = useRewards();
  const { achievements, achievementsByCategory, isLoading: achievementsLoading } = useAchievements();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Extract the current tier from rewardProfile instead of directly from useRewards
  const currentTier = rewardProfile?.currentTier?.id ? 
    parseInt(rewardProfile.currentTier.name.split(' ')[1]) || 1 : 1;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-48 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Points Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Points Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{rewardProfile?.points || 0}</div>
              <div className="text-sm text-muted-foreground">Current Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{rewardProfile?.lifetimePoints || 0}</div>
              <div className="text-sm text-muted-foreground">Lifetime Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {currentTier}
              </div>
              <div className="text-sm text-muted-foreground">Current Tier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Tier Status */}
          <TierStatusIndicator currentTier={currentTier} points={rewardProfile?.points || 0} />
          
          {/* Achievement Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.filter(a => a.isCompleted).slice(0, 4).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <div className="p-1 bg-amber-100 rounded-full">
                      <Trophy className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs truncate">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{achievement.description}</div>
                    </div>
                    <Badge variant="outline" className="shrink-0">+{achievement.pointsReward}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          {/* Full Achievements List */}
          <AchievementsList 
            achievements={achievements} 
            achievementsByCategory={achievementsByCategory}
            isLoading={achievementsLoading}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {/* Reward History */}
          <RewardHistory transactions={rewardProfile?.transactionHistory || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
