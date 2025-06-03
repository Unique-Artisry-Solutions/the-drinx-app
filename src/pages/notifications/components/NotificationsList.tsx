
import { Notification } from '@/types/notification';
import UnifiedNotificationsList from '@/components/notifications/UnifiedNotificationsList';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationsListProps {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

export default function NotificationsList({ 
  notifications, 
  isLoading, 
  error 
}: NotificationsListProps) {
  const { markAsRead } = useNotifications();

  return (
    <UnifiedNotificationsList
      notifications={notifications}
      isLoading={isLoading}
      error={error}
      onMarkAsRead={markAsRead}
    />
  );
}
