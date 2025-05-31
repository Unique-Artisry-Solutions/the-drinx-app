
/**
 * Master Type System - Single Source of Truth
 * This file establishes the core type hierarchy and prevents duplicate definitions
 */

import { Database } from '@/integrations/supabase/types';

// Re-export Supabase types as base types
export type SupabaseDatabase = Database;
export type SupabaseTables = Database['public']['Tables'];
export type SupabaseViews = Database['public']['Views'];

// Core User Types - Centralized Definition
export type UserRole = 'individual' | 'establishment' | 'promoter' | 'admin';

// Base Entity Interface - All entities extend this
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// User Profile - Master Definition
export interface UserProfile extends BaseEntity {
  user_type: UserRole;
  username?: string;
  display_name?: string;
  bio?: string;
  phone?: string;
  avatar_url?: string;
  email_notifications: boolean;
  push_notifications: boolean;
}

// Establishment - Master Definition
export interface Establishment extends BaseEntity {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  image_url?: string;
  // Computed fields
  cocktail_count?: number;
  cocktailCount?: number; // Legacy compatibility
  distance?: string;
  image?: string; // Legacy compatibility
}

// Event Status - Strict Union Type
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

// Event - Master Definition
export interface Event extends BaseEntity {
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
  location_details?: EventLocation;
  contact_info?: EventContactInfo;
  custom_settings?: Record<string, any>;
  is_public: boolean;
  // Relationships
  venue?: EstablishmentReference;
  ticketTypes?: EventTicketType[];
  attendees?: EventAttendeeInfo;
}

// Supporting Event Types
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

export interface EstablishmentReference {
  id: string;
  name: string;
  address?: string;
}

export interface EventAttendeeInfo {
  registered: number;
  checked_in?: number;
  capacity?: number;
}

export interface EventTicketType extends BaseEntity {
  event_id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold?: number;
  available?: number;
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

// Notification System - Master Definition
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationChannel = 'email' | 'push' | 'in_app' | 'sms';

export interface Notification extends BaseEntity {
  recipient_id: string;
  title: string;
  content: string;
  priority: NotificationPriority;
  is_read: boolean;
  metadata?: Record<string, any>;
  location_based?: boolean;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  target_radius?: number;
}

// Rewards System - Master Definition
export interface RewardTransaction extends BaseEntity {
  user_id: string;
  establishment_id?: string;
  points: number;
  transaction_type: 'earn' | 'redeem' | 'expire' | 'adjust';
  source: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface RewardTier extends BaseEntity {
  establishment_id: string;
  name: string;
  description?: string;
  points_required: number;
  benefits: any[];
  is_active: boolean;
  icon?: string;
  color?: string;
}

export interface UserRewardProfile extends BaseEntity {
  user_id: string;
  establishment_id?: string;
  points: number;
  lifetime_points: number;
  current_tier_id?: string;
}

// Swig Circuit - Master Definition
export interface SwigCircuit extends BaseEntity {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  image_url?: string;
  theme?: string;
  max_distance: number;
  created_by: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  // Relationships
  venues?: SwigCircuitVenue[];
  drink_highlights?: SwigCircuitDrinkHighlight[];
  pairings?: SwigCircuitPairing[];
  ticket_tiers?: SwigCircuitTicketTier[];
}

export interface SwigCircuitVenue extends BaseEntity {
  swig_circuit_id: string;
  establishment_id: string;
  position: number;
  establishment?: Establishment;
}

export interface SwigCircuitDrinkHighlight {
  name: string;
  description?: string;
}

export interface SwigCircuitPairing {
  drink: string;
  food: string;
  description?: string;
}

export interface SwigCircuitTicketTier extends BaseEntity {
  swig_circuit_id: string;
  name: string;
  price: number;
  description?: string;
  max_quantity?: number;
  benefits?: string[];
}

// Navigation Types - Master Definition
export type NavigationType = 'guest' | 'user' | 'admin';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
  requiredRole?: UserRole;
  isActive?: boolean;
}

// Form State Types - Master Definition
export interface FormState<T = Record<string, any>> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// API Response Types - Master Definition
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Hook Return Types - Master Definition
export interface UseQueryResult<T = any> {
  data: T | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

export interface UseMutationResult<T = any, V = any> {
  mutateAsync: (variables: V) => Promise<T>;
  isPending: boolean;
  variables?: V;
}

// Type Guards - Utility functions for type checking
export const isUserRole = (value: string): value is UserRole => {
  return ['individual', 'establishment', 'promoter', 'admin'].includes(value);
};

export const isEventStatus = (value: string): value is EventStatus => {
  return ['draft', 'published', 'cancelled', 'completed'].includes(value);
};

export const isNotificationPriority = (value: string): value is NotificationPriority => {
  return ['low', 'medium', 'high', 'urgent'].includes(value);
};

// Type Utilities - Helper types for common patterns
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type WithTimestamps<T> = T & {
  created_at: string;
  updated_at: string;
};

// Legacy Type Mappings - For backward compatibility
export type { UserProfile as Profile };
export type { Establishment as EstablishmentType };
export type { Event as EventType };
export type { Notification as NotificationInterface };
