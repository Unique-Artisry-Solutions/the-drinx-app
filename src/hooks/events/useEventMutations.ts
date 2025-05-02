
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { EventFormData } from '@/types/EventTypes';

// Create an admin client for bypass operations
const SUPABASE_URL = "https://dvifibvzwunnpcsihpxq.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWZpYnZ6d3VubnBjc2locHhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzI3MzgwNywiZXhwIjoyMDU4ODQ5ODA3fQ.BHfFyAGY7Vh6Rlzp2r8FsuGVR7jZ7RYoiWqQ-gp0xVg";
const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const useEventMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      // Check for admin bypass first
      const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
      let userId = null;
      let client = supabase; // Default client
      
      if (isAdminBypass) {
        userId = localStorage.getItem('bypass_user_id');
        if (!userId) {
          throw new Error('Bypass user ID not found');
        }
        console.log('Using bypass user ID for event creation:', userId);
        // Use admin client for bypass users to bypass RLS
        client = adminSupabase;
      } else {
        // Regular Supabase auth flow
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        userId = user.id;
      }

      const { data: eventResponse, error: eventError } = await client
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
        const { error: ticketError } = await client
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
        // Use the new event_notification_schedules table instead of notifications table
        const notificationInserts = eventData.notificationSchedules.map(schedule => ({
          event_id: eventResponse.id,
          title: schedule.title || `Reminder: ${eventData.name}`,
          content: schedule.content || `Don't forget: ${eventData.name} is happening soon!`,
          priority: schedule.priority || 'medium',
          scheduled_for: schedule.scheduledFor,
          location_based: !!schedule.locationBased,
          coordinates: schedule.coordinates || null,
          target_radius: schedule.targetRadius || null
        }));
        
        const { error: notificationError } = await client
          .from('event_notification_schedules')
          .insert(notificationInserts);

        if (notificationError) throw notificationError;
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
