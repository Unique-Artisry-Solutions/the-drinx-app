
import { useNotifications } from './useNotifications';

// Compatibility bridge for useDirectNotifications
export const useDirectNotifications = () => {
  const notifications = useNotifications();
  
  return {
    sendNotification: notifications.addNotification,
    notifications: notifications.notifications,
    clearNotifications: notifications.clearAll
  };
};
