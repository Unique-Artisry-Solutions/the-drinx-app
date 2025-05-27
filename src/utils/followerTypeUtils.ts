
import { Json } from '@/integrations/supabase/types';
import { NotificationInterface } from '@/types/notification';
import { DatabaseNotificationPreferences, FollowerNotificationPreferences } from '@/types/SubscriptionTypes';

// Safe type conversion utilities for follower system
export const safeJsonToFollowerPreferences = (json: Json): FollowerNotificationPreferences => {
  const defaultPrefs: FollowerNotificationPreferences = {
    events: true,
    discounts: true,
    updates: true,
    email_notifications: true,
    push_notifications: false,
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  };

  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return defaultPrefs;
  }

  const jsonObj = json as Record<string, any>;
  
  return {
    events: typeof jsonObj.events === 'boolean' ? jsonObj.events : defaultPrefs.events,
    discounts: typeof jsonObj.discounts === 'boolean' ? jsonObj.discounts : defaultPrefs.discounts,
    updates: typeof jsonObj.updates === 'boolean' ? jsonObj.updates : defaultPrefs.updates,
    email_notifications: typeof jsonObj.email_notifications === 'boolean' ? jsonObj.email_notifications : defaultPrefs.email_notifications,
    push_notifications: typeof jsonObj.push_notifications === 'boolean' ? jsonObj.push_notifications : defaultPrefs.push_notifications,
    quiet_hours: {
      enabled: typeof jsonObj.quiet_hours?.enabled === 'boolean' ? jsonObj.quiet_hours.enabled : defaultPrefs.quiet_hours.enabled,
      start: typeof jsonObj.quiet_hours?.start === 'string' ? jsonObj.quiet_hours.start : defaultPrefs.quiet_hours.start,
      end: typeof jsonObj.quiet_hours?.end === 'string' ? jsonObj.quiet_hours.end : defaultPrefs.quiet_hours.end
    }
  };
};

export const followerPreferencesToJson = (prefs: FollowerNotificationPreferences): Json => {
  return {
    events: prefs.events,
    discounts: prefs.discounts,
    updates: prefs.updates,
    email_notifications: prefs.email_notifications,
    push_notifications: prefs.push_notifications,
    quiet_hours: {
      enabled: prefs.quiet_hours.enabled,
      start: prefs.quiet_hours.start,
      end: prefs.quiet_hours.end
    }
  };
};

export const safeJsonToNotificationInterface = (dbRow: any): NotificationInterface => {
  return {
    id: dbRow.id,
    title: dbRow.title,
    content: dbRow.content,
    created_at: dbRow.created_at,
    is_read: dbRow.is_read,
    priority: dbRow.priority,
    metadata: safeJsonToMetadata(dbRow.metadata),
    location_based: dbRow.location_based,
    coordinates: dbRow.coordinates ? safeJsonToCoordinates(dbRow.coordinates) : undefined,
    target_radius: dbRow.target_radius
  };
};

const safeJsonToMetadata = (json: Json): { [key: string]: any; type?: string } => {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return {};
  }
  return json as { [key: string]: any; type?: string };
};

const safeJsonToCoordinates = (json: Json): { latitude: number; longitude: number } | undefined => {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return undefined;
  }
  
  const coords = json as any;
  if (typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
    return { latitude: coords.latitude, longitude: coords.longitude };
  }
  
  return undefined;
};

export const databaseNotificationPreferencesToJson = (prefs: DatabaseNotificationPreferences): Json => {
  return {
    id: prefs.id,
    user_id: prefs.user_id,
    category_id: prefs.category_id,
    is_enabled: prefs.is_enabled,
    channels: prefs.channels,
    metadata: prefs.metadata || {},
    created_at: prefs.created_at,
    updated_at: prefs.updated_at
  };
};
