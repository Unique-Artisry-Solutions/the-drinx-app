
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserVisitAchievement, UserNotification } from '@/types/VisitTypes';
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
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_visit_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });
      
      if (achievementsError) throw achievementsError;
      
      setAchievements(achievementsData || []);
      
      // Get notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (notificationsError) throw notificationsError;
      
      setNotifications(notificationsData || []);
      setUnreadCount((notificationsData || []).filter(n => !n.is_read).length);
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
      const { error } = await supabase
        .from('user_notifications')
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
      const { error } = await supabase
        .from('user_notifications')
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
    
    const notificationsSubscription = supabase
      .channel('public:user_notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          const newNotification = payload.new as UserNotification;
          
          // Add the new notification to the state
          setNotifications(prev => [newNotification, ...prev]);
          
          // Increment unread count
          setUnreadCount(prev => prev + 1);
      })
      .subscribe();
    
    // Initial fetch
    fetchAchievements();
    
    return () => {
      supabase.removeChannel(notificationsSubscription);
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
