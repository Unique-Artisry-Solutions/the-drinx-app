
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trophy, Target, Flame, Star, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AchievementCelebration } from '@/components/animations/AchievementCelebration';
import { ParticleEffect } from '@/components/animations/ParticleEffect';
import { AnimatedProgressBar } from '@/components/animations/AnimatedProgressBar';

// Define our own Achievement interface to ensure compatibility
interface ProximityAchievement {
  id: string;
  name: string;
  description: string;
  category: 'visits' | 'mocktails' | 'social' | 'special';
  threshold: number;
  pointsReward: number;
  progress: number;
  isCompleted: boolean;
}

interface AchievementProximityAlertsProps {
  achievements?: ProximityAchievement[];
}

const AchievementProximityAlerts: React.FC<AchievementProximityAlertsProps> = ({ 
  achievements: propAchievements 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCelebration, setShowCelebration] = useState<ProximityAchievement | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const isMobile = useIsMobile();

  // Mock achievements if none provided
  const mockAchievements: ProximityAchievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Visit your first establishment',
      category: 'visits',
      threshold: 1,
      pointsReward: 25,
      progress: 0,
      isCompleted: false
    },
    {
      id: '2',
      name: 'Mocktail Explorer',
      description: 'Try 5 different mocktails',
      category: 'mocktails',
      threshold: 5,
      pointsReward: 100,
      progress: 3,
      isCompleted: false
    },
    {
      id: '3',
      name: 'Social Butterfly',
      description: 'Share 3 mocktail experiences',
      category: 'social',
      threshold: 3,
      pointsReward: 75,
      progress: 2,
      isCompleted: false
    },
    {
      id: '4',
      name: 'Weekend Warrior',
      description: 'Special weekend achievement',
      category: 'special',
      threshold: 1,
      pointsReward: 150,
      progress: 1,
      isCompleted: true
    }
  ];

  const achievements = propAchievements || mockAchievements;

  // Get achievements that are close to completion (70%+ progress)
  const proximityAchievements = achievements.filter(achievement => {
    if (achievement.isCompleted) return false;
    const progressPercentage = (achievement.progress / achievement.threshold) * 100;
    return progressPercentage >= 70;
  });

  const getIcon = (category: ProximityAchievement['category']) => {
    switch (category) {
      case 'visits':
        return <Target className="h-4 w-4 text-blue-500" />;
      case 'mocktails':
        return <Star className="h-4 w-4 text-purple-500" />;
      case 'social':
        return <Zap className="h-4 w-4 text-green-500" />;
      case 'special':
        return <Trophy className="h-4 w-4 text-amber-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProgressColor = (progress: number, threshold: number) => {
    const percentage = (progress / threshold) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'default';
  };

  const handleAchievementClick = (achievement: ProximityAchievement) => {
    setShowParticles(true);
    if (achievement.progress === achievement.threshold) {
      setShowCelebration(achievement);
    }
  };

  const AlertsContent = () => (
    <div className="space-y-4">
      {proximityAchievements.length === 0 ? (
        <div className={`text-center ${isMobile ? 'p-4' : 'p-6'} text-muted-foreground`}>
          <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No achievements close to completion</p>
          <p className="text-xs mt-1">Keep exploring to unlock more achievements!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">
            You're close to unlocking {proximityAchievements.length} achievement{proximityAchievements.length > 1 ? 's' : ''}!
          </p>
          
          {proximityAchievements.map((achievement, index) => {
            const progressPercentage = (achievement.progress / achievement.threshold) * 100;
            const remaining = achievement.threshold - achievement.progress;
            
            return (
              <Card 
                key={achievement.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${isMobile ? 'p-3' : 'p-4'}`}
                onClick={() => handleAchievementClick(achievement)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getIcon(achievement.category)}
                    <div className="flex-1">
                      <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${isMobile ? 'text-xs' : 'text-sm'} animate-pulse`}
                  >
                    +{achievement.pointsReward}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {achievement.progress}/{achievement.threshold}
                    </span>
                    <span className="font-medium text-orange-600">
                      {remaining} more to go!
                    </span>
                  </div>
                  
                  <AnimatedProgressBar
                    value={progressPercentage}
                    max={100}
                    className={`${isMobile ? 'h-2.5' : 'h-2'}`}
                    showGlow={progressPercentage > 80}
                    color={getProgressColor(achievement.progress, achievement.threshold)}
                  />
                  
                  {progressPercentage >= 90 && (
                    <div className="flex items-center gap-1 text-xs text-orange-600 animate-bounce">
                      <Flame className="h-3 w-3" />
                      <span>Almost there!</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showCelebration && (
        <AchievementCelebration
          achievement={showCelebration}
          onComplete={() => setShowCelebration(null)}
        />
      )}

      <ParticleEffect 
        trigger={showParticles} 
        points={50}
        onComplete={() => setShowParticles(false)}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-100 dark:border-orange-800">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors min-h-[64px] flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-orange-600 animate-pulse" />
                Achievements ({proximityAchievements.length})
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
              <AlertsContent />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-100 dark:border-orange-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-orange-600 animate-pulse" />
          Achievement Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AlertsContent />
      </CardContent>
    </Card>
  );
};

export default AchievementProximityAlerts;
