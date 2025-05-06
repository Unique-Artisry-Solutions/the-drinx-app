
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface EventContactInfo {
  name: string;
  email: string;
  phone?: string;
}

export interface ABTestConfig {
  variantA: string;
  variantB: string;
  distribution: number; // Percentage for variant A (0-100)
}

export interface EventTargetAudience {
  segmentId?: string;
  abTest?: ABTestConfig;
}

export interface EventMarketingCampaign {
  id?: string;
  event_id: string;
  name: string;
  description?: string;
  campaign_type: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  metrics?: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    emails_sent?: number;
    open_rate?: number;
    notifications_sent?: number;
    segments?: Record<string, Record<string, number>>;
    abTest?: {
      variantA: Record<string, number>;
      variantB: Record<string, number>;
    };
    [key: string]: any;
  };
  target_audience?: EventTargetAudience;
  created_at?: string;
  updated_at?: string;
}

export interface EventTicketType {
  id?: string;
  event_id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold?: number;    // Added field for ticket sales count
  available?: number; // Added field for available tickets
  created_at?: string;
}

export interface EventAttendee {
  id?: string;
  event_id: string;
  user_id?: string;
  ticket_type_id?: string;
  email?: string;
  name?: string;
  status: 'registered' | 'checked_in' | 'cancelled' | 'no_show';
  ticket_code?: string;
  purchase_date: string;
  checked_in_at?: string;
  custom_fields?: Record<string, any>;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventCustomField {
  id?: string;
  event_id: string;
  field_name: string;
  field_type: string;
  field_value?: any;
  is_required?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id?: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  venue_id?: string;
  image_url?: string;
  promotional_materials?: string[];
  status?: EventStatus;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  capacity?: number;
  event_type?: string;
  event_url?: string;
  location_details?: EventLocation;
  contact_info?: EventContactInfo;
  custom_settings?: Record<string, any>;
  is_public?: boolean;
}

// Added missing types that were causing errors
export type EventType = Event;

export interface EventFormData extends Omit<Event, 'id' | 'created_at' | 'updated_at'> {
  location?: EventLocation;
  contact?: EventContactInfo;
}

export interface EventCheckIn {
  id?: string;
  event_id: string;
  attendee_id: string;
  checked_in_by?: string;
  checked_in_at: string;
  location?: string;
  notes?: string;
  created_at?: string;
}

export interface EventStatistics {
  total_attendees: number;
  checked_in_attendees: number;
  cancelled_attendees: number;
  total_revenue: number;
  event_id: string;
  event_name?: string;
  date?: string;
  status?: EventStatus;
}
