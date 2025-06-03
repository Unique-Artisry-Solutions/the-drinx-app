
export interface EventMarketingCampaign {
  id: string;
  event_id: string;
  name: string;
  description: string;
  campaign_type: 'email' | 'social' | 'paid' | 'influencer';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  metrics?: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    cost?: number;
  };
}

export type EventStatus = 'draft' | 'published' | 'active' | 'cancelled' | 'completed';

export interface EventLocation {
  id: string;
  venue?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface EventHeader {
  id: string;
  title: string;
  description: string;
  status: EventStatus;
  start_time: string;
  end_time: string;
  location: EventLocation;
  establishment_id: string;
}

export interface EventAttendee {
  id?: string;
  name?: string;
  email?: string;
  ticket_code?: string;
  status: 'registered' | 'checked_in' | 'cancelled';
  purchase_date?: string;
  checked_in_at?: string;
  notes?: string;
  custom_fields?: Record<string, any>;
}

export interface EventTicketType {
  id?: string;
  event_id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold?: number;
  available?: number;
  created_at?: string;
  updated_at?: string;
  hasLimitedInventory?: boolean;
  lowInventoryThreshold?: number;
  hasDynamicPricing?: boolean;
  pricingTiers?: EventTicketPricingTier[];
}

export interface EventTicketPricingTier {
  id?: string;
  name: string;
  startDate?: string;
  endDate?: string;
  priceAdjustment: number;
  adjustmentType: 'percentage' | 'fixed';
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: string;
  time: string;
  venue_id?: string;
  image_url?: string;
  promotional_materials?: string[];
  status: EventStatus;
  created_by: string;
  capacity?: number;
  event_type?: string;
  event_url?: string;
  location_details?: {
    venue?: string;
    address?: string;
  };
  contact_info?: {
    email?: string;
    phone?: string;
  };
  custom_settings?: Record<string, any>;
  is_public: boolean;
  venue?: {
    name: string;
    address: string;
  };
  attendees?: {
    registered: number;
    checked_in?: number;
    capacity?: number;
  };
}
