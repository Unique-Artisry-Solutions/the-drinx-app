
import { supabase } from '@/integrations/supabase/client';
import { 
  NotificationRecord, 
  RawEventResponse, 
  LocationCoordinates,
  RawEventData,
  SupabaseNotificationResponse
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
    .eq('status', 'published') as RawEventResponse;
};

export const fetchLocationBasedNotifications = async (): Promise<SupabaseNotificationResponse> => {
  const response = await supabase
    .from('notifications')
    .select('metadata, event_id')
    .eq('metadata->location_based', true);
    
  return response as unknown as SupabaseNotificationResponse;
};

export const processLocationData = (responseData: any): NotificationRecord[] => {
  const locationData: NotificationRecord[] = [];
  
  // Handle null response data
  if (!responseData || !Array.isArray(responseData)) {
    return locationData;
  }
  
  responseData.forEach(item => {
    if (item && item.metadata) {
      locationData.push({
        metadata: {
          location_based: item.metadata.location_based,
          coordinates: item.metadata.coordinates,
          event_id: item.metadata.event_id
        },
        event_id: item.event_id
      });
    }
  });
  
  return locationData;
};

export const createEventCoordinatesMap = (locationData: NotificationRecord[]): Map<string, LocationCoordinates> => {
  const eventCoordinates = new Map<string, LocationCoordinates>();
  
  locationData.forEach(item => {
    const coordinates = item?.metadata?.coordinates;
    const eventId = item?.metadata?.event_id || item?.event_id;
    
    if (coordinates && eventId) {
      eventCoordinates.set(eventId, coordinates);
    }
  });
  
  return eventCoordinates;
};

export const formatEventData = (
  rawEvent: RawEventData,
  coordinates: LocationCoordinates | undefined,
  distance: number | null
): EventType | null => {
  if (!coordinates) return null;

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
    distance: distance || 0,
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
