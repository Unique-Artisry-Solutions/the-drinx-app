
import { EventType } from './EventTypes';

// Simple location coordinates type
export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

export type SimpleNotification = {
  locationBased: boolean;
  coordinates: LocationCoordinates | null;
  eventId: string;
};

export type RawEventResponse = {
  data: RawEventData[] | null;
  error: any;
};

export type NotificationMetadata = {
  location_based?: boolean;
  coordinates?: LocationCoordinates;
  event_id?: string;
};

export type RawNotification = {
  id: string;
  metadata: NotificationMetadata | null;
};

export type RawNotificationResponse = {
  data: RawNotification[] | null;
  error: any;
};

// Basic event data type
export type RawEventData = {
  id: string;
  name: string;
  description: string | null;
  date: string;
  time: string;
  venue_id: string | null;
  image_url: string | null;
  promotional_materials: string[] | null;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  created_by: string;
  event_ticket_types: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    quantity: number;
  }>;
};
