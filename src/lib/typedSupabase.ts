
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Define standard types without relying on tables that don't exist
export type EventNotificationSchedule = {
  id: string;
  event_id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_for: string;
  location_based: boolean;
  coordinates?: { latitude: number; longitude: number };
  target_radius?: number;
  created_at: string;
  updated_at: string;
};

export type SubscriptionSettings = {
  id: string;
  user_id: string;
  location_sharing: boolean;
  notification_radius: number;
  created_at: string;
  updated_at: string;
};

// Helper function to get the current user ID
export async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id;
}

// Type-safe database access functions - using direct table access instead of custom tables
export function eventNotificationSchedules() {
  // Use notifications table instead of a custom table
  return supabase.from('notifications');
}

export function subscriptionSettings() {
  // Store subscription settings in profiles table
  return supabase.from('profiles');
}

export function swigCircuits() {
  return supabase.from('swig_circuits');
}

export function swigCircuitVenues() {
  return supabase.from('swig_circuit_venues');
}

export function swigCircuitDrinkHighlights() {
  return supabase.from('swig_circuit_drink_highlights');
}

export function swigCircuitPairings() {
  return supabase.from('swig_circuit_pairings');
}

export function swigCircuitTicketTiers() {
  return supabase.from('swig_circuit_ticket_tiers');
}

// Generic helper for other tables - use a more type-safe approach
export function fromTable<T = any>(tableName: keyof Database['public']['Tables'] | keyof Database['public']['Views']) {
  return supabase.from(tableName as string);
}

// Export the client for convenience
export { supabase };

// Re-export types from Database for convenience
export type { Database };
