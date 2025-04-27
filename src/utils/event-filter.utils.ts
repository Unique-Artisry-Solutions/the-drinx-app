
import { supabase } from '@/integrations/supabase/client';
import { 
  LocationCoordinates,
  RawEventResponse,
  RawEventData,
  NotificationsResponse,
  EventLocation
} from '@/types/event-filter.types';
import { EventType } from '@/types/EventTypes';

export const fetchPublishedEvents = async (): Promise<RawEventResponse> => {
  return await supabase
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
      )
    `)
    .eq('status', 'published');
};

export const fetchLocationBasedNotifications = async (): Promise<NotificationsResponse> => {
  return await supabase
    .from('notifications')
    .select('id, metadata')
    .eq('metadata->location_based', true);
};

export const extractEventLocations = (data: NotificationsResponse['data']): EventLocation[] => {
  if (!data || data.length === 0) return [];
  
  return data
    .map(item => {
      // Skip invalid items
      if (!item || !item.metadata) return null;
      
      // Cast metadata to any to access properties
      const meta = item.metadata as any;
      
      // Check if this notification has the required location data
      if (!meta.location_based || !meta.event_id || !meta.coordinates) return null;
      if (!meta.coordinates.latitude || !meta.coordinates.longitude) return null;
      
      return {
        eventId: meta.event_id,
        coordinates: {
          latitude: Number(meta.coordinates.latitude),
          longitude: Number(meta.coordinates.longitude)
        }
      };
    })
    .filter((item): item is EventLocation => item !== null);
};

export const createEventCoordinatesMap = (locations: EventLocation[]): Map<string, LocationCoordinates> => {
  const coordMap = new Map<string, LocationCoordinates>();
  
  locations.forEach(location => {
    if (location.coordinates && location.eventId) {
      coordMap.set(location.eventId, location.coordinates);
    }
  });
  
  return coordMap;
};

export const formatEventData = (
  rawEvent: RawEventData,
  coordinates: LocationCoordinates,
  distance: number
): EventType => {
  return {
    id: rawEvent.id,
    name: rawEvent.name,
    description: rawEvent.description || '',
    date: rawEvent.date,
    time: rawEvent.time,
    venue_id: rawEvent.venue_id,
    image_url: rawEvent.image_url || '',
    promotional_materials: rawEvent.promotional_materials || [],
    status: rawEvent.status,
    distance: distance,
    ticketTypes: rawEvent.event_ticket_types.map(ticket => ({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price,
      description: ticket.description,
      quantity: ticket.quantity,
      sold: 0,
      available: ticket.quantity
    })),
    venue: {
      id: rawEvent.venue_id || '',
      name: '',
      address: ''
    },
    attendees: {
      registered: 0,
      capacity: rawEvent.event_ticket_types.reduce((sum, ticket) => sum + ticket.quantity, 0),
      checkedIn: 0
    },
    revenue: {
      total: 0,
      ticketSales: 0,
      additionalSales: 0
    },
    createdAt: rawEvent.created_at,
    updatedAt: rawEvent.updated_at,
    createdBy: rawEvent.created_by
  };
};
