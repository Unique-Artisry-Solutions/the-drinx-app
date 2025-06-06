
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Award, Star, Crown, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FollowerAchievement } from '@/types/gamification';

interface AchievementNotificationProps {
  achievement: FollowerAchievement;
  onClose: () => void;
  onViewDetails?: () => void;
}

interface AchievementNotificationsProps {
  newAchievements: FollowerAchievement[];
  onMarkViewed: (achievementId: string) => void;
  onViewDetails?: (achievement: FollowerAchievement) => void;
}

const getAchievementIcon = (type: string) => {
  switch (type) {
    case 'badge':
      return Award;
    case 'milestone':
      return Star;
    case 'tier_upgrade':
      return Crown;
    default:
      return Gift;
  }
};

const getAchievementColor = (type: string) => {
  switch (type) {
    case 'badge':
      return 'from-blue-400 to-blue-600';
    case 'milestone':
      return 'from-purple-400 to-purple-600';
    case 'tier_upgrade':
      return 'from-yellow-400 to-yellow-600';
    default:
      return 'from-green-400 to-green-600';
  }
};

const CelebrationParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          initial={{
            x: '50%',
            y: '50%',
            scale: 0,
            opacity: 1
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 200}%`,
            y: `${50 + (Math.random() - 0.5) * 200}%`,
            scale: [0, 1, 0],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  onViewDetails
}) => {
  const IconComponent = getAchievementIcon(achievement.achievement_type);
  const colorClass = getAchievementColor(achievement.achievement_type);

  const getTitle = () => {
    switch (achievement.achievement_type) {
      case 'badge':
        return `Badge Earned: ${achievement.badge?.name || 'New Badge'}`;
      case 'milestone':
        return `Milestone Reached: ${achievement.milestone?.milestone_name || 'New Milestone'}`;
      case 'tier_upgrade':
        return `Tier Upgrade: ${achievement.milestone?.milestone_name || 'New Tier'}`;
      default:
        return 'Achievement Unlocked!';
    }
  };

  const getDescription = () => {
    if (achievement.badge) {
      return achievement.badge.description || 'You earned a new badge!';
    }
    if (achievement.milestone) {
      return `Welcome to ${achievement.milestone.milestone_name}!`;
    }
    return 'Congratulations on your achievement!';
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: -50 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <Card className="relative overflow-hidden border-2 border-yellow-300 shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-10`} />
        <CelebrationParticles />
        
        <CardContent className="p-4 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-br ${colorClass} text-white`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{getTitle()}</h3>
                <p className="text-sm text-muted-foreground">{getDescription()}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {achievement.badge && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{achievement.badge.icon}</span>
              <Badge variant="outline" className="text-xs">
                {achievement.badge.rarity}
              </Badge>
            </div>
          )}

          {achievement.points_earned > 0 && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-50 rounded-lg">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                +{achievement.points_earned} points earned!
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" onClick={onViewDetails} className="flex-1">
              View Details
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AchievementNotifications: React.FC<AchievementNotificationsProps> = ({
  newAchievements,
  onMarkViewed,
  onViewDetails
}) => {
  const [visibleAchievements, setVisibleAchievements] = useState<FollowerAchievement[]>([]);

  useEffect(() => {
    // Show new achievements that haven't been viewed
    const unviewedAchievements = newAchievements.filter(
      achievement => !achievement.celebration_viewed
    );

    if (unviewedAchievements.length > 0) {
      // Show one at a time with delay
      unviewedAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          setVisibleAchievements(prev => [...prev, achievement]);
        }, index * 1000);
      });
    }
  }, [newAchievements]);

  const handleClose = (achievement: FollowerAchievement) => {
    setVisibleAchievements(prev => prev.filter(a => a.id !== achievement.id));
    onMarkViewed(achievement.id);

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      setVisibleAchievements(prev => prev.filter(a => a.id !== achievement.id));
    }, 8000);
  };

  const handleViewDetails = (achievement: FollowerAchievement) => {
    onViewDetails?.(achievement);
    handleClose(achievement);
  };

  return (
    <AnimatePresence mode="popLayout">
      {visibleAchievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          style={{ zIndex: 50 + index }}
          initial={{ y: index * 20 }}
          animate={{ y: 0 }}
          className="fixed"
          style={{ 
            bottom: `${20 + index * 120}px`, 
            right: '20px' 
          }}
        >
          <AchievementNotification
            achievement={achievement}
            onClose={() => handleClose(achievement)}
            onViewDetails={() => handleViewDetails(achievement)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default AchievementNotifications;
