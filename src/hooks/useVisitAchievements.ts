import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { rewardsApi } from '@/lib/rewards/api';
import type { Achievement } from '@/types/rewards';

export const useVisitAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const userAchievements = await rewardsApi.getUserAchievements(user.id);
      setAchievements(userAchievements);
      // TODO: Hook up real notifications when API is available
      setNotifications([]);
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message || 'Failed to load achievements');
      console.error('Error fetching achievements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    // Placeholder - wire to API when available
    console.log('markNotificationAsRead:', notificationId);
  };

  const markAllNotificationsAsRead = async () => {
    // Placeholder - wire to API when available
    console.log('markAllNotificationsAsRead called');
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchAchievements();
  }, [user?.id]);

  return {
    achievements,
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchAchievements,
    markNotificationAsRead,
    markAllNotificationsAsRead
  };
};
