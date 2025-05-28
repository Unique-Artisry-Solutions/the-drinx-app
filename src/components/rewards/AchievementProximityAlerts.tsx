
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Star, Flame } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  icon: string;
  category: string;
}

interface AchievementProximityAlertsProps {
  achievements?: Achievement[];
}

const AchievementProximityAlerts: React.FC<AchievementProximityAlertsProps> = ({ 
  achievements = [] 
}) => {
  // Mock data for achievements close to completion
  const nearCompletionAchievements = achievements.length > 0 ? achievements : [
    {
      id: '1',
      name: 'Social Butterfly',
      description: 'Check in at 10 different establishments',
      progress: 8,
      target: 10,
      icon: 'trophy',
      category: 'social'
    },
    {
      id: '2',
      name: 'Mocktail Master',
      description: 'Try 25 different mocktails',
      progress: 22,
      target: 25,
      icon: 'star',
      category: 'exploration'
    },
    {
      id: '3',
      name: 'Weekly Warrior',
      description: 'Complete 5 check-ins this week',
      progress: 4,
      target: 5,
      icon: 'flame',
      category: 'streak'
    }
  ];

  const getIcon = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      star: Star,
      flame: Flame,
      target: Target,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Trophy;
    return <IconComponent className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      social: 'bg-blue-100 text-blue-700 border-blue-200',
      exploration: 'bg-purple-100 text-purple-700 border-purple-200',
      streak: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[category as keyof typeof colors] || colors.social;
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.round((progress / target) * 100);
  };

  // Only show achievements that are close to completion (80% or more)
  const closeToCompletion = nearCompletionAchievements.filter(
    achievement => getProgressPercentage(achievement.progress, achievement.target) >= 80
  );

  if (closeToCompletion.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Target className="h-5 w-5 text-amber-500" />
          Almost There!
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          You're close to unlocking these achievements
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {closeToCompletion.map((achievement) => {
          const progressPercentage = getProgressPercentage(achievement.progress, achievement.target);
          
          return (
            <div key={achievement.id} className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 rounded-lg bg-amber-100">
                  {getIcon(achievement.icon)}
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{achievement.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {achievement.description}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getCategoryColor(achievement.category)}`}
                    >
                      {achievement.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {achievement.progress} / {achievement.target}
                      </span>
                      <span className="text-xs font-medium text-amber-600">
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AchievementProximityAlerts;
