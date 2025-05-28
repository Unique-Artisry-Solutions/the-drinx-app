
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RealtimeActivity {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement' | 'bar-crawl' | 'photo-share';
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  location?: string;
  imageUrl?: string;
  likes: number;
  isLiked: boolean;
  metadata?: Record<string, any>;
}

export const useRealtimeActivity = () => {
  const [activities, setActivities] = useState<RealtimeActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load of activities
    const loadActivities = async () => {
      // Mock real-time activities with enhanced data
      const mockActivities: RealtimeActivity[] = [
        {
          id: '1',
          type: 'photo-share',
          title: 'Sarah shared a photo',
          description: 'Amazing virgin mojito at The Sober Bar!',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          user: { id: 'user1', name: 'Sarah J.', avatar: '/api/placeholder/32/32' },
          location: 'The Sober Bar',
          imageUrl: '/api/placeholder/200/150',
          likes: 12,
          isLiked: false,
          metadata: { establishment_id: 'est1' }
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Mike unlocked an achievement',
          description: 'Streak Master - 7 days in a row!',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          user: { id: 'user2', name: 'Mike R.', avatar: '/api/placeholder/32/32' },
          likes: 8,
          isLiked: true,
          metadata: { achievement_type: 'streak', days: 7 }
        },
        {
          id: '3',
          type: 'bar-crawl',
          title: 'Emma completed a bar crawl',
          description: 'Downtown Mocktail Adventure - 5 stops completed!',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          user: { id: 'user3', name: 'Emma T.', avatar: '/api/placeholder/32/32' },
          location: 'Downtown District',
          likes: 15,
          isLiked: false,
          metadata: { crawl_id: 'crawl1', stops: 5 }
        },
        {
          id: '4',
          type: 'recipe',
          title: 'James created a new recipe',
          description: 'Tropical Sunset Mocktail - refreshing and colorful!',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          user: { id: 'user4', name: 'James W.', avatar: '/api/placeholder/32/32' },
          imageUrl: '/api/placeholder/200/150',
          likes: 23,
          isLiked: true,
          metadata: { recipe_id: 'recipe1', difficulty: 'easy' }
        }
      ];
      
      setActivities(mockActivities);
      setIsLoading(false);
    };

    loadActivities();

    // Set up real-time subscription for activity updates
    const channel = supabase
      .channel('activity-feed')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_activities'
      }, (payload) => {
        // Add new activity to the feed
        const newActivity = payload.new as any;
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep latest 10
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const likeActivity = async (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { 
              ...activity, 
              isLiked: !activity.isLiked,
              likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1
            }
          : activity
      )
    );
    
    // Track analytics
    console.log('Activity liked:', activityId);
  };

  const shareActivity = async (activityId: string) => {
    // Share activity logic
    console.log('Activity shared:', activityId);
  };

  return {
    activities,
    isLoading,
    likeActivity,
    shareActivity
  };
};
