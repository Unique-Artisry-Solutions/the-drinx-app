
// Event types with proper structure and all required fields

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue_id?: string;
  venue?: {
    id: string;
    name: string;
    address: string;
  };
  image_url?: string;
  promotional_materials?: string[];
  status: EventStatus;
  created_by: string;
  created_at?: string;
  updated_at?: string;
  capacity?: number;
  event_type?: string;
  location_details: EventLocation;
  contact_info: EventContactInfo;
  custom_settings: Record<string, any>;
  is_public: boolean;
  event_url?: string;
  ticketTypes: EventTicketType[];
  attendees: {
    registered: number;
    checked_in: number;
    capacity: number;
  };
  distance?: number;
}

export interface EventLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface EventContactInfo {
  name: string;
  email: string;
}

export interface EventTicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  available: number;
  hasLimitedInventory?: boolean;
  lowInventoryThreshold?: number;
  hasDynamicPricing?: boolean;
}

export interface EventMarketingCampaign {
  id: string;
  name: string;
  description?: string;
  campaign_type: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    open_rate?: number;
    sources?: Record<string, {
      impressions: number;
      clicks: number;
      conversions: number;
      revenue: number;
    }>;
  };
  target_audience?: Record<string, any>;
  event_id?: string;
}

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface EventAttendee {
  id?: string;
  event_id: string;
  user_id?: string;
  email?: string;
  name?: string;
  ticket_type_id?: string;
  purchase_date: string;
  checked_in_at?: string;
  status: 'registered' | 'checked_in' | 'cancelled' | 'no_show';
  ticket_code?: string;
  notes?: string;
  custom_fields?: Record<string, any>;
}

// For EventWizardContext and useEventMutations
export interface EventFormData {
  id?: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue?: {
    id: string;
    name: string;
  } | null;
  venueId?: string;
  venue_id?: string;
  created_by: string;
  ticketTypes: {
    id?: string;
    name: string;
    price: number;
    description: string;
    quantity: number;
    hasLimitedInventory?: boolean;
    lowInventoryThreshold?: number;
    hasDynamicPricing?: boolean;
  }[];
  imageUrl: string;
  image_url?: string;
  promotionalMaterials: string[];
  promotional_materials?: string[];
  notificationSchedules?: Array<{
    id?: string;
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduledFor: string;
    locationBased: boolean;
    coordinates?: { latitude: number; longitude: number };
    targetRadius?: number;
  }>;
}

// For analytics components that expect typeName (compatibility layer)
export interface TicketAnalyticsData {
  name: string;
  typeName?: string; // Added for backwards compatibility
  sold: number;
  available: number;
  revenue: number;
  total?: number; // Added for RealTimeSalesTracker
}

// For A/B testing and campaign analytics
export interface ABTestResult {
  variants: { id: string; name: string; conversionRate: number }[];
  winner: string | null;
  variantA?: {
    id: string;
    name: string;
    conversionRate: number;
  };
  variantB?: {
    id: string; 
    name: string;
    conversionRate: number;
  };
  improvement?: number;
  significantResult?: boolean;
}

// Alias for backward compatibility
export type EventType = Event;
