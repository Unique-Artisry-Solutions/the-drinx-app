
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trophy, Target, Star, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedProgressBar } from '@/components/animations/AnimatedProgressBar';
import { ParticleEffect } from '@/components/animations/ParticleEffect';
import { AchievementCelebration } from '@/components/animations/AchievementCelebration';
import { Achievement } from '@/lib/rewards/types';

interface AchievementProximityAlertsProps {
  className?: string;
}

const AchievementProximityAlerts: React.FC<AchievementProximityAlertsProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratingAchievement, setCelebratingAchievement] = useState<Achievement | null>(null);
  const isMobile = useIsMobile();

  // Mock data - would come from rewards API in real app
  const nearbyAchievements: Achievement[] = [
    {
      id: '1',
      name: 'Social Butterfly',
      description: 'Share 5 mocktail photos',
      category: 'social',
      threshold: 5,
      pointsReward: 100,
      isCompleted: false,
      progress: 3,
      pointValue: 100,
      icon: 'share'
    },
    {
      id: '2', 
      name: 'Frequent Visitor',
      description: 'Visit 10 establishments',
      category: 'visits',
      threshold: 10,
      pointsReward: 150,
      isCompleted: false,
      progress: 8,
      pointValue: 150,
      icon: 'map-pin'
    },
    {
      id: '3',
      name: 'Mocktail Master',
      description: 'Try 15 different mocktails',
      category: 'mocktails',
      threshold: 15,
      pointsReward: 200,
      isCompleted: false,
      progress: 12,
      pointValue: 200,
      icon: 'glass'
    }
  ];

  const getIcon = (category: string) => {
    switch (category) {
      case 'visits':
        return Trophy;
      case 'social':
        return Star;
      case 'mocktails':
        return Target;
      default:
        return Zap;
    }
  };

  const getProgressColor = (progress: number, threshold: number) => {
    const percentage = (progress / threshold) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'default';
  };

  const handleAchievementClick = (achievement: Achievement) => {
    setShowParticles(true);
    if (achievement.progress >= achievement.threshold * 0.8) {
      setCelebratingAchievement(achievement);
      setShowCelebration(true);
    }
  };

  const AlertsContent = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {nearbyAchievements.map((achievement, index) => {
          const IconComponent = getIcon(achievement.category);
          const progressPercentage = (achievement.progress / achievement.threshold) * 100;
          const isCloseToCompletion = progressPercentage >= 80;
          
          return (
            <div
              key={achievement.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                isCloseToCompletion 
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800' 
                  : 'bg-muted/30 hover:bg-muted/50'
              } ${isMobile ? 'min-h-[100px]' : ''}`}
              onClick={() => handleAchievementClick(achievement)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <IconComponent 
                    className={`h-5 w-5 ${
                      isCloseToCompletion 
                        ? 'text-amber-600 dark:text-amber-400 animate-pulse' 
                        : 'text-primary'
                    }`}
                  />
                  <div>
                    <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant={isCloseToCompletion ? 'default' : 'outline'} 
                    className={`text-xs ${isCloseToCompletion ? 'animate-pulse bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : ''}`}
                  >
                    +{achievement.pointsReward}
                  </Badge>
                  {isCloseToCompletion && (
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium animate-bounce">
                      Almost there!
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span className="font-medium">
                    {achievement.progress}/{achievement.threshold}
                  </span>
                </div>
                <AnimatedProgressBar
                  value={achievement.progress}
                  max={achievement.threshold}
                  className={isMobile ? 'h-2.5' : 'h-2'}
                  showGlow={isCloseToCompletion}
                  color={getProgressColor(achievement.progress, achievement.threshold)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <ParticleEffect 
        trigger={showParticles} 
        points={50}
        onComplete={() => setShowParticles(false)}
      />
      
      {celebratingAchievement && (
        <AchievementCelebration
          achievement={celebratingAchievement}
          isVisible={showCelebration}
          onComplete={() => {
            setShowCelebration(false);
            setCelebratingAchievement(null);
          }}
        />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Card className={`w-full ${className}`}>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors min-h-[64px] flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary animate-pulse" />
                Achievements ({nearbyAchievements.length} close)
              </CardTitle>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
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
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-primary animate-pulse" />
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
