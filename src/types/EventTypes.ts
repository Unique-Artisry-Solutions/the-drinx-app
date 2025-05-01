
// This is a new file to properly define event types
export interface EventTicketType {
  id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold?: number;
  available?: number;
}

export interface EventAttendee {
  id?: string;
  event_id: string;
  user_id?: string;
  ticket_type_id?: string;
  status: 'registered' | 'checked_in' | 'cancelled' | 'no_show';
  email?: string;
  name?: string;
  purchase_date?: string;
  ticket_code?: string;
  checked_in_at?: string;
  notes?: string;
  custom_fields?: Record<string, any>;
}

export interface EventCheckIn {
  id?: string;
  event_id: string;
  attendee_id: string;
  checked_in_by?: string;
  checked_in_at: string;
  location?: string;
  notes?: string;
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
  metrics?: Record<string, any>;
  target_audience?: Record<string, any>;
}

export interface EventCustomField {
  id?: string;
  event_id: string;
  field_name: string;
  field_type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect';
  field_value?: any;
  is_required: boolean;
  display_order: number;
}

export interface EventAnalytics {
  id?: string;
  event_id: string;
  date: string;
  page_views: number;
  ticket_views: number;
  ticket_sales: number;
  revenue: number;
  social_shares: number;
  referral_sources?: Record<string, any>;
}

export interface EventStatistics {
  event_id: string;
  event_name: string;
  promoter_id: string;
  date: string;
  status: string;
  total_attendees: number;
  checked_in_attendees: number;
  cancelled_attendees: number;
  total_revenue: number;
  marketing_campaign_count: number;
}

export interface EventAttendees {
  registered: number;
  capacity: number;
  checkedIn: number;
}

export interface EventRevenue {
  total: number;
  ticketSales: number;
  additionalSales: number;
}

export interface EventVenue {
  id: string;
  name: string;
  address: string;
}

export interface EventNotificationScheduleInput {
  id: string; 
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor: string;
  locationBased?: boolean;
  coordinates?: { latitude: number; longitude: number };
  targetRadius?: number;
}

export interface EventFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  venueId?: string;
  imageUrl?: string;
  promotionalMaterials?: string[];
  ticketTypes: Omit<EventTicketType, 'id' | 'sold' | 'available'>[];
  notificationSchedules?: EventNotificationScheduleInput[];
  capacity?: number;
  eventType?: string;
  locationDetails?: Record<string, any>;
  contactInfo?: Record<string, any>;
  customSettings?: Record<string, any>;
  isPublic?: boolean;
  eventUrl?: string;
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue_id?: string;
  venue: EventVenue;
  image_url?: string;
  promotional_materials?: string[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  ticketTypes: EventTicketType[];
  attendees: EventAttendees;
  revenue: EventRevenue;
  distance?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  capacity?: number;
  eventType?: string;
  locationDetails?: Record<string, any>;
  contactInfo?: Record<string, any>;
  customSettings?: Record<string, any>;
  isPublic?: boolean;
  eventUrl?: string;
}
