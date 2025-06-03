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
