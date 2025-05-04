
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from '@/types/EventTypes';

export const useEventMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Step 1: Create the event
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
          created_by: user.id
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Step 2: Add ticket types if they exist
      if (eventData.ticketTypes?.length > 0) {
        const { error: ticketError } = await supabase
          .from('event_ticket_types')
          .insert(
            eventData.ticketTypes.map(ticket => ({
              event_id: eventResponse.id,
              ...ticket
            }))
          );

        if (ticketError) {
          console.error('Error creating ticket types:', ticketError);
          // Continue with event creation even if ticket creation fails
        }
      }

      // Step 3: Handle notification schedules if they exist
      if (eventData.notificationSchedules?.length > 0) {
        for (const schedule of eventData.notificationSchedules) {
          try {
            // Store notification data
            const metadata: any = {
              event_id: eventResponse.id,
              scheduled_for: schedule.scheduledFor,
              location_based: !!schedule.locationBased,
              coordinates: schedule.coordinates || null,
              target_radius: schedule.targetRadius || null,
              notification_type: 'event_schedule'
            };
            
            // Attempt to create a notification record but don't fail if this errors
            await supabase
              .from('notifications')
              .insert({
                recipient_id: user.id,
                recipient_type: 'promoter',
                title: schedule.title || `Reminder: ${eventData.name}`,
                content: schedule.content || `Don't forget: ${eventData.name} is happening soon!`,
                priority: schedule.priority || 'medium',
                metadata: metadata
              });
          } catch (notificationError) {
            console.error('Error creating notification schedule:', notificationError);
            // Continue with event creation even if notification creation fails
          }
        }
      }

      return eventResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      console.error('Event creation error:', error);
      toast({
        title: 'Error creating event',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    createEvent
  };
};
