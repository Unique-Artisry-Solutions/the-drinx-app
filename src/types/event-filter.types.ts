
import { Json } from '@/integrations/supabase/types';

// Simple location coordinates type
export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

// For storing simple notification data with location info
export type EventLocation = {
  eventId: string;
  coordinates: LocationCoordinates;
};

// Raw event response from Supabase
export type RawEventResponse = {
  data: RawEventData[] | null;
  error: any;
};

// Basic event data type with all fields we need
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

// For notifications table response
export type NotificationsResponse = {
  data: {
    id: string;
    metadata: Json;
  }[] | null;
  error: any;
};
