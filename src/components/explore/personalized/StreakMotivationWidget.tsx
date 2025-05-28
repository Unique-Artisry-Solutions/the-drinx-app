import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Flame, Target, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { useStreakData } from '@/hooks/useStreakData';
import { useIsMobile } from '@/hooks/use-mobile';
import { StreakFlame } from '@/components/animations/StreakFlame';
import { AnimatedProgressBar } from '@/components/animations/AnimatedProgressBar';
import { ParticleEffect } from '@/components/animations/ParticleEffect';
const StreakMotivationWidget: React.FC = () => {
  const {
    currentStreak,
    longestStreak,
    isLoading
  } = useStreakData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const isMobile = useIsMobile();
  if (isLoading) {
    return <Card>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <div className={`${isMobile ? 'h-12' : 'h-16'} flex items-center justify-center`}>
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>;
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
  const handleStreakClick = () => {
    if (currentStreak > 0) {
      setShowParticles(true);
    }
  };
  const StreakContent = () => <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className={`text-center ${isMobile ? 'flex-1' : ''}`} onClick={handleStreakClick}>
          <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-orange-600 cursor-pointer hover:scale-110 transition-transform`}>
            {currentStreak}
          </div>
          <div className="text-sm text-muted-foreground">Current Streak</div>
        </div>
        <div className={`text-center ${isMobile ? 'flex-1' : ''}`}>
          <div className={`${isMobile ? 'text-lg' : 'text-lg'} font-semibold text-orange-500`}>{longestStreak}</div>
          <div className="text-sm text-muted-foreground">Best Streak</div>
        </div>
      </div>
      
      {/* Animated Progress Bar for streak progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm py-0 my-[41px]">
          <span className="py-0">Streak Progress</span>
          <span className="font-medium">{Math.min(currentStreak / 7 * 100, 100).toFixed(0)}%</span>
        </div>
        <AnimatedProgressBar value={currentStreak} max={7} className={isMobile ? 'h-3' : 'h-2.5'} showGlow={currentStreak > 3} color={currentStreak >= 7 ? 'success' : currentStreak >= 3 ? 'warning' : 'default'} />
      </div>
      
      <div className={`bg-white/60 dark:bg-gray-800/60 rounded-md ${isMobile ? 'p-3' : 'p-3'}`}>
        <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-orange-700 dark:text-orange-300 font-medium`}>
          {getMotivationalMessage()}
        </p>
      </div>

      <ParticleEffect trigger={showParticles} points={currentStreak * 5} onComplete={() => setShowParticles(false)} />
    </div>;
  if (isMobile) {
    return <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-100 dark:border-orange-800">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors min-h-[64px] flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <StreakFlame streakCount={currentStreak} size={20} />
                Streak ({currentStreak} days)
              </CardTitle>
              {isExpanded ? <ChevronUp className="h-5 w-5 text-orange-600" /> : <ChevronDown className="h-5 w-5 text-orange-600" />}
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <StreakContent />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>;
  }
  return <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-100 dark:border-orange-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <StreakFlame streakCount={currentStreak} size={24} />
          Streak Motivation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StreakContent />
      </CardContent>
    </Card>;
};
export default StreakMotivationWidget;