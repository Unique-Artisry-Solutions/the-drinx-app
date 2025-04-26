
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
        // Create notifications for each schedule
        for (const schedule of eventData.notificationSchedules) {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              recipient_id: user.id, // Event creator will receive these notifications
              recipient_type: 'promoter',
              title: schedule.title || `Reminder: ${eventData.name}`,
              content: schedule.content || `Don't forget: ${eventData.name} is happening soon!`,
              priority: schedule.priority || 'medium',
              metadata: {
                event_id: eventResponse.id,
                scheduled_for: schedule.scheduledFor,
                location_based: !!schedule.locationBased,
                coordinates: schedule.coordinates || null,
                target_radius: schedule.targetRadius || null,
                notification_type: 'event_schedule'
              }
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
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      // Get the event to verify ownership
      const { data: event } = await supabase
        .from('events')
        .select('created_by')
        .eq('id', eventId)
        .single();
      
      if (!event) throw new Error('Event not found');
      if (event.created_by !== user.id) throw new Error('You do not have permission to schedule notifications for this event');
      
      // Insert notifications one by one to avoid potential errors
      for (const notification of notifications) {
        const { error } = await supabase
          .from('notifications')
          .insert({
            recipient_id: user.id, // Event creator will receive these notifications
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
      // Since we can't use RPC directly, we'll use a client-side filter approach
      const { data: venues, error: venuesError } = await supabase
        .from('establishments')
        .select('id, latitude, longitude');
      
      if (venuesError) throw venuesError;
      
      // Get all events
      const { data: allEvents, error: eventsError } = await supabase
        .from('events')
        .select('*, establishments(id, latitude, longitude)')
        .eq('status', 'published');
      
      if (eventsError) throw eventsError;
      
      // Filter events by distance (Haversine formula)
      const filteredEvents = allEvents.filter(event => {
        if (!event.establishments) return false;
        
        const venue = event.establishments;
        if (!venue.latitude || !venue.longitude) return false;
        
        // Calculate distance in miles
        const R = 3958.8; // Earth radius in miles
        const lat1 = userLocation.latitude * Math.PI/180;
        const lat2 = venue.latitude * Math.PI/180;
        const deltaLat = (venue.latitude - userLocation.latitude) * Math.PI/180;
        const deltaLon = (venue.longitude - userLocation.longitude) * Math.PI/180;
        
        const a = 
          Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
          Math.cos(lat1) * Math.cos(lat2) * 
          Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance <= radius;
      });
      
      return filteredEvents;
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
