
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

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

// Type-safe database access functions
export function eventNotificationSchedules() {
  return supabase.from('notifications') // Use existing 'notifications' table instead
    .select('*');
}

export function subscriptionSettings() {
  return supabase.from('profiles') // Use 'profiles' table for subscription settings
    .select('*');
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

// Generic helper for other tables
export function fromTable<T = any>(tableName: keyof Database['public']['Tables'] | keyof Database['public']['Views']) {
  return supabase.from(tableName);
}

// Export the client for convenience
export { supabase };

// Re-export types from SubscriptionTypes.ts for convenience
export type { Database };
