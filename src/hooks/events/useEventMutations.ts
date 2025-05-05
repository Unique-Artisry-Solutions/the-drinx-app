
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

  const updateEvent = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      if (!eventData.id) throw new Error('Event ID is required for updates');
      
      // Step 1: Update the event
      const { error: eventError } = await supabase
        .from('events')
        .update({
          name: eventData.name,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          venue_id: eventData.venueId || null,
          image_url: eventData.imageUrl,
          promotional_materials: eventData.promotionalMaterials,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventData.id);

      if (eventError) throw eventError;

      // Step 2: Update ticket types - delete existing and insert new ones
      // First remove all existing ticket types
      const { error: deleteTicketsError } = await supabase
        .from('event_ticket_types')
        .delete()
        .eq('event_id', eventData.id);

      if (deleteTicketsError) {
        console.error('Error deleting existing ticket types:', deleteTicketsError);
      }

      // Then insert the new tickets
      if (eventData.ticketTypes?.length > 0) {
        const { error: ticketError } = await supabase
          .from('event_ticket_types')
          .insert(
            eventData.ticketTypes.map(ticket => ({
              event_id: eventData.id,
              name: ticket.name,
              description: ticket.description,
              price: ticket.price,
              quantity: ticket.quantity
            }))
          );

        if (ticketError) {
          console.error('Error updating ticket types:', ticketError);
        }
      }

      // Step 3: Handle notification schedules
      // First delete existing notification schedules
      const { error: deleteNotificationsError } = await supabase
        .from('event_notification_schedules')
        .delete()
        .eq('event_id', eventData.id);

      if (deleteNotificationsError) {
        console.error('Error deleting existing notification schedules:', deleteNotificationsError);
      }

      // Then insert new notification schedules
      if (eventData.notificationSchedules?.length > 0) {
        for (const schedule of eventData.notificationSchedules) {
          // Filter out schedule ID for database insert
          const { id, ...scheduleData } = schedule;
          
          const { error: scheduleError } = await supabase
            .from('event_notification_schedules')
            .insert({
              event_id: eventData.id,
              title: scheduleData.title,
              content: scheduleData.content,
              priority: scheduleData.priority,
              scheduled_for: scheduleData.scheduledFor,
              location_based: scheduleData.locationBased,
              coordinates: scheduleData.coordinates,
              target_radius: scheduleData.targetRadius
            });

          if (scheduleError) {
            console.error('Error updating notification schedule:', scheduleError);
          }
        }
      }

      return { id: eventData.id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      console.error('Event update error:', error);
      toast({
        title: 'Error updating event',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    },
  });

  return {
    createEvent,
    updateEvent
  };
};
