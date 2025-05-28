
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, TrendingUp } from 'lucide-react';
import { AnimatedProgressBar } from '@/components/animations/AnimatedProgressBar';
import { StreakFlame } from '@/components/animations/StreakFlame';

interface UserStats {
  totalPoints: number;
  currentStreak: number;
  mocktailsTried: number;
  favoriteEstablishment: string;
  weeklyGoal: {
    current: number;
    target: number;
  };
  achievements: Array<{
    id: string;
    name: string;
    unlockedAt: string;
  }>;
}

interface QuickStatsWidgetProps {
  stats: UserStats;
}

const QuickStatsWidget: React.FC<QuickStatsWidgetProps> = ({ stats }) => {
  const weeklyProgress = (stats.weeklyGoal.current / stats.weeklyGoal.target) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="h-5 w-5 text-amber-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Points</div>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <StreakFlame streakCount={stats.currentStreak} size={20} />
              <span className="text-2xl font-bold text-orange-600">{stats.currentStreak}</span>
            </div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.mocktailsTried}</div>
            <div className="text-sm text-muted-foreground">Mocktails</div>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{Math.round(weeklyProgress)}%</span>
            </div>
            <div className="text-sm text-muted-foreground">Weekly Goal</div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Weekly Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.weeklyGoal.current} / {stats.weeklyGoal.target} visits
            </span>
          </div>
          <AnimatedProgressBar 
            value={stats.weeklyGoal.current}
            max={stats.weeklyGoal.target}
            showGlow={true}
            color={weeklyProgress >= 100 ? 'success' : 'default'}
          />
        </div>

        {/* Recent Achievements */}
        {stats.achievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Recent Achievements
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.achievements.slice(0, 3).map((achievement) => (
                <Badge key={achievement.id} variant="secondary" className="text-xs">
                  {achievement.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Establishment */}
        <div className="pt-2 border-t border-border/50">
          <div className="text-sm text-muted-foreground">Favorite Spot</div>
          <div className="font-medium">{stats.favoriteEstablishment}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsWidget;
