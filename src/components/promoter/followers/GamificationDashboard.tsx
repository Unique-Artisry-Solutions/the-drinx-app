
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGamification } from '@/hooks/useGamification';
import { Trophy, Star, Award, Target } from 'lucide-react';

interface GamificationDashboardProps {
  userId?: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ userId }) => {
  const { achievements, userStats, isLoading } = useGamification(userId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gamification Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading gamification data...</div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: 'Total Points',
      value: userStats?.totalPoints || 0,
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      title: 'Level',
      value: userStats?.level || 1,
      icon: Trophy,
      color: 'text-blue-500'
    },
    {
      title: 'Achievements',
      value: achievements?.length || 0,
      icon: Award,
      color: 'text-green-500'
    },
    {
      title: 'Current Streak',
      value: userStats?.currentStreak || 0,
      icon: Target,
      color: 'text-orange-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Gamification Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </div>
          ))}
        </div>

        {achievements && achievements.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">Recent Achievements</h3>
            <div className="space-y-2">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 border rounded">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.points} points
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GamificationDashboard;
