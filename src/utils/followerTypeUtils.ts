
import { Notification } from '@/types/notification';
import { FollowerPreferences } from '@/types/FollowerComponentTypes';

export function safeJsonToNotificationInterface(data: any): Notification {
  return {
    id: data.id || '',
    title: data.title || '',
    message: data.content || data.message || '',
    content: data.content || data.message || '',
    type: data.type || 'info',
    priority: data.priority || 'medium',
    timestamp: data.timestamp || Date.now(),
    created_at: data.created_at || new Date().toISOString(),
    read: data.read || false,
    is_read: data.is_read || false,
    location_based: data.location_based || false,
    coordinates: data.coordinates || undefined,
    target_radius: data.target_radius || undefined,
    metadata: data.metadata || {}
  };
}

export function validateNotificationData(data: any): boolean {
  return !!(
    data &&
    data.title &&
    (data.content || data.message) &&
    ['low', 'medium', 'high', 'urgent'].includes(data.priority)
  );
}

export function safeJsonToFollowerPreferences(data: any): FollowerPreferences {
  if (!data || typeof data !== 'object') {
    // Return default preferences if data is invalid
    return {
      events: true,
      promotions: true,
      generalUpdates: true,
      email: true,
      push: false,
      sms: false
    };
  }

  return {
    events: data.events !== false, // Default to true unless explicitly false
    promotions: data.promotions !== false,
    generalUpdates: data.generalUpdates !== false,
    email: data.email !== false,
    push: data.push === true, // Default to false unless explicitly true
    sms: data.sms === true
  };
}
