
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { MapPin, Star, Share, Target, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Achievement } from '@/hooks/usePersonalizedData';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedProgressBar } from '@/components/animations/AnimatedProgressBar';
import { AchievementCelebration } from '@/components/animations/AchievementCelebration';

interface AchievementProximityAlertsProps {
  achievements: Achievement[];
}

const AchievementProximityAlerts: React.FC<AchievementProximityAlertsProps> = ({ achievements }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [celebratingAchievement, setCelebratingAchievement] = useState<Achievement | null>(null);
  const isMobile = useIsMobile();
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'map-pin':
        return MapPin;
      case 'star':
        return Star;
      case 'share':
        return Share;
      case 'target':
        return Target;
      default:
        return Target;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const nearCompletionAchievements = achievements.filter(
    achievement => (achievement.progress / achievement.total) >= 0.6
  );

  const handleViewDetails = (achievement: Achievement) => {
    // Simulate achievement completion for demo
    if (achievement.progress / achievement.total > 0.8) {
      setCelebratingAchievement({
        ...achievement,
        category: achievement.category as 'visits' | 'mocktails' | 'social' | 'special'
      });
    }
  };

  if (nearCompletionAchievements.length === 0) {
    return null;
  }

  const AchievementsList = () => (
    <div className="space-y-4">
      {nearCompletionAchievements.map((achievement, index) => {
        const Icon = getIcon(achievement.icon);
        const progressPercentage = (achievement.progress / achievement.total) * 100;
        
        return (
          <div 
            key={achievement.id} 
            className={`p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] ${isMobile ? 'min-h-[120px]' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-2 rounded-full bg-primary/10 animate-pulse ${isMobile ? 'min-w-[40px]' : ''}`}>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-foreground ${isMobile ? 'text-sm' : ''}`}>{achievement.name}</h3>
                  <p className={`text-sm text-muted-foreground ${isMobile ? 'text-xs line-clamp-2' : ''}`}>{achievement.description}</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`text-white animate-pulse ${getUrgencyColor(achievement.urgency)} ${isMobile ? 'text-xs' : ''}`}
              >
                {achievement.urgency}
              </Badge>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className={isMobile ? 'text-xs' : ''}>Progress: {achievement.progress}/{achievement.total}</span>
                <span className={`font-medium ${isMobile ? 'text-xs' : ''}`}>{Math.round(progressPercentage)}%</span>
              </div>
              <AnimatedProgressBar 
                value={progressPercentage} 
                max={100}
                className={`${isMobile ? 'h-3' : 'h-2'}`}
                showGlow={progressPercentage > 80}
                color={progressPercentage > 90 ? 'success' : progressPercentage > 70 ? 'warning' : 'default'}
              />
            </div>

            {achievement.suggestion && (
              <div className={`flex items-center gap-2 text-blue-600 mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <Target className="h-4 w-4 flex-shrink-0 animate-bounce" />
                <span className={isMobile ? 'line-clamp-2' : ''}>{achievement.suggestion}</span>
              </div>
            )}

            {achievement.estimatedCompletion && (
              <div className={`flex items-center gap-2 text-muted-foreground mb-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Est. completion: {achievement.estimatedCompletion}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className={`font-medium text-primary animate-pulse ${isMobile ? 'text-xs' : 'text-sm'}`}>
                +{achievement.pointsReward} points
              </span>
              <Button 
                size={isMobile ? "sm" : "sm"} 
                variant="outline" 
                className={`transition-all duration-200 hover:scale-105 ${isMobile ? 'text-xs px-3 py-1 h-8' : ''}`}
                onClick={() => handleViewDetails(achievement)}
              >
                View Details
              </Button>
            </div>
          </div>
        );
      })}

      <AchievementCelebration
        achievement={celebratingAchievement}
        isVisible={!!celebratingAchievement}
        onClose={() => setCelebratingAchievement(null)}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Card className="w-full">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors min-h-[64px] flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary animate-pulse" />
                Achievements ({nearCompletionAchievements.length})
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
              <AchievementsList />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary animate-pulse" />
          Achievement Progress Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AchievementsList />
      </CardContent>
    </Card>
  );
};

export default AchievementProximityAlerts;
