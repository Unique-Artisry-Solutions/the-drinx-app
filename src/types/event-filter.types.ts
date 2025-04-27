
import { EventType } from './EventTypes';

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

// Raw response type from Supabase
export type SupabaseNotificationResponse = {
  data: {
    metadata: {
      location_based?: boolean;
      coordinates?: LocationCoordinates;
      event_id?: string;
    };
    event_id: string;
  }[] | null;
  error: any;
};

// Simplified type for processed notification records
export type NotificationRecord = {
  metadata?: {
    location_based?: boolean;
    coordinates?: LocationCoordinates;
    event_id?: string;
  };
  event_id?: string;
};

export interface RawEventData {
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
}

export interface RawEventResponse {
  data: RawEventData[] | null;
  error: any;
}
