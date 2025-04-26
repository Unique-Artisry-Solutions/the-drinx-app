
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Re-export types from supabase.ts to avoid duplication
export type { CustomDatabase } from '@/lib/supabase';

// Export type helpers for common tables
export type EventNotificationSchedule = {
  id?: string;
  event_id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduled_for: string;
  location_based: boolean;
  coordinates?: { latitude: number; longitude: number } | null;
  target_radius?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type SubscriptionSettings = {
  id?: string;
  user_id: string;
  location_sharing: boolean;
  notification_radius: number;
  created_at?: string;
  updated_at?: string;
};

// Helper function to access tables with proper typing
export function fromTable<T = any>(tableName: string) {
  return supabase.from(tableName);
}

// Helper for getting the current user ID
export async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id;
}

// Export specific table helpers
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

// Export the client for convenience
export { supabase };
