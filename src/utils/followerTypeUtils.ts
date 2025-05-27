
import { Notification } from '@/types/notification';

export function safeJsonToNotificationInterface(data: any): Notification {
  return {
    id: data.id || '',
    title: data.title || '',
    content: data.content || '',
    created_at: data.created_at || new Date().toISOString(),
    is_read: data.is_read || false,
    priority: data.priority || 'medium',
    metadata: data.metadata || {},
    location_based: data.location_based || false,
    coordinates: data.coordinates || undefined,
    target_radius: data.target_radius || undefined
  };
}

export function validateNotificationData(data: any): boolean {
  return !!(
    data &&
    data.title &&
    data.content &&
    ['low', 'medium', 'high', 'urgent'].includes(data.priority)
  );
}
