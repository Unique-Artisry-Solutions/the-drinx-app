
/**
 * EventTypes.ts
 * Event-specific type definitions that extend core types
 */

// Import and re-export core types
import {
  Event,
  BaseEvent,
  EventStatus,
  EventLocation,
  EventContactInfo,
  User,
  WithOptionalId
} from './CoreTypes';

// Re-export core types for backward compatibility
export type { Event, EventStatus, EventLocation, EventContactInfo };

// Event-specific interfaces that extend core types
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
  campaign_type: 'email' | 'social' | 'paid' | 'influencer' | 'notification' | 'sms' | 'social_media';
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
    cost?: number;
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

export interface EventTicketPricingTier {
  id?: string;
  name: string;
  startDate?: string;
  endDate?: string;
  priceAdjustment: number;
  adjustmentType: 'percentage' | 'fixed';
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
  hasLimitedInventory?: boolean;
  lowInventoryThreshold?: number;
  hasDynamicPricing?: boolean;
  pricingTiers?: EventTicketPricingTier[];
}

export interface EventDiscountCode {
  id?: string;
  event_id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_amount: number;
  expires_at?: string;
  usage_limit?: number;
  usage_count?: number;
  is_active: boolean;
  applicable_ticket_types?: string[];
  created_at?: string;
  description?: string;
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
  purchase_date?: string;
  checked_in_at?: string;
  custom_fields?: Record<string, any>;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Contact information
  first_name?: string;
  last_name?: string;
  phone?: string;
  registration_data?: Record<string, any>;
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

// Form data interface that extends base Event with wizard-specific fields
export interface EventFormData extends WithOptionalId<Event> {
  // Alternative field names used in wizard
  venueId?: string;
  imageUrl?: string;
  promotionalMaterials?: string[];
  location?: EventLocation;
  contact?: EventContactInfo;
  
  // Wizard-specific fields
  ticketTypes: EventTicketType[];
  notificationSchedules?: Array<{
    id: string;
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    scheduledFor: string;
    locationBased: boolean;
    coordinates?: { latitude: number; longitude: number };
    targetRadius?: number;
  }>;
  discountCodes?: EventDiscountCode[];
  paymentSettings?: {
    enablePayments: boolean;
    paymentProvider?: 'stripe' | 'paypal' | 'square' | 'other';
    serviceFeePercentage?: number;
    allowOfflinePayments?: boolean;
    taxRate?: number;
    currency?: string;
  };
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

// Backward compatibility
export type EventType = Event;
