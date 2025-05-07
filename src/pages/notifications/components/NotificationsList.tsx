
import { Notification } from '@/types/notification';
import NotificationItem from '@/components/notifications/NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading notifications</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No notifications to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={markAsRead}
        />
      ))}
    </div>
  );
}
