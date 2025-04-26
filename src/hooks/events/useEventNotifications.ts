
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { eventNotificationSchedules } from '@/lib/typedSupabase';

export const useEventNotifications = () => {
  const { toast } = useToast();

  const scheduleEventNotifications = useMutation({
    mutationFn: async ({ 
      eventId, 
      notifications 
    }: { 
      eventId: string, 
      notifications: Array<{
        title: string;
        content: string;
        priority: 'low' | 'medium' | 'high' | 'urgent';
        scheduledFor: string;
        locationBased?: boolean;
        coordinates?: { latitude: number; longitude: number };
        targetRadius?: number;
      }> 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: event } = await supabase
        .from('events')
        .select('created_by')
        .eq('id', eventId)
        .single();
      
      if (!event) throw new Error('Event not found');
      if (event.created_by !== user.id) throw new Error('You do not have permission to schedule notifications for this event');
      
      // First save to event_notification_schedules for location-based targeting
      for (const notification of notifications) {
        if (notification.locationBased && notification.coordinates) {
          const { error } = await eventNotificationSchedules()
            .insert({
              event_id: eventId,
              title: notification.title,
              content: notification.content,
              priority: notification.priority,
              scheduled_for: notification.scheduledFor,
              location_based: true,
              coordinates: notification.coordinates,
              target_radius: notification.targetRadius || 10000 // Default 10km radius
            });
          
          if (error) throw error;
        }
      }
      
      // Then create immediate notifications without location targeting
      for (const notification of notifications) {
        const { error } = await supabase
          .from('notifications')
          .insert({
            recipient_id: user.id,
            recipient_type: 'promoter',
            title: notification.title,
            content: notification.content,
            priority: notification.priority,
            metadata: {
              event_id: eventId,
              scheduled_for: notification.scheduledFor,
              location_based: !!notification.locationBased,
              coordinates: notification.coordinates || null,
              target_radius: notification.targetRadius || null,
              notification_type: 'event_schedule'
            }
          });
        
        if (error) throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: 'Notifications scheduled',
        description: 'Event notifications have been scheduled successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error scheduling notifications',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    scheduleEventNotifications
  };
};
