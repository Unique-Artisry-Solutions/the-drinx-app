
import { supabase } from '@/lib/supabase';
import { Achievement } from '@/types/rewards';
import { addPoints } from './operations';
import { RewardsCache } from '../system/RewardsCache';
import { trackRewardEvent } from './tracking';

// Create a fake achievement for testing until database tables are ready
const dummyAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Visit',
    description: 'Visit your first establishment',
    category: 'visits',
    icon: 'map-pin',
    pointsReward: 50,
    threshold: 1,
    isCompleted: true,
    progress: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Mocktail Explorer',
    description: 'Try 5 different mocktails',
    category: 'mocktails',
    icon: 'glass-water',
    pointsReward: 100,
    threshold: 5,
    isCompleted: false,
    progress: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Review Master',
    description: 'Leave 3 reviews',
    category: 'reviews',
    icon: 'star',
    pointsReward: 75,
    threshold: 3,
    isCompleted: false,
    progress: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * Fetch user achievements with their completion status
 * @param userId - The user ID to fetch achievements for
 * @returns Array of achievements with completion status
 */
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const cacheKey = `user_achievements_${userId}`;
  const cacheStatus = await RewardsCache.getCacheStatus(cacheKey);
  
  if (cacheStatus && !cacheStatus.is_invalidated) {
    console.log('Cache hit for user achievements:', userId);
    const cachedData = cacheStatus.metadata?.cached_data;
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  }
  
  try {
    // Use dummy achievements until database tables are ready
    // Once achievement tables are created, replace this with actual database queries
    
    // Cache the result for 15 minutes
    await RewardsCache.updateCache(cacheKey, 900, dummyAchievements);
    
    return dummyAchievements;
  } catch (error) {
    console.error('Unexpected error in getUserAchievements:', error);
    return [];
  }
}

/**
 * Record a user activity and check for achievement completion
 * @param userId - The user ID performing the activity
 * @param activityType - The type of activity being recorded
 * @param metadata - Additional metadata about the activity
 * @returns Object with completed achievements
 */
export async function recordActivity(
  userId: string, 
  activityType: string, 
  metadata: Record<string, any> = {}
): Promise<{ success: boolean; completedAchievements: Achievement[] }> {
  try {
    // Record the activity
    const { error: activityError } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        event_type: `activity_${activityType}`,
        event_data: metadata
      });
      
    if (activityError) {
      console.error('Error recording activity:', activityError);
      return { success: false, completedAchievements: [] };
    }
    
    // For demonstration purposes, randomly complete an achievement sometimes
    const achievements = await getUserAchievements(userId);
    const completedAchievements: Achievement[] = [];
    
    // Find incomplete achievements that match this activity type
    const relevantAchievements = achievements.filter(a => 
      !a.isCompleted && a.category === activityType && a.progress < a.threshold
    );
    
    for (const achievement of relevantAchievements) {
      // Simulate progress increase
      const newProgress = Math.min(achievement.progress + 1, achievement.threshold);
      const isCompleted = newProgress >= achievement.threshold;
      
      if (isCompleted) {
        // Award points for completed achievement
        await addPoints(
          userId, 
          achievement.pointsReward, 
          'achievement', 
          { achievement_id: achievement.id }
        );
        
        // Track achievement completion
        await trackRewardEvent('achievement_completed', userId, {
          achievement_id: achievement.id,
          achievement_name: achievement.name,
          points_rewarded: achievement.pointsReward
        });
        
        // Add to completed achievements
        completedAchievements.push({
          ...achievement,
          isCompleted: true,
          progress: newProgress
        });
      }
    }
    
    // Invalidate achievements cache
    await RewardsCache.invalidate(`user_achievements_${userId}`);
    
    return { success: true, completedAchievements };
  } catch (error) {
    console.error('Unexpected error in recordActivity:', error);
    return { success: false, completedAchievements: [] };
  }
}
