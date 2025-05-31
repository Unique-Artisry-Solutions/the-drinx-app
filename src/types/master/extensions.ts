
/**
 * Type Extensions - Specialized types that extend master types
 * These provide domain-specific functionality while maintaining type safety
 */

import {
  BaseEntity,
  Event,
  EventTicketType,
  Establishment,
  UserProfile,
  SwigCircuit,
  Notification,
  NotificationPriority,
  EventStatus,
  UserRole
} from './index';

// Extended Event Types for Forms
export interface EventFormData extends Omit<Event, 'id' | 'created_at' | 'updated_at'> {
  id?: string;
  // Alternative naming for form compatibility
  venueId?: string;
  imageUrl?: string;
  promotionalMaterials?: string[];
  location?: Event['location_details'];
  contact?: Event['contact_info'];
  ticketTypes: EventTicketType[];
  notificationSchedules?: EventNotificationSchedule[];
  discountCodes?: EventDiscountCode[];
  paymentSettings?: EventPaymentSettings;
}

export interface EventNotificationSchedule extends BaseEntity {
  event_id: string;
  title: string;
  content: string;
  priority: NotificationPriority;
  scheduledFor: string;
  locationBased: boolean;
  coordinates?: { latitude: number; longitude: number };
  targetRadius?: number;
}

export interface EventDiscountCode extends BaseEntity {
  event_id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_amount: number;
  expires_at?: string;
  usage_limit?: number;
  usage_count?: number;
  is_active: boolean;
  applicable_ticket_types?: string[];
  description?: string;
}

export interface EventPaymentSettings {
  enablePayments: boolean;
  paymentProvider?: 'stripe' | 'paypal' | 'square' | 'other';
  serviceFeePercentage?: number;
  allowOfflinePayments?: boolean;
  taxRate?: number;
  currency?: string;
}

// Extended Establishment Types
export interface EstablishmentWithDistance extends Establishment {
  distance: string;
  distanceValue: number;
}

export interface EstablishmentProfile extends Establishment {
  owner_id: string;
  business_hours?: BusinessHours[];
  social_media?: SocialMediaLinks;
  amenities?: string[];
  cocktails?: Cocktail[];
}

export interface BusinessHours {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}

export interface Cocktail extends BaseEntity {
  establishment_id: string;
  name: string;
  description: string;
  price: string;
  ingredients?: any[];
  image_url?: string;
}

// Extended User Profile Types
export interface UserProfileWithStats extends UserProfile {
  stats?: UserStats;
  preferences?: UserPreferences;
  rewards?: UserRewardProfile[];
}

export interface UserStats {
  totalMocktailsTried: number;
  totalPoints: number;
  currentStreak: number;
  establishmentsVisited: number;
  favoriteEstablishments: number;
}

export interface UserPreferences {
  location_sharing: boolean;
  notification_radius: number;
  dietary_restrictions?: string[];
  favorite_ingredients?: string[];
}

// Extended Swig Circuit Types
export interface SwigCircuitWithDetails extends SwigCircuit {
  selected_establishments: Establishment[];
  drink_highlights: string[];
  pairings: Array<{
    drink: string;
    food: string;
    description?: string;
  }>;
}

// Component Prop Types - Strict definitions
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ListComponentProps<T> extends ComponentProps {
  items: T[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export interface FormComponentProps<T> extends ComponentProps {
  initialValues?: Partial<T>;
  onSubmit: (values: T) => void | Promise<void>;
  isSubmitting?: boolean;
  validationSchema?: any;
}

export interface ModalComponentProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Navigation Types - Extended
export interface NavigationState {
  userType: UserRole | null;
  isAuthenticated: boolean;
  navigationType: 'guest' | 'user' | 'admin';
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

// Filter and Search Types
export type SortOrder = 'asc' | 'desc';
export type FilterOperator = 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';

export interface FilterCriteria {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface SortCriteria {
  field: string;
  order: SortOrder;
}

export interface SearchParams {
  query?: string;
  filters?: FilterCriteria[];
  sort?: SortCriteria;
  page?: number;
  limit?: number;
}

// Error Types - Standardized
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: Record<string, any>;
}

export interface ValidationError extends AppError {
  field: string;
  rule: string;
}

// Type Conversion Utilities
export type ToFormData<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

export type ToApiRequest<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

export type ToApiResponse<T> = T & {
  id: string;
  created_at: string;
  updated_at: string;
};
