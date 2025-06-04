import { useState, useEffect } from 'react';
import { Event, EventFormData } from '@/types/EventTypes';
import { supabase } from '@/lib/supabase';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues:venue_id (
            id,
            name,
            address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match Event interface
      const transformedEvents: Event[] = data.map(event => ({
        id: event.id,
        name: event.name,
        description: event.description || '',
        date: event.date,
        time: event.time,
        venue: event.venues ? {
          id: event.venues.id,
          name: event.venues.name,
          address: event.venues.address
        } : undefined,
        venue_id: event.venue_id,
        status: event.status,
        event_type: event.event_type,
        capacity: event.capacity,
        image_url: event.image_url,
        promotional_materials: event.promotional_materials || [],
        location_details: event.location_details,
        contact_info: event.contact_info,
        custom_settings: event.custom_settings,
        is_public: event.is_public,
        created_by: event.created_by,
        created_at: event.created_at,
        updated_at: event.updated_at
      }));

      setEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: EventFormData) => {
    try {
      setLoading(true);
      const { data: newEvent, error } = await supabase
        .from('events')
        .insert([
          {
            name: eventData.name,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            venue_id: eventData.venueId,
            capacity: eventData.capacity,
            image_url: eventData.image_url,
            promotional_materials: eventData.promotional_materials,
            location_details: eventData.location_details,
            contact_info: eventData.contact_info,
            custom_settings: eventData.custom_settings,
            is_public: eventData.is_public,
            event_type: eventData.event_type,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setEvents(prevEvents => [...prevEvents, {
        id: newEvent.id,
        name: newEvent.name,
        description: newEvent.description || '',
        date: newEvent.date,
        time: newEvent.time,
        venue: {
          id: eventData.venueId,
          name: 'Selected Venue', // You might want to fetch the actual venue name
          address: 'Venue Address' // You might want to fetch the actual venue address
        },
        venue_id: eventData.venueId,
        status: newEvent.status,
        event_type: newEvent.event_type,
        capacity: newEvent.capacity,
        image_url: newEvent.image_url,
        promotional_materials: newEvent.promotional_materials || [],
        location_details: newEvent.location_details,
        contact_info: newEvent.contact_info,
        custom_settings: newEvent.custom_settings,
        is_public: newEvent.is_public,
        created_by: newEvent.created_by,
        created_at: newEvent.created_at,
        updated_at: newEvent.updated_at
      }]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<EventFormData>) => {
    try {
      setLoading(true);
      const { data: updatedEvent, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;

      setEvents(prevEvents =>
        prevEvents.map(event => (event.id === eventId ? { ...event, ...updatedEvent } : event))
      );
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
