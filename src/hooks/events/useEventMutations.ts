
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from '@/types/EventTypes';

export const useEventMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      // Check for admin bypass first
      const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
      let userId = null;
      
      if (isAdminBypass) {
        userId = localStorage.getItem('bypass_user_id');
        if (!userId) {
          throw new Error('Bypass user ID not found');
        }
        console.log('Using bypass user ID for event creation:', userId);
      } else {
        // Regular Supabase auth flow
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        userId = user.id;
      }

      const { data: eventResponse, error: eventError } = await supabase
        .from('events')
        .insert({
          name: eventData.name,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          venue_id: eventData.venueId || null,
          image_url: eventData.imageUrl,
          promotional_materials: eventData.promotionalMaterials,
          created_by: userId
        })
        .select()
        .single();

      if (eventError) throw eventError;

      if (eventData.ticketTypes.length > 0) {
        const { error: ticketError } = await supabase
          .from('event_ticket_types')
          .insert(
            eventData.ticketTypes.map(ticket => ({
              event_id: eventResponse.id,
              ...ticket
            }))
          );

        if (ticketError) throw ticketError;
      }

      if (eventData.notificationSchedules && eventData.notificationSchedules.length > 0) {
        for (const schedule of eventData.notificationSchedules) {
          // Store all notification data in the notifications table
          const metadata: any = {
            event_id: eventResponse.id,
            scheduled_for: schedule.scheduledFor,
            location_based: !!schedule.locationBased,
            coordinates: schedule.coordinates || null,
            target_radius: schedule.targetRadius || null,
            notification_type: 'event_schedule'
          };
          
          // Create a notification record
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              recipient_id: userId,
              recipient_type: 'promoter',
              title: schedule.title || `Reminder: ${eventData.name}`,
              content: schedule.content || `Don't forget: ${eventData.name} is happening soon!`,
              priority: schedule.priority || 'medium',
              metadata: metadata
            });

          if (notificationError) throw notificationError;
        }
      }

      return eventResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event created',
        description: 'Your event has been created successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    createEvent
  };
};
