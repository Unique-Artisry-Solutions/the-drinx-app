import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { NotificationPreferences, NotificationMetadata } from '@/types/notification';

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

      // Convert the database results to match our expected type
      const typedPreferences = prefs.map(pref => {
        // Ensure metadata is cast to NotificationMetadata with proper defaults
        const metadata = pref.metadata as unknown as NotificationMetadata || {
          priority: 'medium',
          sound: true,
          vibration: true,
          timeWindowEnabled: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00'
        };
        
        return {
          ...pref,
          metadata
        } as NotificationPreferences;
      });

      setPreferences(typedPreferences);
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
      // First check if this preference exists
      const { data: existingPref, error: checkError } = await supabase
        .from('notification_preferences')
        .select('id')
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          id: existingPref?.id,
          user_id: userId,
          category_id: categoryId,
          channels,
          is_enabled: isEnabled,
          metadata: metadata as any,
          updated_at: new Date().toISOString(),
          created_at: existingPref ? undefined : new Date().toISOString()
        });

      if (error) throw error;
      
      // Update local state without refetching
      setPreferences(prev => {
        if (!prev) return prev;
        
        const updatedPrefs = [...prev];
        const index = updatedPrefs.findIndex(p => p.category_id === categoryId);
        
        if (index >= 0) {
          // Update existing preference
          updatedPrefs[index] = {
            ...updatedPrefs[index],
            channels,
            is_enabled: isEnabled,
            metadata
          };
        } else {
          // Add new preference
          updatedPrefs.push({
            id: existingPref?.id || crypto.randomUUID(),
            user_id: userId,
            category_id: categoryId,
            channels,
            is_enabled: isEnabled,
            metadata,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        
        return updatedPrefs;
      });
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
  }, [userId, toast]);

  return {
    isLoading,
    preferences,
    fetchPreferences,
    savePreferences
  };
};
