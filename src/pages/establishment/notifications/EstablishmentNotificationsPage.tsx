
import { useEffect } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationsList from '@/pages/notifications/components/NotificationsList';
import NotificationsHeader from '@/pages/notifications/components/NotificationsHeader';

export default function EstablishmentNotificationsPage() {
  const { notifications, unreadCount, isLoading, error, markAllAsRead, refetch } = useNotifications();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <NotificationsHeader 
        unreadCount={unreadCount}
        onMarkAllRead={markAllAsRead}
        onRefresh={refetch}
      />
      
      <div className="mt-6">
        <NotificationsList 
          notifications={notifications}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
