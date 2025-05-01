
import { supabase } from '@/lib/supabase';
import { Achievement, AchievementProgressEvent, AchievementCategory } from './types';
import { rewardsApi } from './api';

// Define achievement categories
export const achievementCategories: AchievementCategory[] = [
  {
    id: 'visits',
    name: 'Visits',
    description: 'Achievements for visiting establishments',
    icon: 'map-pin'
  },
  {
    id: 'mocktails',
    name: 'Mocktails',
    description: 'Achievements for trying mocktails',
    icon: 'glass-water'
  },
  {
    id: 'engagement',
    name: 'Engagement',
    description: 'Achievements for engaging with the community',
    icon: 'users'
  },
  {
    id: 'creation',
    name: 'Creation',
    description: 'Achievements for creating content',
    icon: 'pen-tool'
  },
  {
    id: 'circuits',
    name: 'Circuits',
    description: 'Achievements for exploring mocktail circuits',
    icon: 'route'
  }
];

// This file would contain the actual achievement tracking logic
// This is a simplified version for demonstration

// Mock achievement data - in production this would come from a database
const achievementDefinitions: Record<string, Omit<Achievement, 'progress' | 'isCompleted' | 'completedAt'>> = {
  'first-visit': {
    id: 'first-visit',
    name: 'First Visit',
    description: 'Visit your first establishment',
    category: 'visits',
    icon: 'MapPin',
    pointsReward: 50,
    threshold: 1
  },
  'five-visits': {
    id: 'five-visits',
    name: 'Regular Visitor',
    description: 'Visit 5 different establishments',
    category: 'visits',
    icon: 'map',
    pointsReward: 100,
    threshold: 5
  },
  'ten-visits': {
    id: 'ten-visits',
    name: 'Explorer',
    description: 'Visit 10 different establishments',
    category: 'visits',
    icon: 'compass',
    pointsReward: 200,
    threshold: 10
  },
  'first-mocktail': {
    id: 'first-mocktail',
    name: 'First Taste',
    description: 'Try your first mocktail',
    category: 'mocktails',
    icon: 'glass-water',
    pointsReward: 50,
    threshold: 1
  },
  'mocktail-variety': {
    id: 'mocktail-variety',
    name: 'Variety Seeker',
    description: 'Try 5 different mocktails',
    category: 'mocktails',
    icon: 'wine-glass',
    pointsReward: 150,
    threshold: 5
  },
  'mocktail-enthusiast': {
    id: 'mocktail-enthusiast',
    name: 'Mocktail Enthusiast',
    description: 'Try 20 different mocktails',
    category: 'mocktails',
    icon: 'cocktail-glass',
    pointsReward: 300,
    threshold: 20
  },
  'first-review': {
    id: 'first-review',
    name: 'First Review',
    description: 'Leave your first review',
    category: 'engagement',
    icon: 'edit-3',
    pointsReward: 30,
    threshold: 1
  },
  'helpful-reviewer': {
    id: 'helpful-reviewer',
    name: 'Helpful Reviewer',
    description: 'Leave 10 reviews',
    category: 'engagement',
    icon: 'thumbs-up',
    pointsReward: 200,
    threshold: 10
  },
  'social-sharer': {
    id: 'social-sharer',
    name: 'Social Butterfly',
    description: 'Share 5 times on social media',
    category: 'engagement',
    icon: 'share-2',
    pointsReward: 100,
    threshold: 5
  },
  'first-recipe': {
    id: 'first-recipe',
    name: 'Recipe Creator',
    description: 'Create your first mocktail recipe',
    category: 'creation',
    icon: 'file-text',
    pointsReward: 75,
    threshold: 1
  },
  'recipe-liked': {
    id: 'recipe-liked',
    name: 'Popular Creator',
    description: 'Have 5 users like your recipes',
    category: 'creation',
    icon: 'thumbs-up',
    pointsReward: 150,
    threshold: 5
  },
  'first-circuit': {
    id: 'first-circuit',
    name: 'Circuit Rider',
    description: 'Complete your first mocktail circuit',
    category: 'circuits',
    icon: 'map',
    pointsReward: 200,
    threshold: 1
  }
};

