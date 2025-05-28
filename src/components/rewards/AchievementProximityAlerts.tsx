
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Star, Gift, ChevronRight } from 'lucide-react';
import { AchievementCelebration } from '@/components/animations/AchievementCelebration';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProximityAchievement {
  id: string;
  name: string;
  description: string;
  category: 'visits' | 'mocktails' | 'social' | 'special';
  threshold: number;
  pointsReward: number;
  isCompleted: boolean;
  progress: number;
}

interface AchievementProximityAlertsProps {
  achievements?: ProximityAchievement[];
}

const AchievementProximityAlerts: React.FC<AchievementProximityAlertsProps> = ({ 
  achievements: externalAchievements 
}) => {
  const [achievements, setAchievements] = useState<ProximityAchievement[]>([]);
  const [celebratingAchievement, setCelebratingAchievement] = useState<ProximityAchievement | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const isMobile = useIsMobile();

  // Mock data for when no external achievements are provided
  const mockAchievements: ProximityAchievement[] = [
    {
      id: '1',
      name: 'Social Butterfly',
      description: 'Share 3 more mocktails to unlock this achievement',
      category: 'social',
      threshold: 10,
      pointsReward: 50,
      isCompleted: false,
      progress: 7
    },
    {
      id: '2', 
      name: 'Venue Explorer',
      description: 'Visit 2 more establishments to unlock this achievement',
      category: 'visits',
      threshold: 5,
      pointsReward: 25,
      isCompleted: false,
      progress: 3
    },
    {
      id: '3',
      name: 'Taste Tester',
      description: 'Try 1 more mocktail to unlock this achievement',
      category: 'mocktails',
      threshold: 15,
      pointsReward: 75,
      isCompleted: false,
      progress: 14
    }
  ];

  useEffect(() => {
    setAchievements(externalAchievements || mockAchievements);
  }, [externalAchievements]);

  // Filter to show only achievements that are close to completion (80%+ progress)
  const proximityAchievements = achievements.filter(achievement => {
    const progressPercentage = (achievement.progress / achievement.threshold) * 100;
    return !achievement.isCompleted && progressPercentage >= 80;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case 'visits':
        return <Trophy className="h-4 w-4 text-blue-500" />;
      case 'mocktails':
        return <Star className="h-4 w-4 text-purple-500" />;
      case 'social':
        return <Gift className="h-4 w-4 text-green-500" />;
      default:
        return <Target className="h-4 w-4 text-amber-500" />;
    }
  };

  const getRemainingCount = (achievement: ProximityAchievement) => {
    return Math.max(0, achievement.threshold - achievement.progress);
  };

  const getProgressPercentage = (achievement: ProximityAchievement) => {
    return Math.min(100, (achievement.progress / achievement.threshold) * 100);
  };

  const handleAchievementClick = (achievement: ProximityAchievement) => {
    // Simulate completing an achievement for demo purposes
    const updatedAchievement = {
      ...achievement,
      isCompleted: true,
      progress: achievement.threshold
    };
    
    setCelebratingAchievement(updatedAchievement);
    setShowCelebration(true);
    
    // Update achievements list
    setAchievements(prev => 
      prev.map(a => a.id === achievement.id ? updatedAchievement : a)
    );
  };

  const handleCelebrationComplete = () => {
    setCelebratingAchievement(null);
    setShowCelebration(false);
  };

  if (proximityAchievements.length === 0) {
    return null;
  }

  return (
    <>
      <Card className="w-full border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold flex items-center gap-2 text-amber-700`}>
            <Trophy className="h-5 w-5 text-amber-600 animate-pulse" />
            Almost There!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {proximityAchievements.map((achievement) => (
            <Card 
              key={achievement.id}
              className="p-3 hover:shadow-md transition-all duration-200 cursor-pointer border-amber-200 hover:border-amber-300"
              onClick={() => handleAchievementClick(achievement)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getIcon(achievement.category)}
                  <span className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                    {achievement.name}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-2`}>
                {achievement.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {achievement.progress}/{achievement.threshold}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    +{achievement.pointsReward} pts
                  </Badge>
                </div>
                <Progress 
                  value={getProgressPercentage(achievement)} 
                  className={`${isMobile ? 'h-2' : 'h-2.5'}`}
                />
                <div className="text-center">
                  <span className="text-xs font-medium text-amber-600">
                    {getRemainingCount(achievement)} more to go!
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      <AchievementCelebration
        achievement={celebratingAchievement}
        isVisible={showCelebration}
        onClose={handleCelebrationComplete}
        onComplete={handleCelebrationComplete}
      />
    </>
  );
};

export default AchievementProximityAlerts;
