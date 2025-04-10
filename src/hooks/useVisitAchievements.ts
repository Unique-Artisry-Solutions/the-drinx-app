
import { useState, useEffect } from 'react';
import { fromTable } from '@/lib/supabaseClient';
import { UserVisitAchievement, UserNotification } from '@/types/VisitTypes';
import { 
  UserVisitAchievementTable,
  UserNotificationTable
} from '@/types/SupabaseTables';
import { useAuth } from '@/contexts/auth';

export const useVisitAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<UserVisitAchievement[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get achievements
      const { data: achievementsData, error: achievementsError } = await fromTable('user_visit_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });
      
      if (achievementsError) throw achievementsError;
      
      setAchievements(achievementsData as UserVisitAchievement[]);
      
      // Get notifications
      const { data: notificationsData, error: notificationsError } = await fromTable('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (notificationsError) throw notificationsError;
      
      setNotifications(notificationsData as UserNotification[]);
      setUnreadCount((notificationsData || []).filter((n: UserNotificationTable) => !n.is_read).length);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching achievements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await fromTable('user_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user?.id) return;
    
    try {
      const { error } = await fromTable('user_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Subscribe to real-time updates for notifications
  useEffect(() => {
    if (!user?.id) return;
    
    // Initial fetch
    fetchAchievements();
    
    // We'll just use the initial fetch for now and not set up the subscription
    // as it requires additional setup in Supabase

    return () => {
      // Cleanup would go here if we were using subscriptions
    };
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