export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  try {
    // Get progress from database
    const { data: achievementData, error } = await supabase
      .from('user_activity_streaks') // Use existing table instead of non-existent one
      .select('*')
      .eq('user_id', userId)
      .eq('streak_type', 'visit');

    if (error) {
      console.error('Error fetching user achievements:', error);
      // Return a default set for demo purposes
      return Object.values(achievementDefinitions).map(def => ({
        ...def,
        progress: 0,
        isCompleted: false
      }));
    }

    // Convert database achievements to our format
    // In a real implementation, we'd match achievement_type to our definitions
    const userAchievementMap = new Map<string, number>();
    const completedAchievements = new Set<string>();
    
    achievementData?.forEach(achievement => {
      const type = achievement.streak_type;
      userAchievementMap.set(type, (userAchievementMap.get(type) || 0) + 1);
      
      // Fix: Compare achievement's current_count with achievement definition's threshold
      // instead of trying to access threshold on the database record
      const achievementDef = achievementDefinitions[type];
      if (achievementDef && achievement.current_count >= achievementDef.threshold) {
        completedAchievements.add(type);
      }
    });

    // Return achievements with progress
    return Object.values(achievementDefinitions).map(def => {
      const progress = userAchievementMap.get(def.id) || 0;
      const isCompleted = completedAchievements.has(def.id);
      
      return {
        ...def,
        progress,
        isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : undefined
      };
    });
  } catch (error) {
    console.error('Exception in getUserAchievements:', error);
    // Return a default set for demo purposes
    return Object.values(achievementDefinitions).map(def => ({
      ...def,
      progress: 0,
      isCompleted: false
    }));
  }
}

// Helper function to group achievements by category
export function getAchievementsByCategory(achievements: Achievement[]): Record<string, Achievement[]> {
  return achievements.reduce<Record<string, Achievement[]>>((acc, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {});
}

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
  // Get the achievement definition
  const achievementDef = achievementDefinitions[achievementId];
  if (!achievementDef) {
    console.error(`Achievement with ID ${achievementId} not found`);
    return { updated: false, completed: false };
  }

  try {
    // This is a simplified example - in a real app, you'd:
    // 1. Check the current progress from the database
    // 2. Update the progress in the database
    // 3. Check if the achievement is newly completed
    // 4. If newly completed, award points and create a notification
    
    // For demo purposes, we'll simulate this process
    
    // Start by getting all the user's achievements
    const userAchievements = await getUserAchievements(userId);
    const existingAchievement = userAchievements.find(a => a.id === achievementId);
    
    if (!existingAchievement) {
      return { updated: false, completed: false };
    }
    
    // Calculate new progress
    const newProgress = existingAchievement.progress + incrementValue;
    const wasCompleted = existingAchievement.isCompleted;
    const isCompleted = newProgress >= achievementDef.threshold;
    
    // If newly completed, award points
    if (isCompleted && !wasCompleted) {
      // In a real implementation, we'd update the database to mark as completed
      
      // Award points
      if (achievementDef.pointsReward > 0) {
        await rewardsApi.addPoints(
          userId, 
          achievementDef.pointsReward, 
          'achievement', 
          {
            achievement_id: achievementId,
            achievement_name: achievementDef.name
          }
        );
      }
      
      // Create a new user achievement record (simplified example)
      if (achievementId.includes('visit')) {
        await supabase.from('user_visit_achievements').insert({
          user_id: userId,
          achievement_type: achievementId,
          earned_at: new Date().toISOString(),
          is_displayed: true,
          achievement_data: metadata || {}
        });
      }
    }
    
    // Return the updated achievement
    const updatedAchievement: Achievement = {
      ...achievementDef,
      progress: newProgress,
      isCompleted: isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : undefined
    };
    
    return {
      updated: true,
      completed: isCompleted && !wasCompleted,
      achievement: updatedAchievement
    };
  } catch (error) {
    console.error('Exception in updateAchievementProgress:', error);
    return { updated: false, completed: false };
  }
}
