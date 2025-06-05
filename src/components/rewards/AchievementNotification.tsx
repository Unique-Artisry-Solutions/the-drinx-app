
import React from 'react';
import { Trophy, Award, Star, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Achievement } from '@/types/rewards';

interface AchievementNotificationProps {
  achievement: Achievement;
  showToast?: boolean;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievement, showToast = true }) => {
  const { toast } = useToast();

  const getIcon = () => {
    switch (achievement.category) {
      case 'visits':
        return <Trophy className="h-5 w-5 text-blue-500" />;
      case 'mocktails':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'special':
        return <Award className="h-5 w-5 text-amber-500" />;
      default:
        return <Check className="h-5 w-5 text-green-500" />;
    }
  };

  React.useEffect(() => {
    if (showToast) {
      toast({
        title: "Achievement Unlocked!",
        description: (
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1">
              <p className="font-medium">{achievement.name}</p>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              <Badge className="mt-1.5" variant="secondary">+{achievement.pointsReward} points</Badge>
            </div>
          </div>
        ),
        duration: 5000,
      });
    }
  }, [achievement, showToast, toast]);

  return null;
};

export default AchievementNotification;
