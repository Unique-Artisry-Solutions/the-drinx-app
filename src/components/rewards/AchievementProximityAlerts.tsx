
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MapPin, Star, Share, Target, Clock } from 'lucide-react';
import { Achievement } from '@/hooks/usePersonalizedData';

interface AchievementProximityAlertsProps {
  achievements: Achievement[];
}

const AchievementProximityAlerts: React.FC<AchievementProximityAlertsProps> = ({ achievements }) => {
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

  if (nearCompletionAchievements.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Achievement Progress Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {nearCompletionAchievements.map((achievement) => {
            const Icon = getIcon(achievement.icon);
            const progressPercentage = (achievement.progress / achievement.total) * 100;
            
            return (
              <div key={achievement.id} className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-white ${getUrgencyColor(achievement.urgency)}`}
                  >
                    {achievement.urgency}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress: {achievement.progress}/{achievement.total}</span>
                    <span className="font-medium">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {achievement.suggestion && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                    <Target className="h-4 w-4" />
                    <span>{achievement.suggestion}</span>
                  </div>
                )}

                {achievement.estimatedCompletion && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Clock className="h-4 w-4" />
                    <span>Est. completion: {achievement.estimatedCompletion}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    +{achievement.pointsReward} points
                  </span>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementProximityAlerts;
