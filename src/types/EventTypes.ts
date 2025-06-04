
// EventTypes.ts - Contains event-specific types

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type EventType = 'swig_circuit' | 'bar_crawl' | 'tasting' | 'networking' | 'social';

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue?: {
    id: string;
    name: string;
    address: string;
  };
  venue_id?: string;
  status: EventStatus;
  event_type?: EventType;
  capacity?: number;
  image_url?: string;
  promotional_materials?: string[];
  location_details?: EventLocation;
  contact_info?: EventContactInfo;
  custom_settings?: any;
  is_public?: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  attendees?: {
    registered: number;
    checked_in: number;
  };
}

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude?: number;
  longitude?: number;
  venue_details?: string;
}

export interface EventContactInfo {
  organizer_name: string;
  organizer_email: string;
  organizer_phone?: string;
  support_email?: string;
}

export interface EventFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  venueId: string;
  capacity?: number;
  image_url?: string;
  promotional_materials?: string[];
  location_details?: EventLocation;
  contact_info?: EventContactInfo;
  custom_settings?: any;
  is_public?: boolean;
  event_type?: EventType;
  ticketTypes: EventTicketType[];
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type_id: string;
  quantity: number;
  purchase_date: string;
  checked_in_at?: string;
  status: 'registered' | 'checked_in' | 'cancelled';
  ticket_code?: string;
  purchaser_info?: any;
  user?: {
    id: string;
    display_name?: string;
    email?: string;
    avatar_url?: string;
  };
  ticket_type?: EventTicketType;
}

export interface EventTicketType {
  id: string;
  event_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold_quantity?: number;
  available_quantity?: number;
  created_at: string;
}

export interface EventDiscountCode {
  id: string;
  event_id: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  usage_limit?: number;
  usage_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

export interface EventMarketingCampaign {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  campaign_type: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date?: string;
  end_date?: string;
  budget?: number;
  target_audience?: any;
  metrics?: any;
  created_at: string;
  updated_at: string;
}
