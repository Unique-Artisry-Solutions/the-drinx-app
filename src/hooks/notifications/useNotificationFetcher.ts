
import { useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { debouncedToast } from '@/utils/debouncedToast';
import { Notification } from '@/types/NotificationTypes';

interface FetcherOptions {
  userId: string | undefined;
  accessToken: string | undefined;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useNotificationFetcher({
  userId,
  accessToken,
  setNotifications,
  setUnreadCount,
  setIsLoading,
  setError
}: FetcherOptions) {
  const fetchingRef = useRef(false);

  const fetchNotifications = useCallback(async () => {
    if (fetchingRef.current || !userId || !accessToken) {
      setIsLoading(false);
      if (!userId || !accessToken) setError("Please log in to view notifications");
      return;
    }
    fetchingRef.current = true;
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        setIsLoading(true);
        setError(null);
        const { data, error } = await supabase.functions.invoke('notifications', {
          body: {
            action: 'getNotifications',
            params: { userId }
          }
        });
        if (error) throw new Error(error.message || 'Failed to fetch notifications');
        const notificationsArray = Array.isArray(data?.data) ? data.data : [];
        setNotifications(notificationsArray);
        setUnreadCount(notificationsArray.filter((n: Notification) => !n.is_read).length);
        fetchingRef.current = false;
        setIsLoading(false);
        return;
      } catch (error: any) {
        attempt++;
        if (attempt === maxRetries) {
          debouncedToast.error(
            "Notification Error",
            "Unable to fetch notifications. Will retry automatically."
          );
          setError(error.message || 'Failed to fetch notifications');
          setIsLoading(false);
          fetchingRef.current = false;
        }
        await new Promise(res => setTimeout(res, Math.min(1000 * Math.pow(2, attempt), 5000)));
      }
    }
  }, [userId, accessToken, setNotifications, setUnreadCount, setError, setIsLoading]);

  return { fetchNotifications };
}

