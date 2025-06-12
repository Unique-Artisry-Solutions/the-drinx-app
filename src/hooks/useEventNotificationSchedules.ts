
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEventNotificationSchedules = (eventId?: string) => {
  return useQuery({
    queryKey: ['event-notification-schedules', eventId],
    queryFn: async () => {
      if (!eventId) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('metadata->>event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!eventId
  });
};
