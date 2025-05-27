
import { supabase } from '@/lib/supabase';
import { useEventVisibility } from '@/hooks/events/useEventVisibility';

export interface EventVisibilitySettings {
  isPublic: boolean;
  requiresFollowing: boolean;
  allowedTiers?: string[];
  earlyAccessHours?: number;
  accessType: 'public' | 'followers_only' | 'premium_only' | 'tier_specific' | 'early_access';
}

export interface EventAccessInfo {
  hasAccess: boolean;
  accessType?: 'public' | 'follower' | 'premium' | 'tier_specific';
  reason?: string;
  requiresFollowing?: boolean;
  availableTiers?: string[];
}

// Type guard for EventVisibilitySettings
function isEventVisibilitySettings(obj: any): obj is EventVisibilitySettings {
  return obj && 
         typeof obj === 'object' && 
         typeof obj.isPublic === 'boolean' &&
         typeof obj.requiresFollowing === 'boolean' &&
         typeof obj.accessType === 'string';
}

// Default settings
const defaultVisibilitySettings: EventVisibilitySettings = {
  isPublic: true,
  requiresFollowing: false,
  accessType: 'public'
};

class EventVisibilityService {
  async updateEventVisibility(eventId: string, settings: EventVisibilitySettings): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Verify user owns the event
    const { data: event } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', eventId)
      .single();

    if (!event || event.created_by !== user.id) {
      throw new Error('Unauthorized to modify this event');
    }

    const { error } = await supabase
      .from('events')
      .update({
        custom_settings: {
          ...event.custom_settings || {},
          visibility: settings
        }
      })
      .eq('id', eventId);

    if (error) throw error;
  }

  async getEventVisibilitySettings(eventId: string): Promise<EventVisibilitySettings> {
    const { data: event, error } = await supabase
      .from('events')
      .select('custom_settings')
      .eq('id', eventId)
      .single();

    if (error) throw error;

    const customSettings = event?.custom_settings as any;
    const visibilityData = customSettings?.visibility;

    // Safe type conversion with validation
    if (isEventVisibilitySettings(visibilityData)) {
      return visibilityData;
    }

    return defaultVisibilitySettings;
  }

  async checkEventAccess(eventId: string, userId?: string): Promise<EventAccessInfo> {
    // Get event details and visibility settings
    const { data: event, error } = await supabase
      .from('events')
      .select('custom_settings, is_public')
      .eq('id', eventId)
      .single();

    if (error) throw error;

    const customSettings = event?.custom_settings as any;
    const visibilitySettings = customSettings?.visibility;
    
    // Use safe type conversion
    const settings: EventVisibilitySettings = isEventVisibilitySettings(visibilitySettings) 
      ? visibilitySettings 
      : defaultVisibilitySettings;

    // If event is public, allow access
    if (settings.isPublic && settings.accessType === 'public') {
      return { hasAccess: true, accessType: 'public' };
    }

    // If no user, deny access for non-public events
    if (!userId) {
      return { 
        hasAccess: false, 
        reason: 'Login required to access this event',
        requiresFollowing: settings.requiresFollowing 
      };
    }

    // Get user's subscription to the event creator
    const { data: eventCreator } = await supabase
      .from('events')
      .select('created_by')
      .eq('id', eventId)
      .single();

    if (!eventCreator) {
      return { hasAccess: false, reason: 'Event not found' };
    }

    const { data: subscription } = await supabase
      .from('promoter_followers')
      .select('tier_id, follow_status')
      .eq('promoter_id', eventCreator.created_by)
      .eq('subscriber_id', userId)
      .eq('follow_status', 'active')
      .maybeSingle();

    // Check access based on settings
    switch (settings.accessType) {
      case 'followers_only':
        if (!subscription) {
          return { 
            hasAccess: false, 
            reason: 'Follow the promoter to access this event',
            requiresFollowing: true 
          };
        }
        return { hasAccess: true, accessType: 'follower' };

      case 'premium_only':
        if (!subscription || !subscription.tier_id) {
          return { 
            hasAccess: false, 
            reason: 'Premium subscription required',
            requiresFollowing: true 
          };
        }
        return { hasAccess: true, accessType: 'premium' };

      case 'tier_specific':
        if (!subscription || !subscription.tier_id || 
            !settings.allowedTiers?.includes(subscription.tier_id)) {
          return { 
            hasAccess: false, 
            reason: 'Specific tier subscription required',
            requiresFollowing: true,
            availableTiers: settings.allowedTiers 
          };
        }
        return { hasAccess: true, accessType: 'tier_specific' };

      case 'early_access':
        // Implement early access logic based on subscription level
        if (!subscription) {
          return { 
            hasAccess: false, 
            reason: 'Early access requires following the promoter',
            requiresFollowing: true 
          };
        }
        return { hasAccess: true, accessType: 'follower' };

      default:
        return { hasAccess: true, accessType: 'public' };
    }
  }

  async getVisibleEvents(userId?: string, promoterId?: string): Promise<any[]> {
    let query = supabase
      .from('events')
      .select('*');

    if (promoterId) {
      query = query.eq('created_by', promoterId);
    }

    const { data: events, error } = await query;
    if (error) throw error;

    if (!events) return [];

    // Filter events based on visibility and user access
    const visibleEvents = [];
    for (const event of events) {
      const accessInfo = await this.checkEventAccess(event.id, userId);
      if (accessInfo.hasAccess) {
        visibleEvents.push(event);
      }
    }

    return visibleEvents;
  }
}

export const eventVisibilityService = new EventVisibilityService();
