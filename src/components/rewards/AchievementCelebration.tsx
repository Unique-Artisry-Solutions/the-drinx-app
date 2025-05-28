
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  name: string;
  description: string;
  pointsReward: number;
  icon: string;
  category: string;
}

interface AchievementCelebrationProps {
  achievement: Achievement | null;
  onComplete?: () => void;
  className?: string;
}

const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
  achievement,
  onComplete,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onComplete?.(), 300);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onComplete]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy':
        return <Trophy className="h-12 w-12" />;
      case 'star':
        return <Star className="h-12 w-12" />;
      case 'award':
        return <Award className="h-12 w-12" />;
      default:
        return <Sparkles className="h-12 w-12" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'visits':
        return 'from-blue-500 to-purple-600';
      case 'mocktails':
        return 'from-pink-500 to-orange-500';
      case 'reviews':
        return 'from-green-500 to-teal-600';
      case 'streaks':
        return 'from-red-500 to-pink-600';
      case 'special':
        return 'from-amber-500 to-yellow-600';
      default:
        return 'from-purple-500 to-indigo-600';
    }
  };

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
            className
          )}
          onClick={() => setIsVisible(false)}
        >
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [null, null, -100]
                }}
                transition={{ 
                  duration: 3,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3
                }}
                className="absolute w-2 h-2 bg-amber-400 rounded-full"
              />
            ))}
          </div>

          {/* Main celebration card */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: -180 }}
            transition={{ 
              type: "spring",
              damping: 15,
              stiffness: 300,
              duration: 0.6
            }}
            className="relative mx-4 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glowing border effect */}
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-75 blur-sm bg-gradient-to-r",
              getCategoryColor(achievement.category)
            )} />
            
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6">
              {/* Icon with pulse animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className={cn(
                  "mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center text-white bg-gradient-to-r",
                  getCategoryColor(achievement.category)
                )}
              >
                {getIcon(achievement.icon)}
              </motion.div>

              {/* Achievement unlocked text */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-2"
              >
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Achievement Unlocked!
                </h2>
              </motion.div>

              {/* Achievement name */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-2xl font-bold mb-2 text-foreground"
              >
                {achievement.name}
              </motion.h1>

              {/* Achievement description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-muted-foreground mb-4"
              >
                {achievement.description}
              </motion.p>

              {/* Points reward */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring", damping: 10 }}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r",
                  getCategoryColor(achievement.category)
                )}
              >
                <Star className="h-4 w-4" />
                <span>+{achievement.pointsReward} Points</span>
              </motion.div>

              {/* Floating sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200
                  }}
                  transition={{ 
                    duration: 2,
                    delay: 1 + (i * 0.1),
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-400 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementCelebration;
