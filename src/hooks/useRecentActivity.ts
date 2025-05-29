
import { useState, useEffect } from 'react';
import { RealtimeActivity } from '@/types/explore';

export const useRecentActivity = () => {
  const [activities, setActivities] = useState<RealtimeActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setActivities([
        {
          id: '1',
          type: 'check-in',
          description: 'Checked in at The Mocktail Lounge',
          timestamp: new Date().toISOString(),
          user: {
            id: 'user1',
            name: 'Sarah Chen',
            avatar: undefined
          },
          location: 'The Mocktail Lounge',
          likes: 12,
          isLiked: false
        },
        {
          id: '2',
          type: 'review',
          description: 'Left a 5-star review for Virgin Mojito',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          user: {
            id: 'user2',
            name: 'Mike Rodriguez',
            avatar: undefined
          },
          likes: 8,
          isLiked: true
        },
        {
          id: '3',
          type: 'recipe',
          description: 'Shared a new mocktail recipe: Sunset Sparkler',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user3',
            name: 'Emma Thompson',
            avatar: undefined
          },
          likes: 15,
          isLiked: false
        }
      ]);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { activities, isLoading };
};
