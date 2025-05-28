
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalizedData } from '@/hooks/usePersonalizedData';
import { useStreakData } from '@/hooks/useStreakData';
import { AnimatedProgressBar } from '@/components/animations/AnimatedProgressBar';
import { StreakFlame } from '@/components/animations/StreakFlame';
import { ParticleEffect } from '@/components/animations/ParticleEffect';
import StreakMotivationCard from './StreakMotivationCard';

interface PersonalizedProgressHeaderProps {
  className?: string;
}

const PersonalizedProgressHeader: React.FC<PersonalizedProgressHeaderProps> = ({
  className
}) => {
  const [showPointsParticles, setShowPointsParticles] = useState(false);
  const [showTierParticles, setShowTierParticles] = useState(false);

  const {
    loading,
    userStats,
    isAuthenticated
  } = usePersonalizedData();
  
  const {
    currentStreak,
    longestStreak,
    streakData,
    isLoading: streakLoading
  } = useStreakData();

  if (loading || streakLoading || !isAuthenticated) {
    return null;
  }

  // Mock data for demonstration
  const mockData = {
    currentPoints: 1250,
    recentGains: 85,
    currentTier: 'Silver Explorer',
    nextTier: 'Gold Adventurer',
    tierProgress: 65,
    pointsToNextTier: 750,
    nearbyAchievements: [{
      name: 'Social Butterfly',
      progress: 8,
      total: 10,
      reward: '50 pts'
    }, {
      name: 'Circuit Master',
      progress: 2,
      total: 3,
      reward: '100 pts'
    }]
  };

  const handlePointsClick = () => {
    setShowPointsParticles(true);
  };

  const handleTierClick = () => {
    setShowTierParticles(true);
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Main Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Points Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="my-0 py-[5px] overflow-hidden cursor-pointer" onClick={handlePointsClick}>
              <CardContent className="p-4 my-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Star className="h-4 w-4 text-amber-500" />
                      </motion.div>
                      <span className="text-sm font-medium">Points Balance</span>
                    </div>
                    <motion.div 
                      className="text-2xl font-bold mt-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      {mockData.currentPoints.toLocaleString()}
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-1 mt-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">+{mockData.recentGains} today</span>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="my-0 py-[5px]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between my-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <StreakFlame streakCount={currentStreak} size={16} />
                      <span className="text-sm font-medium">Current Streak</span>
                    </div>
                    <motion.div 
                      className="text-2xl font-bold mt-1"
                      animate={currentStreak > 0 ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {currentStreak} days
                    </motion.div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Best: {longestStreak} days
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tier Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="py-[5px] cursor-pointer" onClick={handleTierClick}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Trophy className="h-4 w-4 text-purple-500" />
                    </motion.div>
                    <span className="text-sm font-medium">Tier Progress</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{mockData.currentTier}</span>
                      <span>{mockData.nextTier}</span>
                    </div>
                    <AnimatedProgressBar 
                      value={mockData.tierProgress} 
                      className="h-2"
                      color="default"
                      showGlow={mockData.tierProgress > 60}
                    />
                    <motion.div 
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {mockData.pointsToNextTier} points to next tier
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievement Proximity Alerts */}
        <AnimatePresence>
          {mockData.nearbyAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Trophy className="h-4 w-4 text-amber-500" />
                    </motion.div>
                    Almost There!
                  </h4>
                  <div className="space-y-3">
                    {mockData.nearbyAchievements.map((achievement, index) => (
                      <motion.div 
                        key={index} 
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{achievement.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {achievement.reward}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{achievement.progress}/{achievement.total}</span>
                            <span>{Math.round(achievement.progress / achievement.total * 100)}%</span>
                          </div>
                          <AnimatedProgressBar 
                            value={achievement.progress / achievement.total * 100} 
                            className="h-1.5"
                            color="warning"
                            showGlow={achievement.progress / achievement.total > 0.7}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streak Motivation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StreakMotivationCard 
            currentStreak={currentStreak} 
            longestStreak={longestStreak} 
            streakData={streakData} 
          />
        </motion.div>
      </div>

      <ParticleEffect
        trigger={showPointsParticles}
        points={mockData.recentGains}
        origin={{ x: 25, y: 30 }}
        onComplete={() => setShowPointsParticles(false)}
      />

      <ParticleEffect
        trigger={showTierParticles}
        points={mockData.pointsToNextTier}
        origin={{ x: 75, y: 30 }}
        onComplete={() => setShowTierParticles(false)}
      />
    </>
  );
};

export default PersonalizedProgressHeader;
