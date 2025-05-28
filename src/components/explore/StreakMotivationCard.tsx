
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { StreakFlame } from '@/components/animations/StreakFlame';
import { AnimatedProgressBar } from '@/components/animations/AnimatedProgressBar';
import { ParticleEffect } from '@/components/animations/ParticleEffect';

interface StreakDay {
  date: Date;
  hasVisit: boolean;
  visitCount: number;
  points?: number;
}

interface StreakMotivationCardProps {
  currentStreak: number;
  longestStreak: number;
  streakData: StreakDay[];
}

const StreakMotivationCard: React.FC<StreakMotivationCardProps> = ({
  currentStreak,
  longestStreak,
  streakData
}) => {
  const [showParticles, setShowParticles] = useState(false);
  
  // Calculate streak momentum and motivation
  const recentDays = streakData.slice(-7); // Last 7 days
  const visitedDaysThisWeek = recentDays.filter(day => day.hasVisit).length;
  const isOnFire = currentStreak >= 3;
  const isCloseToRecord = longestStreak > 0 && currentStreak >= longestStreak - 2;
  
  // Generate motivational message
  const getMotivationalMessage = () => {
    if (currentStreak === 0) {
      return "Start your streak journey today! Every great achievement begins with a single step.";
    }
    if (currentStreak === 1) {
      return "Great start! Come back tomorrow to build your streak.";
    }
    if (currentStreak < 3) {
      return `${currentStreak} days strong! You're building momentum.`;
    }
    if (isCloseToRecord) {
      return `So close to your personal record of ${longestStreak} days! Keep going!`;
    }
    if (currentStreak > longestStreak) {
      return `New personal record! ${currentStreak} days - you're unstoppable!`;
    }
    return `${currentStreak} day streak! You're on fire! 🔥`;
  };

  const getMotivationLevel = () => {
    if (currentStreak === 0) return 'Start Today';
    if (currentStreak < 3) return 'Building';
    if (currentStreak < 7) return 'Momentum';
    if (currentStreak < 14) return 'On Fire';
    return 'Legendary';
  };

  const handleStreakClick = () => {
    if (currentStreak > 0) {
      setShowParticles(true);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStreakClick}
                  className="cursor-pointer"
                >
                  <StreakFlame streakCount={currentStreak} size={20} />
                </motion.div>
                <span className="font-medium">Streak Motivation</span>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Badge variant={isOnFire ? "default" : "secondary"}>
                  {getMotivationLevel()}
                </Badge>
              </motion.div>
            </div>

            {/* Main Message */}
            <motion.div 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {getMotivationalMessage()}
            </motion.div>

            {/* Streak Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="text-lg font-bold text-orange-500"
                  animate={currentStreak > 0 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentStreak}
                </motion.div>
                <div className="text-xs text-muted-foreground">Current</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="text-lg font-bold text-purple-600">
                  {longestStreak}
                </div>
                <div className="text-xs text-muted-foreground">Best</div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-lg font-bold text-green-600">
                  {visitedDaysThisWeek}
                </div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </motion.div>
            </div>

            {/* Visual Streak Indicator with Animation */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Last 7 days</span>
                <span>{visitedDaysThisWeek}/7 visits</span>
              </div>
              <div className="flex gap-1">
                {recentDays.map((day, index) => (
                  <motion.div
                    key={index}
                    className={`h-2 flex-1 rounded ${
                      day.hasVisit 
                        ? 'bg-orange-500' 
                        : 'bg-muted'
                    }`}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ 
                      delay: 0.7 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ scaleY: 1.2 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Progress to Next Milestone */}
            {currentStreak > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Trophy className="h-3 w-3 text-amber-500" />
                  <span className="text-muted-foreground">
                    Next milestone: {Math.ceil((currentStreak + 1) / 7) * 7} days
                  </span>
                </div>
                <AnimatedProgressBar
                  value={currentStreak % 7 || 7}
                  max={7}
                  color="success"
                  showGlow={isOnFire}
                  className="h-2"
                />
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      <ParticleEffect
        trigger={showParticles}
        points={currentStreak * 5}
        onComplete={() => setShowParticles(false)}
      />
    </>
  );
};

export default StreakMotivationCard;
