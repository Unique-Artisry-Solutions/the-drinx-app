
import { supabase } from '@/integrations/supabase/client';
import { 
  SimpleNotification,
  RawEventResponse,
  LocationCoordinates,
  RawEventData,
  RawNotificationResponse,
  SupabaseNotification,
  NotificationMetadata,
  RawNotification
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

export const fetchLocationBasedNotifications = async (): Promise<RawNotificationResponse> => {
  // Get raw data from Supabase without type transformations
  const { data, error } = await supabase
    .from('notifications')
    .select('id, metadata')
    .eq('metadata->location_based', true);

  // Return the raw response matching our interface
  return {
    data: data as SupabaseNotification[] | null,
    error
  };
};

// Helper function to safely parse notification metadata
export const parseNotificationMetadata = (notification: SupabaseNotification): RawNotification => {
  let parsedMetadata: NotificationMetadata | null = null;
  
  if (notification.metadata) {
    // Cast to any first to handle the Json type safely
    const meta = notification.metadata as any;
    parsedMetadata = {
      location_based: meta.location_based || false,
      event_id: meta.event_id || '',
      coordinates: meta.coordinates || null
    };
  }

  return {
    id: notification.id,
    metadata: parsedMetadata
  };
};

export const processLocationData = (notifications: SupabaseNotification[]): SimpleNotification[] => {
  return notifications.map(notification => {
    // Parse the metadata using our helper function
    const parsedNotification = parseNotificationMetadata(notification);
    
    // Create SimpleNotification from parsed data
    return {
      locationBased: Boolean(parsedNotification.metadata?.location_based),
      coordinates: parsedNotification.metadata?.coordinates || null,
      eventId: parsedNotification.metadata?.event_id || ''
    };
  });
};

export const createEventCoordinatesMap = (notifications: SimpleNotification[]): Map<string, LocationCoordinates> => {
  const coordMap = new Map<string, LocationCoordinates>();
  
  notifications.forEach(notification => {
    if (notification.coordinates && notification.eventId) {
      coordMap.set(notification.eventId, notification.coordinates);
    }
  });
  
  return coordMap;
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
