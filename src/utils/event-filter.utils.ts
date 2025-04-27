
import { supabase } from '@/integrations/supabase/client';
import { 
  LocationCoordinates,
  RawEventResponse,
  RawEventData,
  NotificationsResponse,
  NotificationMetadata
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
  // Cast the response to NotificationsResponse to match our expected types
  return await supabase
    .from('notifications')
    .select('id, metadata')
    .eq('metadata->location_based', true) as NotificationsResponse;
};

// Type guard function to validate notification metadata
function isValidLocationMetadata(metadata: any): metadata is NotificationMetadata & { location_based: true; event_id: string; coordinates: LocationCoordinates } {
  return (
    metadata &&
    metadata.location_based === true &&
    typeof metadata.event_id === 'string' &&
    metadata.coordinates !== undefined &&
    typeof metadata.coordinates.latitude === 'number' &&
    typeof metadata.coordinates.longitude === 'number'
  );
}

// Extract event locations from notifications with type safety
export const extractEventLocations = (data: NotificationsResponse['data']): { eventId: string; coordinates: LocationCoordinates }[] => {
  if (!data) return [];
  
  return data
    .map(item => {
      if (!isValidLocationMetadata(item.metadata)) return null;
      
      return {
        eventId: item.metadata.event_id,
        coordinates: item.metadata.coordinates
      };
    })
    .filter((item): item is { eventId: string; coordinates: LocationCoordinates } => item !== null);
};

// Create a map of event IDs to their coordinates
export const createEventCoordinatesMap = (locations: { eventId: string; coordinates: LocationCoordinates }[]): Map<string, LocationCoordinates> => {
  const coordMap = new Map<string, LocationCoordinates>();
  
  locations.forEach(location => {
    coordMap.set(location.eventId, location.coordinates);
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
