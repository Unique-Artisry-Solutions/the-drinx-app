
import { useEffect } from 'react';
import { useRoleNotifications } from '@/hooks/notifications/useRoleNotifications';
import NotificationsList from '@/pages/notifications/components/NotificationsList';
import NotificationsHeader from '@/pages/notifications/components/NotificationsHeader';
import NotificationsLayout from '@/components/notifications/NotificationsLayout';
import Layout from '@/components/Layout';

export default function PromoterNotificationsPage() {
  const { notifications, unreadCount, isLoading, error, markAllAsRead, refetch } = useRoleNotifications();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Layout>
      <NotificationsLayout title="Promoter Notifications">
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
      </NotificationsLayout>
    </Layout>
  );
}
