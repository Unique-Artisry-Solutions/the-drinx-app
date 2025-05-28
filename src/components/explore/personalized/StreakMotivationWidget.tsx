
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Target, Trophy } from 'lucide-react';
import { useStreakData } from '@/hooks/useStreakData';

const StreakMotivationWidget: React.FC = () => {
  const { currentStreak, longestStreak, isLoading } = useStreakData();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-16 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMotivationalMessage = () => {
    if (currentStreak === 0) {
      return "Start your streak today! Visit an establishment to begin.";
    } else if (currentStreak < 3) {
      return `Great start! Keep it going for ${3 - currentStreak} more days.`;
    } else if (currentStreak < 7) {
      return `Amazing! You're building a solid habit. ${7 - currentStreak} days to a week streak!`;
    } else {
      return "Incredible streak! You're a true swig enthusiast!";
    }
  };

  const getStreakIcon = () => {
    if (currentStreak >= 7) return Trophy;
    if (currentStreak >= 3) return Target;
    return Flame;
  };

  const StreakIcon = getStreakIcon();

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-100 dark:border-orange-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <StreakIcon className="h-5 w-5 text-orange-600" />
          Streak Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-orange-500">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-md p-3">
            <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakMotivationWidget;
