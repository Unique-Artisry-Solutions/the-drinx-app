
import React, { useState, useEffect } from 'react';
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
import { RewardEventType, EngagementEventMetadata } from '@/lib/rewards/tracking/eventTypes';
import { trackRewardEvent } from '@/lib/rewards/tracking/eventTracking';

export function UserRewardDashboard() {
  const { rewardProfile, isLoading } = useRewards();
  const { achievements, achievementsByCategory, isLoading: achievementsLoading } = useAchievements();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Extract the current tier from rewardProfile instead of directly from useRewards
  const currentTier = rewardProfile?.currentTier?.id ? 
    parseInt(rewardProfile.currentTier.name.split(' ')[1]) || 1 : 1;
    
  // Track dashboard view
  useEffect(() => {
    const trackPageView = async () => {
      if (rewardProfile?.points !== undefined) {
        await trackRewardEvent(
          RewardEventType.REWARDS_PAGE_VIEW,
          {
            userId: rewardProfile?.transactionHistory?.[0]?.id || 'unknown',
            section: 'dashboard',
            points: rewardProfile.points,
            tier: currentTier
          } as EngagementEventMetadata
        );
      }
    };
    
    if (!isLoading) {
      trackPageView();
    }
  }, [isLoading, rewardProfile?.points, currentTier]);

  // Track tab changes
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    
    if (rewardProfile?.points !== undefined) {
      await trackRewardEvent(
        RewardEventType.REWARDS_PAGE_VIEW,
        {
          userId: rewardProfile?.transactionHistory?.[0]?.id || 'unknown',
          section: value,
          points: rewardProfile.points,
          tier: currentTier
        } as EngagementEventMetadata
      );
    }
  };

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
      <Card className="border-l-4 border-l-primary overflow-hidden shadow-md">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-primary" />
            Points Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-primary group-hover:text-primary/80 transition-colors">{rewardProfile?.points || 0}</div>
              <div className="text-sm text-muted-foreground">Current Points</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="text-3xl font-bold text-primary group-hover:text-primary/80 transition-colors">{rewardProfile?.lifetimePoints || 0}</div>
              <div className="text-sm text-muted-foreground">Lifetime Points</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform">
              <div className="text-2xl font-bold">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                  {currentTier}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Current Tier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="bg-background rounded-lg shadow-sm">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 rounded-t-lg p-1">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-background rounded-md transition-all data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="achievements"
            className="data-[state=active]:bg-background rounded-md transition-all data-[state=active]:shadow-sm"
          >
            Achievements
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="data-[state=active]:bg-background rounded-md transition-all data-[state=active]:shadow-sm"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6 p-4">
          {/* Tier Status */}
          <TierStatusIndicator currentTier={currentTier} points={rewardProfile?.points || 0} />
          
          {/* Achievement Summary */}
          <Card className="overflow-hidden shadow-md">
            <CardHeader className="bg-amber-50 dark:bg-amber-900/20">
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-600" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.filter(a => a.isCompleted).slice(0, 4).map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="flex items-center gap-2 p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      // Track achievement view when clicked
                      if (achievement && achievement.id) {
                        useAchievements().trackAchievementView(achievement.id);
                      }
                    }}
                  >
                    <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                      <Trophy className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs truncate">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{achievement.description}</div>
                    </div>
                    <Badge variant="outline" className="shrink-0 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200">+{achievement.pointsReward}</Badge>
                  </div>
                ))}
              </div>
              {achievements.filter(a => a.isCompleted).length === 0 && (
                <div className="text-center py-6">
                  <div className="bg-muted/30 inline-flex rounded-full p-3 mb-3">
                    <Trophy className="h-6 w-6 text-muted-foreground/70" />
                  </div>
                  <p className="text-muted-foreground">Complete activities to earn achievements</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6 p-4">
          {/* Full Achievements List */}
          <AchievementsList 
            achievements={achievements} 
            achievementsByCategory={achievementsByCategory}
            isLoading={achievementsLoading}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6 p-4">
          {/* Reward History */}
          <RewardHistory transactions={rewardProfile?.transactionHistory || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
