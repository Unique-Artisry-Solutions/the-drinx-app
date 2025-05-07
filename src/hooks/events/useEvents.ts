import { supabase } from '@/integrations/supabase/client';
import { EventType, EventFormData } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';
import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calculateDistance } from '@/utils/locationUtils';

export interface LocationFilter {
  latitude: number;
  longitude: number;
  radiusMiles: number;
}

export const useEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchEvents = useCallback(async (locationFilter?: LocationFilter, statusFilter?: 'draft' | 'published' | 'cancelled' | 'completed' | 'all'): Promise<EventType[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query for events joined with venues to get location data
      let query = supabase
        .from('events')
        .select(`
          id,
          name,
          description,
          date,
          time,
          venue_id,
          image_url,
          promotional_materials,
          status,
          created_at,
          updated_at,
          created_by,
          event_ticket_types (
            id,
            name,
            price,
            description,
            quantity
          ),
          establishments:venue_id (
            id, 
            name, 
            address,
            latitude,
            longitude
          )
        `);
      
      // Apply status filter if provided
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data) return [];

      // Map data to our EventType format
      let formattedEvents = data.map(event => {
        const venueData = event.establishments;
        
        // Calculate distance if location filter is provided and venue data exists
        let distance = 0;
        if (locationFilter && venueData && venueData.latitude && venueData.longitude) {
          distance = calculateDistance(
            locationFilter.latitude,
            locationFilter.longitude,
            venueData.latitude,
            venueData.longitude
          );
        }

        return {
          id: event.id,
          name: event.name,
          description: event.description || '',
          date: event.date,
          time: event.time,
          venue_id: event.venue_id,
          image_url: event.image_url || '',
          promotional_materials: event.promotional_materials || [],
          status: event.status,
          distance: distance,
          ticketTypes: event.event_ticket_types.map(ticket => ({
            id: ticket.id,
            name: ticket.name,
            price: ticket.price,
            description: ticket.description,
            quantity: ticket.quantity,
            sold: 0,
            available: ticket.quantity
          })),
          venue: {
            id: event.venue_id || '',
            name: venueData?.name || '',
            address: venueData?.address || ''
          },
          attendees: {
            registered: 0,
            capacity: event.event_ticket_types.reduce((sum, ticket) => sum + ticket.quantity, 0),
            checked_in: 0
          },
          created_by: event.created_by,
          created_at: event.created_at,
          updated_at: event.updated_at,
          // Add required fields from the Event interface
          location_details: {
            address: venueData?.address || '',
            city: '',
            state: '',
            zip: '',
            country: ''
          },
          contact_info: {
            name: '',
            email: ''
          },
          custom_settings: {},
          is_public: true
        };
      });

      // Filter by distance if location filter is provided
      if (locationFilter) {
        formattedEvents = formattedEvents.filter(
          event => event.distance <= locationFilter.radiusMiles
        );
      }

      setEvents(formattedEvents);
      return formattedEvents;

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching events",
        description: err.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch published events for backward compatibility
  const fetchPublishedEvents = useCallback(async (locationFilter?: LocationFilter): Promise<EventType[]> => {
    return fetchEvents(locationFilter, 'published');
  }, [fetchEvents]);

  // Fetch events on component mount - get all events by default
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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
              recipient_id: user.id,
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
    events,
    fetchEvents,
    fetchPublishedEvents,
    isLoading,
    error,
    createEvent,
  };
};
