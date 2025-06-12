import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Award, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGamification } from '@/hooks/useGamification';
import AchievementNotifications, { FollowerAchievement } from '@/components/gamification/AchievementNotifications';

interface GamificationDashboardProps {
  userId?: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ userId }) => {
  const { achievements, userStats, isLoading, awardAchievement } = useGamification(userId);
  const [newAchievements, setNewAchievements] = useState<FollowerAchievement[]>([]);

  useEffect(() => {
    if (achievements && achievements.length > 0) {
      // Map achievements to FollowerAchievement
      const followerAchievements: FollowerAchievement[] = achievements.map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        points: achievement.points,
        unlocked_at: achievement.unlocked_at || new Date().toISOString(),
        category: achievement.category
      }));

      // Filter out already displayed achievements
      const newOnes = followerAchievements.filter(achievement =>
        !newAchievements.find(newAch => newAch.id === achievement.id)
      );

      // Update state with new achievements
      if (newOnes.length > 0) {
        setNewAchievements(prev => [...prev, ...newOnes]);
      }
    }
  }, [achievements]);

  const handleMarkViewed = (achievementId: string) => {
    setNewAchievements(prev => prev.filter(achievement => achievement.id !== achievementId));
  };

  const handleViewDetails = (achievement: FollowerAchievement) => {
    console.log('Viewing achievement details:', achievement);
    handleMarkViewed(achievement.id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gamification Dashboard</h2>
        <Button
          onClick={() => awardAchievement.mutateAsync({
            userId: userId || '',
            achievementType: 'test',
            points: 100
          })}
          disabled={!userId || awardAchievement.isPending}
        >
          Test Achievement
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{userStats?.totalPoints || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Level</p>
                <p className="text-2xl font-bold">{userStats?.level || 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">{achievements?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{userStats?.currentStreak || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{userStats?.weeklyProgress || 0}%</span>
            </div>
            <Progress value={userStats?.weeklyProgress || 0} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-4">
            {achievements?.slice(0, 5).map(achievement => (
              <div key={achievement.id} className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                <Badge variant="secondary">+{achievement.points} pts</Badge>
              </div>
            ))}
            {(!achievements || achievements.length === 0) && (
              <p className="text-muted-foreground text-center py-8">
                No achievements yet. Start exploring to earn your first achievement!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Notifications - Fixed prop name */}
      <AchievementNotifications
        achievements={newAchievements}
        onMarkViewed={handleMarkViewed}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default GamificationDashboard;
