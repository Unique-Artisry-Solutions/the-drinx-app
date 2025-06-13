
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Flame, Target, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { useSimpleStreakData } from '@/hooks/useSimpleStreakData';
import { useIsMobile } from '@/hooks/use-mobile';

const StreakMotivationWidget: React.FC = () => {
  const { currentStreak, longestStreak, isLoading } = useSimpleStreakData();
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <div className={`${isMobile ? 'h-12' : 'h-16'} flex items-center justify-center`}>
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

  const StreakContent = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className={`text-center ${isMobile ? 'flex-1' : ''}`}>
          <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-orange-600 cursor-pointer hover:scale-110 transition-transform`}>
            {currentStreak}
          </div>
          <div className="text-sm text-muted-foreground">Current Streak</div>
        </div>
        <div className={`text-center ${isMobile ? 'flex-1' : ''}`}>
          <div className={`${isMobile ? 'text-lg' : 'text-lg'} font-semibold text-orange-500`}>
            {longestStreak}
          </div>
          <div className="text-sm text-muted-foreground">Best Streak</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Streak Progress</span>
          <span className="font-medium">{Math.min(currentStreak / 7 * 100, 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-orange-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(currentStreak / 7 * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className={`bg-orange-50 dark:bg-orange-900/20 rounded-md ${isMobile ? 'p-3' : 'p-3'}`}>
        <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-orange-700 dark:text-orange-300 font-medium`}>
          {getMotivationalMessage()}
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-100 dark:border-orange-800">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors min-h-[64px] flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <StreakIcon className="h-5 w-5 text-orange-600" />
                Streak ({currentStreak} days)
              </CardTitle>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-orange-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-orange-600" />
              )}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <StreakContent />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-100 dark:border-orange-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <StreakIcon className="h-6 w-6 text-orange-600" />
          Streak Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StreakContent />
      </CardContent>
    </Card>
  );
};

export default StreakMotivationWidget;
