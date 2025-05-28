
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  progress: number;
  total: number;
  pointsReward: number;
  icon: string;
  urgency: 'low' | 'medium' | 'high';
  suggestion?: string;
  estimatedCompletion?: string;
}

interface ActivityEvent {
  type: 'visit' | 'mocktail_ordered' | 'review_written' | 'check_in' | 'social_share';
  establishmentId?: string;
  mocktailId?: string;
  metadata?: Record<string, any>;
}

export const useAchievementTracking = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock achievements data
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      name: 'Social Explorer',
      description: 'Visit 10 different establishments',
      category: 'visits',
      progress: 8,
      total: 10,
      pointsReward: 100,
      icon: 'map-pin',
      urgency: 'high',
      suggestion: 'Visit 2 more establishments nearby',
      estimatedCompletion: '15 minutes'
    },
    {
      id: '2',
      name: 'Mocktail Master',
      description: 'Try 15 different mocktails',
      category: 'mocktails',
      progress: 12,
      total: 15,
      pointsReward: 150,
      icon: 'glass-water',
      urgency: 'medium',
      suggestion: 'Order 3 more unique mocktails',
      estimatedCompletion: '30 minutes'
    },
    {
      id: '3',
      name: 'Weekend Warrior',
      description: 'Complete 3 activities this weekend',
      category: 'special',
      progress: 2,
      total: 3,
      pointsReward: 75,
      icon: 'star',
      urgency: 'high',
      suggestion: 'One more activity before Sunday ends!',
      estimatedCompletion: '5 minutes'
    },
    {
      id: '4',
      name: 'Review Champion',
      description: 'Write 5 helpful reviews',
      category: 'reviews',
      progress: 3,
      total: 5,
      pointsReward: 80,
      icon: 'star',
      urgency: 'medium',
      suggestion: 'Share your experience with 2 more reviews',
      estimatedCompletion: '10 minutes'
    },
    {
      id: '5',
      name: 'Check-in Streak',
      description: 'Check in for 7 consecutive days',
      category: 'streaks',
      progress: 5,
      total: 7,
      pointsReward: 120,
      icon: 'flame',
      urgency: 'high',
      suggestion: 'Keep your streak alive for 2 more days',
      estimatedCompletion: '2 days'
    }
  ];

  // Initialize achievements
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAchievements(mockAchievements);
      setLoading(false);
    }, 500);
  }, []);

  // Track activity and update achievement progress
  const trackActivity = useCallback((activity: ActivityEvent) => {
    setRecentActivity(prev => [activity, ...prev.slice(0, 9)]); // Keep last 10 activities
    
    // Update achievement progress based on activity
    setAchievements(prev => 
      prev.map(achievement => {
        let newProgress = achievement.progress;
        
        switch (activity.type) {
          case 'visit':
            if (achievement.category === 'visits') {
              newProgress = Math.min(achievement.progress + 1, achievement.total);
            }
            break;
          case 'mocktail_ordered':
            if (achievement.category === 'mocktails') {
              newProgress = Math.min(achievement.progress + 1, achievement.total);
            }
            break;
          case 'review_written':
            if (achievement.category === 'reviews') {
              newProgress = Math.min(achievement.progress + 1, achievement.total);
            }
            break;
          case 'check_in':
            if (achievement.category === 'streaks') {
              newProgress = Math.min(achievement.progress + 1, achievement.total);
            }
            // Also count as visit for other achievements
            if (achievement.category === 'visits') {
              newProgress = Math.min(achievement.progress + 1, achievement.total);
            }
            break;
        }
        
        return {
          ...achievement,
          progress: newProgress
        };
      })
    );
  }, []);

  // Calculate proximity achievements (80%+ completion)
  const getProximityAchievements = useCallback(() => {
    return achievements.filter(achievement => {
      const progressPercentage = achievement.progress / achievement.total;
      return progressPercentage >= 0.8 && progressPercentage < 1;
    });
  }, [achievements]);

  // Get completed achievements
  const getCompletedAchievements = useCallback(() => {
    return achievements.filter(achievement => 
      achievement.progress >= achievement.total
    );
  }, [achievements]);

  // Generate contextual suggestions based on current activity and location
  const getContextualSuggestions = useCallback((userLocation?: { lat: number; lng: number }) => {
    const proximityAchievements = getProximityAchievements();
    
    return proximityAchievements.map(achievement => {
      let suggestion = achievement.suggestion;
      let estimatedTime = achievement.estimatedCompletion;
      
      // Enhance suggestions based on context
      if (achievement.category === 'visits' && userLocation) {
        suggestion = `Visit ${achievement.total - achievement.progress} more establishments nearby to unlock this achievement`;
        estimatedTime = '15-30 minutes';
      } else if (achievement.category === 'mocktails') {
        suggestion = `Try ${achievement.total - achievement.progress} more unique mocktails from the menu`;
        estimatedTime = '20-40 minutes';
      }
      
      return {
        ...achievement,
        suggestion,
        estimatedCompletion: estimatedTime
      };
    });
  }, [getProximityAchievements]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random progress updates (for demo purposes)
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const activityTypes: ActivityEvent['type'][] = ['visit', 'mocktail_ordered', 'review_written', 'check_in'];
        const randomActivity: ActivityEvent = {
          type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
          establishmentId: `est_${Math.floor(Math.random() * 10)}`,
          metadata: { timestamp: new Date().toISOString() }
        };
        
        // Only track if we're not already at max progress
        const hasIncompleteAchievements = achievements.some(a => a.progress < a.total);
        if (hasIncompleteAchievements) {
          console.log('Simulated activity:', randomActivity);
          // Uncomment to enable random progress updates
          // trackActivity(randomActivity);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [achievements, trackActivity]);

  return {
    achievements,
    recentActivity,
    loading,
    trackActivity,
    getProximityAchievements,
    getCompletedAchievements,
    getContextualSuggestions
  };
};
