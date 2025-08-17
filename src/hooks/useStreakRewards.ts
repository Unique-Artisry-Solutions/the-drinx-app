
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

export interface StreakReward {
  day: number;
  points: number;
  multiplier: number;
  description: string;
  type: 'daily' | 'milestone' | 'bonus';
  isUnlocked: boolean;
}

export interface StreakRecovery {
  gracePeriod: number; // hours
  cost: number; // points to recover
  isAvailable: boolean;
  discount?: number; // percentage off recovery cost
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalStreaksCompleted: number;
  streakPoints: number;
  averageStreakLength: number;
  lastStreakDate: string;
}

export interface StreakMilestone {
  days: number;
  title: string;
  reward: string;
  points: number;
  multiplier: number;
  isReached: boolean;
  progress: number;
}

export const useStreakRewards = () => {
  const { user, isAuthenticated } = useAuthenticatedUser();
  const { toast } = useToast();
  
  const [streakStats, setStreakStats] = useState<StreakStats | null>(null);
  const [streakRewards, setStreakRewards] = useState<StreakReward[]>([]);
  const [streakRecovery, setStreakRecovery] = useState<StreakRecovery | null>(null);
  const [streakMilestones, setStreakMilestones] = useState<StreakMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCalculation, setLastCalculation] = useState<Date>(new Date());

  // Calculate current streak and multipliers
  const calculateStreak = useCallback(() => {
    if (!isAuthenticated) return null;

    // Mock calculation - in real app, this would check actual visit dates
    const now = new Date();
    const lastVisit = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday
    const hoursSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60);
    
    // Streak is active if last visit was within 48 hours
    const isStreakActive = hoursSinceLastVisit <= 48;
    const currentStreak = isStreakActive ? 5 : 0;
    
    return {
      currentStreak,
      isActive: isStreakActive,
      hoursSinceLastVisit,
      multiplier: calculateMultiplier(currentStreak),
      daysUntilBreak: isStreakActive ? Math.max(0, 48 - hoursSinceLastVisit) / 24 : 0
    };
  }, [isAuthenticated]);

  // Calculate reward multiplier based on streak length
  const calculateMultiplier = (streakDays: number): number => {
    if (streakDays === 0) return 1.0;
    if (streakDays < 3) return 1.1;
    if (streakDays < 7) return 1.25;
    if (streakDays < 14) return 1.5;
    if (streakDays < 30) return 1.75;
    return 2.0; // Max multiplier
  };

  // Load streak data
  useEffect(() => {
    const loadStreakData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Mock streak stats
        setStreakStats({
          currentStreak: 5,
          longestStreak: 12,
          totalStreaksCompleted: 8,
          streakPoints: 450,
          averageStreakLength: 6.2,
          lastStreakDate: new Date(Date.now() - 86400000).toISOString()
        });

        // Generate streak rewards for next 14 days
        const rewards: StreakReward[] = [];
        for (let day = 1; day <= 14; day++) {
          const basePoints = 20;
          const multiplier = calculateMultiplier(day);
          const points = Math.floor(basePoints * multiplier);
          
          let type: 'daily' | 'milestone' | 'bonus' = 'daily';
          if ([3, 7, 14].includes(day)) type = 'milestone';
          if (day % 5 === 0) type = 'bonus';

          rewards.push({
            day,
            points,
            multiplier,
            description: type === 'milestone' 
              ? `${day}-day milestone bonus!`
              : type === 'bonus'
              ? `Weekly bonus day!`
              : `Day ${day} reward`,
            type,
            isUnlocked: day <= 5 // Current streak is 5
          });
        }
        setStreakRewards(rewards);

        // Streak recovery options
        const currentStreak = calculateStreak();
        const isRecoveryAvailable = currentStreak?.currentStreak === 0 && 
                                   currentStreak?.hoursSinceLastVisit <= 72;
        
        setStreakRecovery({
          gracePeriod: 24,
          cost: 50,
          isAvailable: isRecoveryAvailable,
          discount: 20 // 20% off during grace period
        });

        // Streak milestones
        setStreakMilestones([
          {
            days: 3,
            title: 'Getting Started',
            reward: 'Streak Multiplier x1.25',
            points: 50,
            multiplier: 1.25,
            isReached: true,
            progress: 100
          },
          {
            days: 7,
            title: 'Week Warrior',
            reward: 'Streak Multiplier x1.5 + Badge',
            points: 100,
            multiplier: 1.5,
            isReached: false,
            progress: 71 // 5/7 days
          },
          {
            days: 14,
            title: 'Dedication Master',
            reward: 'Streak Multiplier x1.75 + Special Badge',
            points: 250,
            multiplier: 1.75,
            isReached: false,
            progress: 36 // 5/14 days
          },
          {
            days: 30,
            title: 'Legendary Streak',
            reward: 'Maximum Multiplier x2.0 + Elite Status',
            points: 500,
            multiplier: 2.0,
            isReached: false,
            progress: 17 // 5/30 days
          }
        ]);

      } catch (error) {
        console.error('Error loading streak data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStreakData();
  }, [isAuthenticated, calculateStreak]);

  // Maintain streak (simulate check-in)
  const maintainStreak = useCallback(async () => {
    if (!isAuthenticated) return false;

    try {
      const currentStreak = calculateStreak();
      if (!currentStreak) return false;

      const newStreakCount = currentStreak.currentStreak + 1;
      const newMultiplier = calculateMultiplier(newStreakCount);
      const pointsEarned = Math.floor(25 * newMultiplier);

      // Update streak stats
      if (streakStats) {
        setStreakStats(prev => prev ? {
          ...prev,
          currentStreak: newStreakCount,
          longestStreak: Math.max(prev.longestStreak, newStreakCount),
          streakPoints: prev.streakPoints + pointsEarned,
          lastStreakDate: new Date().toISOString()
        } : null);
      }

      // Check for milestone achievements
      const milestoneReached = streakMilestones.find(
        m => m.days === newStreakCount && !m.isReached
      );

      if (milestoneReached) {
        toast({
          title: '🏆 Streak Milestone!',
          description: `${milestoneReached.title}: ${milestoneReached.reward}`,
          duration: 5000,
        });
      }

      toast({
        title: '🔥 Streak Maintained!',
        description: `Day ${newStreakCount}! Earned ${pointsEarned} points (${newMultiplier}x multiplier)`,
        duration: 3000,
      });

      setLastCalculation(new Date());
      return true;

    } catch (error) {
      console.error('Error maintaining streak:', error);
      return false;
    }
  }, [isAuthenticated, calculateStreak, streakStats, streakMilestones, toast]);

  // Recover broken streak
  const recoverStreak = useCallback(async (usePoints: boolean = false) => {
    if (!isAuthenticated || !streakRecovery?.isAvailable) return false;

    try {
      const cost = usePoints ? Math.floor(streakRecovery.cost * (1 - (streakRecovery.discount || 0) / 100)) : 0;
      
      // In real app, would deduct points and restore streak
      toast({
        title: '🔥 Streak Recovered!',
        description: usePoints 
          ? `Streak restored for ${cost} points!`
          : 'Grace period streak recovery applied!',
        duration: 3000,
      });

      // Update streak recovery availability
      setStreakRecovery(prev => prev ? { ...prev, isAvailable: false } : null);
      
      return true;

    } catch (error) {
      console.error('Error recovering streak:', error);
      return false;
    }
  }, [isAuthenticated, streakRecovery, toast]);

  // Get streak suggestions
  const getStreakSuggestions = useCallback(() => {
    const currentStreak = calculateStreak();
    if (!currentStreak) return [];

    const suggestions = [];

    if (currentStreak.daysUntilBreak < 1) {
      suggestions.push({
        type: 'urgent',
        title: 'Streak at Risk!',
        description: 'Visit an establishment today to maintain your streak',
        action: 'Find nearby establishments',
        pointsAtRisk: Math.floor(25 * currentStreak.multiplier)
      });
    } else if (currentStreak.daysUntilBreak < 0.5) {
      suggestions.push({
        type: 'warning',
        title: 'Streak Ending Soon',
        description: 'Your streak expires in a few hours',
        action: 'Quick check-in recommended',
        pointsAtRisk: Math.floor(25 * currentStreak.multiplier)
      });
    }

    // Milestone suggestions
    const nextMilestone = streakMilestones.find(m => !m.isReached);
    if (nextMilestone) {
      const daysToMilestone = nextMilestone.days - currentStreak.currentStreak;
      if (daysToMilestone <= 3) {
        suggestions.push({
          type: 'opportunity',
          title: `${nextMilestone.title} Almost Here!`,
          description: `${daysToMilestone} more days to unlock ${nextMilestone.reward}`,
          action: 'Keep your streak going',
          pointsReward: nextMilestone.points
        });
      }
    }

    return suggestions;
  }, [calculateStreak, streakMilestones]);

  return {
    streakStats,
    streakRewards,
    streakRecovery,
    streakMilestones,
    isLoading,
    lastCalculation,
    calculateStreak,
    calculateMultiplier,
    maintainStreak,
    recoverStreak,
    getStreakSuggestions
  };
};
