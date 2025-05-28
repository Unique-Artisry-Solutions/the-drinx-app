
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Trophy, TrendingUp } from 'lucide-react';

interface StreakDay {
  date: Date;
  hasVisit: boolean;
  visitCount: number;
  points?: number;
}

interface StreakMotivationCardProps {
  currentStreak: number;
  longestStreak: number;
  streakData: StreakDay[];
}

const StreakMotivationCard: React.FC<StreakMotivationCardProps> = ({
  currentStreak,
  longestStreak,
  streakData
}) => {
  // Calculate streak momentum and motivation
  const recentDays = streakData.slice(-7); // Last 7 days
  const visitedDaysThisWeek = recentDays.filter(day => day.hasVisit).length;
  const isOnFire = currentStreak >= 3;
  const isCloseToRecord = longestStreak > 0 && currentStreak >= longestStreak - 2;
  
  // Generate motivational message
  const getMotivationalMessage = () => {
    if (currentStreak === 0) {
      return "Start your streak journey today! Every great achievement begins with a single step.";
    }
    if (currentStreak === 1) {
      return "Great start! Come back tomorrow to build your streak.";
    }
    if (currentStreak < 3) {
      return `${currentStreak} days strong! You're building momentum.`;
    }
    if (isCloseToRecord) {
      return `So close to your personal record of ${longestStreak} days! Keep going!`;
    }
    if (currentStreak > longestStreak) {
      return `New personal record! ${currentStreak} days - you're unstoppable!`;
    }
    return `${currentStreak} day streak! You're on fire! 🔥`;
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return 'text-muted-foreground';
    if (currentStreak < 3) return 'text-orange-500';
    if (currentStreak < 7) return 'text-orange-600';
    return 'text-red-500';
  };

  const getMotivationLevel = () => {
    if (currentStreak === 0) return 'Start Today';
    if (currentStreak < 3) return 'Building';
    if (currentStreak < 7) return 'Momentum';
    if (currentStreak < 14) return 'On Fire';
    return 'Legendary';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className={`h-5 w-5 ${getStreakColor()}`} />
              <span className="font-medium">Streak Motivation</span>
            </div>
            <Badge variant={isOnFire ? "default" : "secondary"}>
              {getMotivationLevel()}
            </Badge>
          </div>

          {/* Main Message */}
          <div className="text-sm text-muted-foreground">
            {getMotivationalMessage()}
          </div>

          {/* Streak Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className={`text-lg font-bold ${getStreakColor()}`}>
                {currentStreak}
              </div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {longestStreak}
              </div>
              <div className="text-xs text-muted-foreground">Best</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {visitedDaysThisWeek}
              </div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>

          {/* Visual Streak Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Last 7 days</span>
              <span>{visitedDaysThisWeek}/7 visits</span>
            </div>
            <div className="flex gap-1">
              {recentDays.map((day, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded ${
                    day.hasVisit 
                      ? 'bg-orange-500' 
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Next Goal */}
          {currentStreak > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <Trophy className="h-3 w-3 text-amber-500" />
              <span className="text-muted-foreground">
                Next milestone: {Math.ceil((currentStreak + 1) / 7) * 7} days
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakMotivationCard;
