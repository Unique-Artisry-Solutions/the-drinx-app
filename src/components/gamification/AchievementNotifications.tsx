
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Star, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface FollowerAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked_at: string;
  category: string;
}

interface AchievementNotificationsProps {
  achievements: FollowerAchievement[];
  onMarkViewed: (achievementId: string) => void;
  onViewDetails: (achievement: FollowerAchievement) => void;
}

const AchievementNotifications: React.FC<AchievementNotificationsProps> = ({
  achievements,
  onMarkViewed,
  onViewDetails
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'target': return Target;
      default: return Trophy;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {achievements.map((achievement) => {
          const IconComponent = getIcon(achievement.icon);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-6 w-6" />
                      <span className="font-bold text-sm">Achievement Unlocked!</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkViewed(achievement.id)}
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1">{achievement.title}</h3>
                  <p className="text-sm opacity-90 mb-2">{achievement.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">+{achievement.points} points</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onViewDetails(achievement)}
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AchievementNotifications;
