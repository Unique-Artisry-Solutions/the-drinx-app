
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Trophy, Star, Target, Zap, Crown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  unlockedAt: Date;
}

interface AchievementNotificationsProps {
  userId?: string;
  maxVisible?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showPoints?: boolean;
  enableSound?: boolean;
  onAchievementClick?: (achievement: Achievement) => void;
  onDismiss?: (achievementId: string) => void;
}

const AchievementNotifications: React.FC<AchievementNotificationsProps> = ({
  userId,
  maxVisible = 3,
  autoHide = true,
  autoHideDelay = 5000,
  position = 'top-right',
  showPoints = true,
  enableSound = false,
  onAchievementClick,
  onDismiss
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [visibleAchievements, setVisibleAchievements] = useState<Achievement[]>([]);

  // Mock achievements for demonstration
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Check-in',
      description: 'Completed your first venue check-in!',
      points: 100,
      icon: 'trophy',
      rarity: 'common',
      category: 'exploration',
      unlockedAt: new Date()
    },
    {
      id: '2',
      title: 'Social Butterfly',
      description: 'Connected with 10 friends',
      points: 250,
      icon: 'star',
      rarity: 'rare',
      category: 'social',
      unlockedAt: new Date()
    }
  ];

  useEffect(() => {
    // Simulate receiving new achievements
    const timer = setTimeout(() => {
      setAchievements(mockAchievements);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userId]);

  useEffect(() => {
    // Update visible achievements based on maxVisible limit
    setVisibleAchievements(achievements.slice(0, maxVisible));
  }, [achievements, maxVisible]);

  useEffect(() => {
    if (autoHide && visibleAchievements.length > 0) {
      const timer = setTimeout(() => {
        handleDismissAll();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [visibleAchievements, autoHide, autoHideDelay]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'target': return Target;
      case 'zap': return Zap;
      case 'crown': return Crown;
      default: return Trophy;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      default: return 'top-4 right-4';
    }
  };

  const handleDismiss = (achievementId: string) => {
    setVisibleAchievements(prev => 
      prev.filter(achievement => achievement.id !== achievementId)
    );
    setAchievements(prev => 
      prev.filter(achievement => achievement.id !== achievementId)
    );
    onDismiss?.(achievementId);
  };

  const handleDismissAll = () => {
    setVisibleAchievements([]);
    setAchievements([]);
  };

  const handleAchievementClick = (achievement: Achievement) => {
    onAchievementClick?.(achievement);
  };

  if (visibleAchievements.length === 0) {
    return null;
  }

  return (
    <div 
      className={`fixed ${getPositionClasses()} z-50 space-y-2 max-w-sm`}
    >
      <AnimatePresence>
        {visibleAchievements.map((achievement, index) => {
          const IconComponent = getIcon(achievement.icon);
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                delay: index * 0.1 
              }}
              whileHover={{ scale: 1.02 }}
              style={{ 
                position: 'relative',
                zIndex: 1000 + index
              }}
            >
              <Card 
                className={`cursor-pointer shadow-lg border-l-4 ${getRarityColor(achievement.rarity)} hover:shadow-xl transition-all duration-200`}
                onClick={() => handleAchievementClick(achievement)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${getRarityColor(achievement.rarity)} text-white`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">
                          {achievement.title}
                        </CardTitle>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getRarityColor(achievement.rarity)} text-white`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss(achievement.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {achievement.category}
                    </span>
                    {showPoints && (
                      <Badge variant="outline" className="text-xs">
                        +{achievement.points} pts
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {visibleAchievements.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismissAll}
            className="text-xs"
          >
            Dismiss All ({visibleAchievements.length})
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AchievementNotifications;
