
import { useNotifications } from '../useNotifications';
import { useAuth } from '@/contexts/auth';
import { useMemo } from 'react';
import { Notification } from '@/types/notification';

export const useRoleNotifications = () => {
  const { user } = useAuth();
  const {
    notifications: allNotifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch
  } = useNotifications();

  // Filter notifications based on user role
  const notifications = useMemo(() => {
    if (!user || !allNotifications) return [];
    
    // For promoters, filter to relevant notification types
    const roleRelevantTypes = [
      'promoter',
      'event_schedule',
      'system',
      'admin',
      'follower',
      'campaign'
    ];

    return allNotifications.filter((notification: Notification) => {
      const notificationType = notification.metadata?.type;
      return !notificationType || roleRelevantTypes.includes(notificationType);
    });
  }, [allNotifications, user]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch
  };
};
