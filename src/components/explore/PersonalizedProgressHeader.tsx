import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Star, Trophy, TrendingUp } from 'lucide-react';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useStreakData } from '@/hooks/useStreakData';
import StreakMotivationCard from './StreakMotivationCard';
interface PersonalizedProgressHeaderProps {
  className?: string;
}
const PersonalizedProgressHeader: React.FC<PersonalizedProgressHeaderProps> = ({
  className
}) => {
  const {
    loading,
    userStats,
    isAuthenticated
  } = usePersonalizedData();
  const {
    currentStreak,
    longestStreak,
    streakData,
    isLoading: streakLoading
  } = useStreakData();
  if (loading || streakLoading || !isAuthenticated) {
    return null;
  }

  // Mock data for demonstration
  const mockData = {
    currentPoints: 1250,
    recentGains: 85,
    currentTier: 'Silver Explorer',
    nextTier: 'Gold Adventurer',
    tierProgress: 65,
    pointsToNextTier: 750,
    nearbyAchievements: [{
      name: 'Social Butterfly',
      progress: 8,
      total: 10,
      reward: '50 pts'
    }, {
      name: 'Circuit Master',
      progress: 2,
      total: 3,
      reward: '100 pts'
    }]
  };
  return <div className={`space-y-4 ${className}`}>
      {/* Main Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Points Balance */}
        <Card className="my-0 py-[5px]">
          <CardContent className="p-4 my-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Points Balance</span>
                </div>
                <div className="text-2xl font-bold mt-1">{mockData.currentPoints.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+{mockData.recentGains} today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="my-0 py-[5px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between my-0">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Current Streak</span>
                </div>
                <div className="text-2xl font-bold mt-1">{currentStreak} days</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Best: {longestStreak} days
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tier Progress */}
        <Card className="py-[5px]">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Tier Progress</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{mockData.currentTier}</span>
                  <span>{mockData.nextTier}</span>
                </div>
                <Progress value={mockData.tierProgress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {mockData.pointsToNextTier} points to next tier
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Proximity Alerts */}
      {mockData.nearbyAchievements.length > 0 && <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Almost There!
            </h4>
            <div className="space-y-3">
              {mockData.nearbyAchievements.map((achievement, index) => <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{achievement.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {achievement.reward}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{achievement.progress}/{achievement.total}</span>
                      <span>{Math.round(achievement.progress / achievement.total * 100)}%</span>
                    </div>
                    <Progress value={achievement.progress / achievement.total * 100} className="h-1.5" />
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>}

      {/* Streak Motivation Card */}
      <StreakMotivationCard currentStreak={currentStreak} longestStreak={longestStreak} streakData={streakData} />
    </div>;
};
export default PersonalizedProgressHeader;