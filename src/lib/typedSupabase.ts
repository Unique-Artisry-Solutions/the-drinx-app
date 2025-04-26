import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

// Define the types for commonly used tables
export type EventNotificationSchedule = Database['public']['Tables']['event_notification_schedules']['Row'];
export type SubscriptionSettings = Database['public']['Tables']['subscription_settings']['Row'];

// Helper function to get the current user ID
export async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id;
}

// Type-safe database access functions
export function eventNotificationSchedules() {
  return supabase.from('event_notification_schedules')
    .returns<EventNotificationSchedule>();
}

export function subscriptionSettings() {
  return supabase.from('subscription_settings')
    .returns<SubscriptionSettings>();
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
export function fromTable<T = any>(tableName: string) {
  return supabase.from(tableName);
}

// Export the client for convenience
export { supabase };

// Re-export types from SubscriptionTypes.ts for convenience
export type { Database };
