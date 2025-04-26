
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Helper function to access tables with proper typing
export function fromTable<T = any>(tableName: string) {
  return supabase.from(tableName);
}

// Export the client for convenience
export { supabase };

// Type helper for event notification schedules
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

// Type helper for subscription settings
export type SubscriptionSettings = {
  id?: string;
  user_id: string;
  location_sharing: boolean;
  notification_radius: number;
  created_at?: string;
  updated_at?: string;
};
