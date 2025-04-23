
import { useEffect } from 'react';
import { useRoleNotifications } from '@/hooks/notifications/useRoleNotifications';
import EnhancedNotificationsList from '@/components/notifications/EnhancedNotificationsList';
import NotificationsHeader from '@/pages/notifications/components/NotificationsHeader';
import NotificationsLayout from '@/components/notifications/NotificationsLayout';
import Layout from '@/components/Layout';

export default function PromoterNotificationsPage() {
  const { notifications, unreadCount, isLoading, error, markAsRead, markAllAsRead, refetch } = useRoleNotifications();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Layout>
      <NotificationsLayout title="Promoter Notifications" showTestPanel={true}>
        <NotificationsHeader 
          unreadCount={unreadCount}
          onMarkAllRead={markAllAsRead}
          onRefresh={refetch}
        />
        
        <div className="mt-6">
          <EnhancedNotificationsList 
            notifications={notifications}
            isLoading={isLoading}
            error={error}
            onMarkAsRead={markAsRead}
          />
        </div>
      </NotificationsLayout>
    </Layout>
  );
}
