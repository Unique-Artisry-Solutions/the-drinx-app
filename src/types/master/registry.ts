
/**
 * Type Registry - Maps existing types to master system
 * This file provides backward compatibility while transitioning to the new system
 */

// Re-export master types
export * from './index';
export * from './extensions';

// Legacy type mappings for backward compatibility
import {
  UserProfile,
  Establishment,
  Event,
  Notification,
  SwigCircuit,
  NavigationType
} from './index';

import { 
  EventFormData as ExtendedEventFormData,
  EstablishmentWithDistance,
  NavigationState
} from './extensions';

// Redirect legacy imports to master types (avoid duplicate exports)
export type { UserProfile as ProfileTypes };
export type { Establishment as EstablishmentTypes };
export type { Event as EventTypes };
export type { Notification as NotificationTypes };

// Map specific legacy types that don't conflict
export type {
  // Profile types
  UserProfile as Profile,
  
  // Establishment types
  Establishment as EstablishmentType,
  EstablishmentWithDistance,
  
  // Event types
  Event as EventType,
  ExtendedEventFormData as EventFormData,
  ExtendedEventFormData as EventFormDataLegacy,
  
  // Navigation types
  NavigationState as EffectiveAuthState,
  
  // Swig Circuit types
  SwigCircuit as SwigCircuitType
};

// Type validation functions
export const isUserRole = (value: unknown): value is import('./index').UserRole => {
  return typeof value === 'string' && ['individual', 'establishment', 'promoter', 'admin'].includes(value);
};

export const isEventStatus = (value: unknown): value is import('./index').EventStatus => {
  return typeof value === 'string' && ['draft', 'published', 'cancelled', 'completed'].includes(value);
};

export const isNotificationPriority = (value: unknown): value is import('./index').NotificationPriority => {
  return typeof value === 'string' && ['low', 'medium', 'high', 'urgent'].includes(value);
};

// Type validation functions with improved error messages
export const validateUserRole = (value: unknown): value is import('./index').UserRole => {
  return isUserRole(value);
};

export const validateEventStatus = (value: unknown): value is import('./index').EventStatus => {
  return isEventStatus(value);
};

// Migration helpers for transitioning existing code
export const migrateToMasterTypes = {
  // Convert old Profile to new UserProfile
  profile: (oldProfile: any): UserProfile => ({
    id: oldProfile.id,
    created_at: oldProfile.created_at || new Date().toISOString(),
    updated_at: oldProfile.updated_at,
    user_type: validateUserRole(oldProfile.user_type) ? oldProfile.user_type : 'individual',
    username: oldProfile.username,
    display_name: oldProfile.display_name,
    bio: oldProfile.bio,
    phone: oldProfile.phone,
    avatar_url: oldProfile.avatar_url,
    email_notifications: oldProfile.email_notifications ?? true,
    push_notifications: oldProfile.push_notifications ?? false
  }),
  
  // Convert old Establishment to new Establishment
  establishment: (oldEst: any): Establishment => ({
    id: oldEst.id,
    created_at: oldEst.created_at || new Date().toISOString(),
    updated_at: oldEst.updated_at,
    name: oldEst.name,
    address: oldEst.address,
    latitude: oldEst.latitude,
    longitude: oldEst.longitude,
    phone: oldEst.phone,
    website: oldEst.website,
    image_url: oldEst.image_url || oldEst.image,
    cocktail_count: oldEst.cocktail_count || oldEst.cocktailCount,
    distance: oldEst.distance
  }),
  
  // Convert old Event to new Event
  event: (oldEvent: any): Event => ({
    id: oldEvent.id,
    created_at: oldEvent.created_at || new Date().toISOString(),
    updated_at: oldEvent.updated_at,
    name: oldEvent.name,
    description: oldEvent.description,
    date: oldEvent.date,
    time: oldEvent.time,
    venue_id: oldEvent.venue_id || oldEvent.venueId,
    image_url: oldEvent.image_url || oldEvent.imageUrl,
    promotional_materials: oldEvent.promotional_materials || oldEvent.promotionalMaterials,
    status: validateEventStatus(oldEvent.status) ? oldEvent.status : 'draft',
    created_by: oldEvent.created_by,
    capacity: oldEvent.capacity,
    event_type: oldEvent.event_type,
    event_url: oldEvent.event_url,
    location_details: oldEvent.location_details || oldEvent.location,
    contact_info: oldEvent.contact_info || oldEvent.contact,
    custom_settings: oldEvent.custom_settings,
    is_public: oldEvent.is_public ?? true
  })
};
