
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventType, EventFormData } from '@/types/EventTypes';
import { useUserLocation } from '@/hooks/useUserLocation';

export const useEvents = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userLocation } = useUserLocation();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_ticket_types (*)
        `);

      if (error) {
        toast({
          title: 'Error fetching events',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
  });

  const createEvent = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      // First get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First, create the event
      const { data: eventResponse, error: eventError } = await supabase
        .from('events')
        .insert({
          name: eventData.name,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          venue_id: eventData.venueId,
          image_url: eventData.imageUrl,
          promotional_materials: eventData.promotionalMaterials,
          created_by: user.id // Add the created_by field
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Then, create ticket types
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

      // Create notification schedules if provided
      if (eventData.notificationSchedules && eventData.notificationSchedules.length > 0) {
        // First, create a SQL function if needed to create the notifications table
        await supabase.rpc('execute_sql', { 
          sql_query: `
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT FROM pg_catalog.pg_tables 
                WHERE schemaname = 'public' 
                AND tablename = 'event_notification_schedules'
              ) THEN
                EXECUTE '
                  CREATE TABLE public.event_notification_schedules (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    priority TEXT NOT NULL DEFAULT ''medium'',
                    scheduled_for TIMESTAMPTZ NOT NULL,
                    location_based BOOLEAN NOT NULL DEFAULT false,
                    coordinates JSONB,
                    target_radius INTEGER,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
                  );
                  
                  ALTER TABLE public.event_notification_schedules ENABLE ROW LEVEL SECURITY;
                  
                  CREATE POLICY "Event creators can manage their event notifications"
                    ON public.event_notification_schedules
                    USING (auth.uid() IN (
                      SELECT created_by FROM public.events WHERE id = event_id
                    ));
                ';
              END IF;
            END
            $$;
          `
        });
        
        // Schedule event notifications
        for (const schedule of eventData.notificationSchedules) {
          const { error: notificationError } = await supabase
            .from('event_notification_schedules')
            .insert({
              event_id: eventResponse.id,
              title: schedule.title || `Reminder: ${eventData.name}`,
              content: schedule.content || `Don't forget: ${eventData.name} is happening soon!`,
              priority: schedule.priority || 'medium',
              scheduled_for: schedule.scheduledFor,
              location_based: !!schedule.locationBased,
              coordinates: schedule.coordinates || null,
              target_radius: schedule.targetRadius || null
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

  // New function to schedule notifications for an existing event
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
      // First check if the table exists, create it if it doesn't
      await supabase.rpc('execute_sql', { 
        sql_query: `
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT FROM pg_catalog.pg_tables 
              WHERE schemaname = 'public' 
              AND tablename = 'event_notification_schedules'
            ) THEN
              EXECUTE '
                CREATE TABLE public.event_notification_schedules (
                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
                  title TEXT NOT NULL,
                  content TEXT NOT NULL,
                  priority TEXT NOT NULL DEFAULT ''medium'',
                  scheduled_for TIMESTAMPTZ NOT NULL,
                  location_based BOOLEAN NOT NULL DEFAULT false,
                  coordinates JSONB,
                  target_radius INTEGER,
                  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
                );
                
                ALTER TABLE public.event_notification_schedules ENABLE ROW LEVEL SECURITY;
                
                CREATE POLICY "Event creators can manage their event notifications"
                  ON public.event_notification_schedules
                  USING (auth.uid() IN (
                    SELECT created_by FROM public.events WHERE id = event_id
                  ));
              ';
            END IF;
          END
          $$;
        `
      });
      
      // Insert notifications one by one to avoid potential errors
      for (const notification of notifications) {
        const { error } = await supabase
          .from('event_notification_schedules')
          .insert({
            event_id: eventId,
            title: notification.title,
            content: notification.content,
            priority: notification.priority,
            scheduled_for: notification.scheduledFor,
            location_based: !!notification.locationBased,
            coordinates: notification.coordinates || null,
            target_radius: notification.targetRadius || null
          });
        
        if (error) throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
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

  // New function to get location-filtered events
  const getLocationFilteredEvents = async (radius: number = 10) => {
    if (!userLocation) {
      toast({
        title: 'Location required',
        description: 'Please enable location services to use this feature.',
        variant: 'destructive',
      });
      return [];
    }

    try {
      // This is a simple approach - for production, you'd want to use PostGIS or a similar geospatial extension
      const { data, error } = await supabase
        .rpc('get_events_by_distance', { 
          user_lat: userLocation.latitude,
          user_lng: userLocation.longitude,
          radius_miles: radius
        });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: 'Error filtering events',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    events,
    isLoading,
    createEvent,
    scheduleEventNotifications,
    getLocationFilteredEvents,
  };
};
