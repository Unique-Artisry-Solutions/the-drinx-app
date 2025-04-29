
import { Achievement, AchievementCategory } from './types';

// Define achievement categories
export const achievementCategories: AchievementCategory[] = [
  {
    id: 'visits',
    name: 'Explorer',
    description: 'Achievements for discovering new places',
    icon: 'MapPin'
  },
  {
    id: 'mocktails',
    name: 'Connoisseur',
    description: 'Achievements for trying different mocktails',
    icon: 'GlassWater'
  },
  {
    id: 'social',
    name: 'Social Butterfly',
    description: 'Achievements for social interactions',
    icon: 'Users'
  },
  {
    id: 'creation',
    name: 'Creator',
    description: 'Achievements for creating content',
    icon: 'PenTool'
  },
  {
    id: 'special',
    name: 'Milestone',
    description: 'Special achievements and milestones',
    icon: 'Award'
  }
];

// Define all available achievements
export const availableAchievements: Achievement[] = [
  // Explorer category
  {
    id: 'first-visit',
    name: 'First Steps',
    description: 'Visit your first establishment',
    category: 'visits',
    icon: 'MapPin',
    pointsReward: 50,
    progress: 0,
    threshold: 1,
    isCompleted: false
  },
  {
    id: 'five-visits',
    name: 'Regular Explorer',
    description: 'Visit 5 different establishments',
    category: 'visits',
    icon: 'MapPin',
    pointsReward: 100,
    progress: 0,
    threshold: 5,
    isCompleted: false
  },
  {
    id: 'ten-visits',
    name: 'Urban Adventurer',
    description: 'Visit 10 different establishments',
    category: 'visits',
    icon: 'MapPin',
    pointsReward: 200,
    progress: 0,
    threshold: 10,
    isCompleted: false
  },
  
  // Connoisseur category
  {
    id: 'first-mocktail',
    name: 'First Sip',
    description: 'Try your first mocktail',
    category: 'mocktails',
    icon: 'GlassWater',
    pointsReward: 50,
    progress: 0,
    threshold: 1,
    isCompleted: false
  },
  {
    id: 'mocktail-variety',
    name: 'Variety Seeker',
    description: 'Try 5 different mocktails',
    category: 'mocktails',
    icon: 'GlassWater',
    pointsReward: 100,
    progress: 0,
    threshold: 5,
    isCompleted: false
  },
  {
    id: 'mocktail-enthusiast',
    name: 'Mocktail Enthusiast',
    description: 'Try 15 different mocktails',
    category: 'mocktails',
    icon: 'GlassWater',
    pointsReward: 250,
    progress: 0,
    threshold: 15,
    isCompleted: false
  },
  
  // Social category
  {
    id: 'first-review',
    name: 'First Impressions',
    description: 'Write your first review',
    category: 'social',
    icon: 'MessageSquare',
    pointsReward: 50,
    progress: 0,
    threshold: 1,
    isCompleted: false
  },
  {
    id: 'helpful-reviewer',
    name: 'Helpful Reviewer',
    description: 'Get 5 likes on your reviews',
    category: 'social',
    icon: 'ThumbsUp',
    pointsReward: 100,
    progress: 0,
    threshold: 5,
    isCompleted: false
  },
  {
    id: 'social-sharer',
    name: 'Social Sharer',
    description: 'Share 3 mocktails or establishments on social media',
    category: 'social',
    icon: 'Share2',
    pointsReward: 75,
    progress: 0,
    threshold: 3,
    isCompleted: false
  },
  
  // Creator category
  {
    id: 'first-recipe',
    name: 'Recipe Creator',
    description: 'Create your first mocktail recipe',
    category: 'creation',
    icon: 'PenTool',
    pointsReward: 100,
    progress: 0,
    threshold: 1,
    isCompleted: false
  },
  {
    id: 'recipe-liked',
    name: 'Crowd Pleaser',
    description: 'Have 5 people try your mocktail recipes',
    category: 'creation',
    icon: 'Heart',
    pointsReward: 200,
    progress: 0,
    threshold: 5,
    isCompleted: false
  },
  
  // Special category
  {
    id: 'first-circuit',
    name: 'Circuit Rider',
    description: 'Complete your first Swig Circuit',
    category: 'special',
    icon: 'Route',
    pointsReward: 150,
    progress: 0,
    threshold: 1,
    isCompleted: false
  },
  {
    id: 'seasonal-explorer',
    name: 'Seasonal Explorer',
    description: 'Visit establishments in all four seasons',
    category: 'special',
    icon: 'CalendarDays',
    pointsReward: 300,
    progress: 0,
    threshold: 4,
    isCompleted: false
  },
  {
    id: 'tier2-unlocked',
    name: 'Silver Status',
    description: 'Reach Tier 2 in the rewards program',
    category: 'special',
    icon: 'Award',
    pointsReward: 200,
    progress: 0,
    threshold: 1,
    isCompleted: false
  },
  {
    id: 'tier3-unlocked',
    name: 'Gold Status',
    description: 'Reach Tier 3 in the rewards program',
    category: 'special',
    icon: 'Award',
    pointsReward: 500,
    progress: 0,
    threshold: 1,
    isCompleted: false
  }
];

// Function to check and update achievements based on user activity
export async function updateAchievementProgress(
  userId: string, 
  achievementId: string, 
  incrementValue: number = 1,
  metadata?: Record<string, any>
): Promise<{ 
  updated: boolean; 
  completed: boolean;
  achievement?: Achievement;
}> {
  try {
    // This would call the Supabase function to update achievement progress
    // For now, we'll simulate the update
    
    // In a real implementation, this would update the database
    // and return the updated achievement
    const achievement = availableAchievements.find(a => a.id === achievementId);
    
    if (!achievement) {
      return { updated: false, completed: false };
    }
    
    // Simulate an achievement being completed
    const wasCompleted = achievement.isCompleted;
    achievement.progress += incrementValue;
    
    if (achievement.progress >= achievement.threshold && !wasCompleted) {
      achievement.isCompleted = true;
      achievement.completedAt = new Date().toISOString();
      
      return { 
        updated: true, 
        completed: true,
        achievement
      };
    }
    
    return { 
      updated: true, 
      completed: false,
      achievement
    };
  } catch (error) {
    console.error("Error updating achievement progress:", error);
    return { updated: false, completed: false };
  }
}

// Helper function to get achievements for a user
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  try {
    // In a real implementation, this would fetch from the database
    // For now, return the sample achievements with random progress
    return availableAchievements.map(achievement => {
      // Create a copy so we don't modify the original
      const userAchievement = { ...achievement };
      
      // Simulate some random progress for demo purposes
      const randomProgress = Math.floor(Math.random() * (achievement.threshold + 1));
      userAchievement.progress = randomProgress;
      
      if (randomProgress >= achievement.threshold) {
        userAchievement.isCompleted = true;
        userAchievement.completedAt = new Date().toISOString();
      }
      
      return userAchievement;
    });
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    return [];
  }
}

// Get achievements by category
export function getAchievementsByCategory(achievements: Achievement[]): Record<string, Achievement[]> {
  return achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);
}
