
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  pointsReward: number;
  category: 'visits' | 'mocktails' | 'social' | 'special';
}

interface AchievementCelebrationProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
}

export const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
  achievement,
  isVisible,
  onClose
}) => {
  if (!achievement) return null;

  const getIcon = () => {
    switch (achievement.category) {
      case 'visits':
        return <Trophy className="h-12 w-12 text-amber-500" />;
      case 'mocktails':
        return <Star className="h-12 w-12 text-purple-500" />;
      case 'social':
        return <Award className="h-12 w-12 text-blue-500" />;
      default:
        return <Sparkles className="h-12 w-12 text-pink-500" />;
    }
  };

  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { scale: 0, rotate: 180, opacity: 0 }
  };

  const sparkleVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <Card className="max-w-md w-full bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-2xl">
              <CardContent className="p-8 text-center relative overflow-hidden">
                {/* Background sparkles */}
                <div className="absolute inset-0">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-amber-400 rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + (i % 2) * 70}%`
                      }}
                      variants={sparkleVariants}
                      animate="animate"
                      transition={{ delay: i * 0.2 }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="relative z-10"
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {getIcon()}
                  </motion.div>

                  <motion.h2
                    className="text-2xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Achievement Unlocked!
                  </motion.h2>

                  <motion.h3
                    className="text-xl font-semibold text-amber-700 mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {achievement.name}
                  </motion.h3>

                  <motion.p
                    className="text-gray-600 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    {achievement.description}
                  </motion.p>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1, type: "spring" }}
                  >
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-lg px-4 py-2">
                      +{achievement.pointsReward} Points
                    </Badge>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
