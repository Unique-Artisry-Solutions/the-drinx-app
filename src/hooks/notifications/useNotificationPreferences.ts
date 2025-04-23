
import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { NotificationPreferences, NotificationMetadata } from '@/types/NotificationTypes';

export const useNotificationPreferences = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences[] | null>(null);
  const { toast } = useToast();

  const fetchPreferences = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data: prefs, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      setPreferences(prefs as NotificationPreferences[]);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  const savePreferences = useCallback(async (
    categoryId: string,
    channels: ('email' | 'push' | 'in_app')[],
    isEnabled: boolean,
    metadata: NotificationMetadata
  ) => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: userId,
          category_id: categoryId,
          channels,
          is_enabled: isEnabled,
          metadata: metadata as any,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
      
      await fetchPreferences();
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast, fetchPreferences]);

  return {
    isLoading,
    preferences,
    fetchPreferences,
    savePreferences
  };
};
