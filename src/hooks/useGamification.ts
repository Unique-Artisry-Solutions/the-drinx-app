
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: string;
  unlocked_at?: string;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  achievements: Achievement[];
  currentStreak: number;
  weeklyProgress: number;
}

export function useGamification(userId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user achievements
  const { data: achievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ['user-achievements', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Use proper Supabase select instead of .raw()
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('source', 'achievement');

      if (error) {
        console.error('Error fetching achievements:', error);
        return [];
      }

      // Transform the data to match Achievement interface
      return (data || []).map(transaction => ({
        id: transaction.id,
        title: transaction.description || 'Achievement',
        description: transaction.description || '',
        points: transaction.points || 0,
        icon: 'trophy',
        category: transaction.metadata?.category || 'general',
        unlocked_at: transaction.created_at
      }));
    },
    enabled: !!userId
  });

  // Get user stats using proper Supabase queries
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Get total points from user_rewards table
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('user_rewards')
        .select('points, lifetime_points')
        .eq('user_id', userId)
        .single();

      if (rewardsError) {
        console.error('Error fetching user rewards:', rewardsError);
      }

      // Get streak data
      const { data: streakData, error: streakError } = await supabase
        .from('user_activity_streaks')
        .select('current_count, longest_count')
        .eq('user_id', userId)
        .order('current_count', { ascending: false })
        .limit(1)
        .single();

      if (streakError) {
        console.error('Error fetching streak data:', streakError);
      }

      const totalPoints = rewardsData?.lifetime_points || 0;
      const currentStreak = streakData?.current_count || 0;
      
      return {
        totalPoints,
        level: Math.floor(totalPoints / 100) + 1,
        achievements: achievements,
        currentStreak,
        weeklyProgress: Math.min(100, (currentStreak * 14.3)) // Simple calculation
      };
    },
    enabled: !!userId
  });

  // Award achievement mutation
  const awardAchievement = useMutation({
    mutationFn: async ({ userId: targetUserId, achievementType, points }: { 
      userId: string; 
      achievementType: string; 
      points: number;
    }) => {
      const { data, error } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: targetUserId,
          points,
          transaction_type: 'earn',
          source: 'achievement',
          description: `Achievement: ${achievementType}`,
          metadata: { category: achievementType }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: "Achievement Unlocked!",
        description: "You've earned a new achievement!",
      });
    },
    onError: (error) => {
      console.error('Award achievement error:', error);
      toast({
        title: "Error",
        description: "Failed to award achievement",
        variant: "destructive"
      });
    }
  });

  // Update user progress mutation
  const updateProgress = useMutation({
    mutationFn: async ({ userId: targetUserId, points, activity }: { 
      userId: string; 
      points: number; 
      activity: string;
    }) => {
      const { data, error } = await supabase
        .from('reward_transactions')
        .insert({
          user_id: targetUserId,
          points,
          transaction_type: 'earn',
          source: activity,
          description: `Points earned from ${activity}`
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
    onError: (error) => {
      console.error('Update progress error:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
    }
  });

  return {
    achievements,
    userStats,
    isLoading: achievementsLoading || statsLoading,
    awardAchievement,
    updateProgress
  };
}
