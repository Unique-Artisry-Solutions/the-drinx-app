
import { supabase } from '@/lib/supabase';
import { Achievement } from '../types';
import { addPoints } from './operations';
import { RewardsCache } from '../system/RewardsCache';
import { trackRewardEvent } from './tracking';

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
    // Fetch all achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*');
      
    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      return [];
    }
    
    // Fetch user progress for these achievements
    const { data: progress, error: progressError } = await supabase
      .from('user_achievement_progress')
      .select('*')
      .eq('user_id', userId);
      
    if (progressError) {
      console.error('Error fetching user achievement progress:', progressError);
      return [];
    }
    
    // Create a map of progress by achievement ID for quick lookup
    const progressMap = new Map();
    progress?.forEach(p => {
      progressMap.set(p.achievement_id, {
        progress: p.progress,
        isCompleted: p.is_completed
      });
    });
    
    // Combine achievements with user progress
    const userAchievements = achievements?.map(achievement => {
      const userProgress = progressMap.get(achievement.id);
      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        category: achievement.category,
        icon: achievement.icon || 'award',
        pointValue: achievement.points_reward,
        pointsReward: achievement.points_reward,
        threshold: achievement.threshold,
        isCompleted: userProgress?.isCompleted || false,
        progress: userProgress?.progress || 0,
        maxProgress: achievement.threshold
      };
    }) || [];
    
    // Cache the result for 15 minutes
    await RewardsCache.updateCache(cacheKey, 900, userAchievements);
    
    return userAchievements;
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
 * @returns True if activity was recorded successfully
 */
export async function recordActivity(
  userId: string, 
  activityType: string, 
  metadata: Record<string, any> = {}
): Promise<boolean> {
  try {
    // Record the activity
    const { error: activityError } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        metadata
      });
      
    if (activityError) {
      console.error('Error recording activity:', activityError);
      return false;
    }
    
    // Update achievement progress
    const { data: relatedAchievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('activity_type', activityType);
      
    if (achievementsError) {
      console.error('Error fetching related achievements:', achievementsError);
      return true; // Activity was recorded, even if we couldn't check achievements
    }
    
    // Process each related achievement
    for (const achievement of relatedAchievements || []) {
      // Check if user already has this achievement
      const { data: existing, error: existingError } = await supabase
        .from('user_achievement_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id)
        .single();
        
      if (existingError && existingError.code !== 'PGRST116') { // Not found is okay
        console.error('Error checking existing achievement:', existingError);
        continue;
      }
      
      // If already completed, skip
      if (existing?.is_completed) {
        continue;
      }
      
      // Calculate new progress
      const currentProgress = existing?.progress || 0;
      const newProgress = currentProgress + 1;
      const isCompleted = newProgress >= achievement.threshold;
      
      // Update or insert progress
      const progressData = {
        user_id: userId,
        achievement_id: achievement.id,
        progress: newProgress,
        is_completed: isCompleted,
        last_updated: new Date().toISOString()
      };
      
      if (existing) {
        const { error: updateError } = await supabase
          .from('user_achievement_progress')
          .update(progressData)
          .eq('id', existing.id);
          
        if (updateError) {
          console.error('Error updating achievement progress:', updateError);
          continue;
        }
      } else {
        const { error: insertError } = await supabase
          .from('user_achievement_progress')
          .insert(progressData);
          
        if (insertError) {
          console.error('Error inserting achievement progress:', insertError);
          continue;
        }
      }
      
      // If achievement completed, award points
      if (isCompleted) {
        await addPoints(
          userId, 
          achievement.points_reward, 
          'achievement', 
          { achievement_id: achievement.id }
        );
        
        // Track achievement completion
        await trackRewardEvent('achievement_completed', userId, {
          achievement_id: achievement.id,
          achievement_name: achievement.name,
          points_rewarded: achievement.points_reward
        });
      }
    }
    
    // Invalidate achievements cache
    await RewardsCache.invalidate(`user_achievements_${userId}`);
    
    return true;
  } catch (error) {
    console.error('Unexpected error in recordActivity:', error);
    return false;
  }
}
