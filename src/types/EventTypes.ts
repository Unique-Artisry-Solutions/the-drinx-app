export type {
  Event,
  EventStatus,
  EventLocation,
  EventContactInfo,
  EventTicketType,
  EventTicketPricingTier
} from './master/index';

// Use extended types from master/extensions for form data
export type {
  EventFormData,
  EventNotificationSchedule,
  EventDiscountCode,
  EventPaymentSettings
} from './master/extensions';

// Keep only the additional types that aren't in the master system
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
  status: 'draft' | 'active' | 'completed' | 'cancelled';  // Updated to match the actual status values used
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

// Re-export commonly used type aliases for backward compatibility
export type EventType = Event;
