
import { supabase } from '@/lib/supabase';
import { EventVisibilitySettings } from '@/types/SubscriptionTypes';

export interface EventAccessInfo {
  hasAccess: boolean;
  accessType?: 'public' | 'followers' | 'subscribers' | 'private';
  reason?: string;
  requiresFollowing?: boolean;
}

class EventVisibilityService {
  async checkEventAccess(eventId: string, userId?: string): Promise<EventAccessInfo> {
    try {
      // Get event details with visibility settings
      const { data: event, error } = await supabase
        .from('events')
        .select('*, custom_settings')
        .eq('id', eventId)
        .maybeSingle();

      if (error) throw error;
      if (!event) {
        return { hasAccess: false, reason: 'Event not found' };
      }

      // Parse visibility settings safely
      const visibilitySettings = this.parseVisibilitySettings(event.custom_settings);

      // Public events are always accessible
      if (visibilitySettings.isPublic) {
        return { 
          hasAccess: true, 
          accessType: 'public' 
        };
      }

      // Private events require user authentication
      if (!userId) {
        return { 
          hasAccess: false, 
          reason: 'Authentication required',
          requiresFollowing: visibilitySettings.requiresFollowing 
        };
      }

      // Check if user is the event creator
      if (event.created_by === userId) {
        return { hasAccess: true, accessType: 'private' };
      }

      // Check following/subscription requirements
      if (visibilitySettings.requiresFollowing) {
        const isFollowing = await this.checkUserFollowing(event.created_by, userId);
        if (!isFollowing) {
          return { 
            hasAccess: false, 
            reason: 'Following required',
            requiresFollowing: true,
            accessType: 'followers' 
          };
        }
      }

      if (visibilitySettings.requiresSubscription) {
        const hasSubscription = await this.checkUserSubscription(event.created_by, userId);
        if (!hasSubscription) {
          return { 
            hasAccess: false, 
            reason: 'Subscription required',
            accessType: 'subscribers' 
          };
        }
      }

      return { hasAccess: true, accessType: 'followers' };
    } catch (error) {
      console.error('Error checking event access:', error);
      return { hasAccess: false, reason: 'Access check failed' };
    }
  }

  private parseVisibilitySettings(customSettings: any): EventVisibilitySettings {
    // Handle null/undefined settings
    if (!customSettings) {
      return this.getDefaultVisibilitySettings();
    }

    // Handle different data types safely
    let settings: any = {};
    
    if (typeof customSettings === 'string') {
      try {
        settings = JSON.parse(customSettings);
      } catch {
        return this.getDefaultVisibilitySettings();
      }
    } else if (typeof customSettings === 'object' && customSettings !== null) {
      settings = customSettings;
    } else {
      return this.getDefaultVisibilitySettings();
    }

    // Extract visibility settings with defaults
    const visibilitySettings = settings.visibility || {};
    
    return {
      isPublic: visibilitySettings.isPublic ?? true,
      requiresFollowing: visibilitySettings.requiresFollowing ?? false,
      requiresSubscription: visibilitySettings.requiresSubscription ?? false,
      allowedTiers: Array.isArray(visibilitySettings.allowedTiers) ? visibilitySettings.allowedTiers : [],
      accessTokenRequired: visibilitySettings.accessTokenRequired ?? false
    };
  }

  private getDefaultVisibilitySettings(): EventVisibilitySettings {
    return {
      isPublic: true,
      requiresFollowing: false,
      requiresSubscription: false,
      allowedTiers: [],
      accessTokenRequired: false
    };
  }

  async getVisibleEvents(userId?: string, promoterId?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('events')
        .select('*, custom_settings');

      if (promoterId) {
        query = query.eq('created_by', promoterId);
      }

      const { data: events, error } = await query;
      if (error) throw error;

      if (!events) return [];

      // Filter events based on visibility
      const visibleEvents = [];
      for (const event of events) {
        const accessInfo = await this.checkEventAccess(event.id, userId);
        if (accessInfo.hasAccess) {
          visibleEvents.push(event);
        }
      }

      return visibleEvents;
    } catch (error) {
      console.error('Error getting visible events:', error);
      return [];
    }
  }

  async updateEventVisibility(eventId: string, settings: EventVisibilitySettings): Promise<void> {
    try {
      // Get current custom_settings
      const { data: event, error: fetchError } = await supabase
        .from('events')
        .select('custom_settings')
        .eq('id', eventId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Merge visibility settings into custom_settings
      let customSettings: any = {};
      
      if (event?.custom_settings) {
        if (typeof event.custom_settings === 'string') {
          try {
            customSettings = JSON.parse(event.custom_settings);
          } catch {
            customSettings = {};
          }
        } else if (typeof event.custom_settings === 'object') {
          customSettings = { ...event.custom_settings };
        }
      }

      customSettings.visibility = settings;

      const { error } = await supabase
        .from('events')
        .update({ custom_settings: customSettings })
        .eq('id', eventId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating event visibility:', error);
      throw error;
    }
  }

  private async checkUserFollowing(promoterId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('id')
        .eq('promoter_id', promoterId)
        .eq('subscriber_id', userId)
        .eq('follow_status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking user following:', error);
      return false;
    }
  }

  private async checkUserSubscription(promoterId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('promoter_followers')
        .select('tier_id')
        .eq('promoter_id', promoterId)
        .eq('subscriber_id', userId)
        .eq('follow_status', 'active')
        .not('tier_id', 'is', null)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking user subscription:', error);
      return false;
    }
  }
}

export const eventVisibilityService = new EventVisibilityService();
export type { EventVisibilitySettings };
