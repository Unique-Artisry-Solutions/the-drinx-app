
import { useAuth } from '@/contexts/auth';
import { useNotifications } from '../useNotifications';
import { Notification } from '@/types/NotificationTypes';

export const useRoleNotifications = () => {
  const { user } = useAuth();
  const { notifications, ...notificationUtils } = useNotifications();

  const filterNotificationsByRole = (notifications: Notification[]) => {
    const userType = localStorage.getItem('user_type');

    switch (userType) {
      case 'establishment':
        return notifications.filter(notification => 
          notification.metadata?.type === 'establishment' ||
          notification.metadata?.type === 'bar_crawl' ||
          notification.metadata?.type === 'mocktail_suggestion'
        );
      case 'promoter':
        return notifications.filter(notification => 
          notification.metadata?.type === 'promoter' ||
          notification.metadata?.type === 'bar_crawl' ||
          notification.metadata?.type === 'venue_message'
        );
      case 'admin':
        return notifications.filter(notification => 
          notification.metadata?.type === 'admin' ||
          notification.metadata?.type === 'moderation' ||
          notification.metadata?.type === 'system'
        );
      default:
        return notifications.filter(notification => 
          !notification.metadata?.type || 
          notification.metadata.type === 'user'
        );
    }
  };

  const filteredNotifications = filterNotificationsByRole(notifications);

  return {
    ...notificationUtils,
    notifications: filteredNotifications,
  };
};
