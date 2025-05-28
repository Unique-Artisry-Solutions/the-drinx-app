import { Achievement } from '@/types/rewards';

// Mock implementation for achievements API
export const rewardsApi = {
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    // Mock implementation - replace with actual API call
    console.log(`Fetching achievements for user ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // Simulate progress and completion based on user ID
    const userAchievements = mockAchievements.map(achievement => {
      const progress = Math.floor(Math.random() * achievement.threshold);
      const isCompleted = progress >= achievement.threshold - 1;
      
      return {
        ...achievement,
        progress: isCompleted ? achievement.threshold : progress,
        isCompleted: isCompleted,
        unlockedAt: isCompleted ? new Date().toISOString() : undefined
      };
    });
    
    return userAchievements;
  },
  
  async recordActivity(userId: string, activityType: ActivityType, metadata?: Record<string, any>): Promise<{ success: boolean; completedAchievements: Achievement[] }> {
    console.log(`Recording activity ${activityType} for user ${userId} with metadata:`, metadata);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // Get current achievements
    const currentAchievements = await this.getUserAchievements(userId);
    
    // Update achievement progress
    const { updatedAchievements, completedAchievements } = updateAchievementProgress(currentAchievements, activityType, metadata);
    
    // For now, just return the completed achievements
    return {
      success: true,
      completedAchievements: completedAchievements
    };
  },
  
  async setUserPreference(userId: string, key: string, value: any): Promise<void> {
    // Mock implementation - replace with actual API call
    console.log(`Setting preference ${key} for user ${userId}:`, value);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
  },

  async getUserPreference(userId: string, key: string) {
    // Mock implementation
    return null;
  }
};

// Define possible activity types
type ActivityType = 'visit' | 'mocktail' | 'review' | 'share' | 'recipe' | 'circuit';

// Mock achievement data with proper structure
const mockAchievements: Achievement[] = [
  {
    id: 'first-visit',
    name: 'First Steps',
    description: 'Visit your first establishment',
    points: 50,
    pointsReward: 50,
    icon: 'MapPin',
    category: 'visits',
    progress: 0,
    threshold: 1,
    isCompleted: false
  },
  {
    id: 'regular-visitor',
    name: 'Regular Visitor',
    description: 'Visit 5 different establishments',
    points: 100,
    pointsReward: 100,
    icon: 'Award',
    category: 'visits',
    progress: 0,
    threshold: 5,
    isCompleted: false
  },
  {
    id: 'first-mocktail',
    name: 'Mocktail Explorer',
    description: 'Try your first mocktail',
    points: 25,
    pointsReward: 25,
    icon: 'GlassWater',
    category: 'mocktails',
    progress: 0,
    threshold: 1,
    isCompleted: false
  }
];

const updateAchievementProgress = (achievements: Achievement[], activityType: ActivityType, metadata?: Record<string, any>): { updatedAchievements: Achievement[], completedAchievements: Achievement[] } => {
  const updatedAchievements = [...achievements];
  const completedAchievements: Achievement[] = [];
  
  updatedAchievements.forEach(achievement => {
    if (achievement.isCompleted) return;
    
    let shouldIncrement = false;
    
    // Check if this activity should increment this achievement
    switch (achievement.id) {
      case 'first-visit':
      case 'regular-visitor':
        shouldIncrement = activityType === 'visit';
        break;
      case 'first-mocktail':
        shouldIncrement = activityType === 'mocktail';
        break;
      // Add more achievement logic here
    }
    
    if (shouldIncrement) {
      achievement.progress = Math.min(achievement.progress + 1, achievement.threshold);
      
      if (achievement.progress >= achievement.threshold && !achievement.isCompleted) {
        achievement.isCompleted = true;
        achievement.unlockedAt = new Date().toISOString();
        completedAchievements.push(achievement);
      }
    }
  });
  
  return { updatedAchievements, completedAchievements };
};
