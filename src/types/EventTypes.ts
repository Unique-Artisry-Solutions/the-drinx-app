
// If this file doesn't exist yet, we'll create it with some necessary types

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
  status: string;
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
}

export interface EventMarketingCampaign {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  campaign_type: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  metrics?: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    sources?: Record<string, {
      impressions: number;
      clicks: number;
      conversions: number;
      revenue: number;
    }>;
  };
  target_audience?: Record<string, any>;
}
