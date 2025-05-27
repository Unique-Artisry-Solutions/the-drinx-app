
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Award, Target, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRewards } from '@/hooks/rewards/useRewards';
import { useAchievements } from '@/hooks/rewards/useAchievements';

interface PersonalizedProgressHeaderProps {
  className?: string;
}

const PersonalizedProgressHeader: React.FC<PersonalizedProgressHeaderProps> = ({ className }) => {
  const { rewardProfile, isLoading } = useRewards();
  const { achievements } = useAchievements();

  // Mock streak data - in real app this would come from a streak tracking hook
  const streakData = {
    currentStreak: 7,
    longestStreak: 15,
    streakType: 'daily_visit',
    lastActivity: new Date(),
    nextMilestone: 14
  };

  // Mock recent points gain
  const recentPointsGain = 50;

  // Calculate tier progress
  const currentPoints = rewardProfile?.points || 0;
  const currentTier = rewardProfile?.currentTier;
  const nextTierPoints = currentTier ? (currentTier.points_required || 0) + 500 : 500;
  const tierProgress = currentTier ? ((currentPoints - (currentTier.points_required || 0)) / 500) * 100 : (currentPoints / 500) * 100;

  // Find achievements close to completion
  const proximityAchievements = achievements?.filter(achievement => 
    !achievement.isCompleted && 
    achievement.progress && 
    achievement.threshold &&
    (achievement.progress / achievement.threshold) >= 0.7
  ).slice(0, 2) || [];

  if (isLoading) {
    return (
      <Card className={`bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-none shadow-lg ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Progress
            </h2>
            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
              View Details
            </Button>
          </div>

          {/* Main Progress Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Streak Counter */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Flame className={`h-6 w-6 ${streakData.currentStreak >= 7 ? 'text-orange-500' : 'text-gray-400'}`} />
                </motion.div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {streakData.currentStreak}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                Next milestone: {streakData.nextMilestone} days
              </div>
            </motion.div>

            {/* Points Balance */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
                </div>
              </div>
              {recentPointsGain > 0 && (
                <motion.div 
                  className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <TrendingUp className="h-3 w-3" />
                  +{recentPointsGain} recent
                </motion.div>
              )}
            </motion.div>

            {/* Tier Progress */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {currentTier?.name || 'Bronze'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Tier</div>
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={Math.min(tierProgress, 100)} className="h-2" />
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {nextTierPoints - currentPoints} to next tier
                </div>
              </div>
            </motion.div>

            {/* Achievement Alert */}
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {proximityAchievements.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Close to unlock
                  </div>
                </div>
              </div>
              {proximityAchievements.length > 0 && (
                <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  {proximityAchievements[0].name}
                </div>
              )}
            </motion.div>
          </div>

          {/* Achievement Proximity Alerts */}
          {proximityAchievements.length > 0 && (
            <motion.div 
              className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                    Achievement Progress
                  </h3>
                  <div className="space-y-2">
                    {proximityAchievements.map((achievement, index) => (
                      <div key={achievement.id} className="flex items-center justify-between">
                        <span className="text-sm text-amber-700 dark:text-amber-300">
                          {achievement.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(achievement.progress / achievement.threshold) * 100} 
                            className="w-16 h-2"
                          />
                          <span className="text-xs text-amber-600 dark:text-amber-400">
                            {achievement.progress}/{achievement.threshold}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedProgressHeader;
