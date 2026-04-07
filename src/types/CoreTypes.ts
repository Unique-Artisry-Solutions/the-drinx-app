
/**
 * CoreTypes.ts
 * Single source of truth for all core entities in the application
 * All other type files should import and extend from these base types
 */

// Base User interface - single source of truth
export interface BaseUser {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// Extended User with profile information
export interface User extends BaseUser {
  name: string;
  display_name?: string;
  username?: string;
  avatar?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  user_type?: 'individual' | 'establishment' | 'promoter' | 'admin';
  // Notification preferences
  email_notifications?: boolean;
  push_notifications?: boolean;
}

// Base Establishment interface - single source of truth
export interface BaseEstablishment {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// Extended Establishment with full details
export interface Establishment extends BaseEstablishment {
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  bio?: string;
  description?: string;
  // Media
  image?: string;
  image_url?: string;
  // Metrics
  cocktail_count?: number;
  cocktailCount?: number; // For compatibility
  // Computed fields
  distance?: string;
  distance_in_miles?: number;
  distanceValue?: number;
}

// Base Event interface - single source of truth
export interface BaseEvent {
  id: string;
  name: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

// Event status type
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

// Event ticket type for core Event interface
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
  pricingTiers?: Array<{
    id?: string;
    name: string;
    startDate?: string;
    endDate?: string;
    priceAdjustment: number;
    adjustmentType: 'percentage' | 'fixed';
  }>;
}

// Extended Event with full details
export interface Event extends BaseEvent {
  description?: string;
  date: string;
  time: string;
  venue_id?: string;
  image_url?: string;
  promotional_materials?: string[];
  status?: EventStatus;
  capacity?: number;
  event_type?: string;
  event_url?: string;
  is_public?: boolean;
  // Structured data
  location_details?: EventLocation;
  contact_info?: EventContactInfo;
  custom_settings?: Record<string, any>;
  // Ticket information
  ticketTypes?: EventTicketType[];
  // For compatibility with EventsSection
  venue?: {
    id: string;
    name: string;
    address?: string;
  };
  distance?: number;
  attendees?: {
    registered: number;
    checked_in?: number;
    capacity?: number;
  };
}

// Supporting interfaces for Event
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

// Base Cocktail interface
export interface BaseCocktail {
  id: string;
  name: string;
  created_at?: string;
}

// Extended Cocktail
export interface Cocktail extends BaseCocktail {
  price: number | string;
  description?: string;
  image_url?: string;
  ingredients?: any;
  establishment_id?: string;
  establishment: string | { id?: string; name: string };
}

// Base SwigCircuit interface
export interface BaseSwigCircuit {
  id: string;
  name: string;
  organizer: string;
  created_at?: string;
}

// Extended SwigCircuit
export interface SwigCircuit extends BaseSwigCircuit {
  startDate: string;
  endDate: string;
  description?: string;
  imageUrl?: string;
  establishments: Establishment[];
  invitedUsers?: User[];
  status: 'planned' | 'active' | 'completed';
}

// Composition patterns for variations
export type EstablishmentSummary = Pick<Establishment, 'id' | 'name' | 'address' | 'image'>;
export type EstablishmentWithDistance = Establishment & Required<Pick<Establishment, 'distance'>>;
export type EstablishmentCard = Pick<Establishment, 'id' | 'name' | 'address' | 'cocktailCount' | 'image' | 'distance'>;

export type UserProfile = Pick<User, 'id' | 'name' | 'avatar' | 'bio' | 'user_type'>;
export type UserSummary = Pick<User, 'id' | 'name' | 'email' | 'avatar'>;

export type EventSummary = Pick<Event, 'id' | 'name' | 'date' | 'time' | 'venue_id' | 'status'>;
export type EventCard = Pick<Event, 'id' | 'name' | 'date' | 'image_url' | 'description' | 'venue'>;

// Common utility types
export type WithTimestamps<T> = T & {
  created_at: string;
  updated_at: string;
};

export type WithOptionalId<T> = Omit<T, 'id'> & {
  id?: string;
};

export type ApiResponse<T> = {
  data: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};
