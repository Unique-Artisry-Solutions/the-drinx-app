
import { supabase } from '@/integrations/supabase/client';
import { EventVisibilitySettings, EventAccessInfo } from '@/types/EventVisibilityTypes';
import type { Json } from '@/integrations/supabase/types';

class EventVisibilityServiceClass {
  async checkEventAccess(eventId: string, userId?: string): Promise<EventAccessInfo> {
    try {
      const { data: event, error } = await supabase
        .from('events')
        .select('visibility, custom_settings')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      if (!event) throw new Error('Event not found');

      // Parse custom settings safely
      let settings: EventVisibilitySettings = {
        isPrivate: false,
        requiresFollowing: false,
        allowedTiers: [],
        guestListOnly: false
      };

      if (event.custom_settings) {
        try {
          const parsedSettings = typeof event.custom_settings === 'string' 
            ? JSON.parse(event.custom_settings) 
            : event.custom_settings;
          
          if (parsedSettings && typeof parsedSettings === 'object') {
            settings = { ...settings, ...parsedSettings };
          }
        } catch (e) {
          console.warn('Failed to parse custom settings:', e);
        }
      }

      // Check access based on visibility and settings
      if (event.visibility === 'public' && !settings.isPrivate) {
        return {
          hasAccess: true,
          accessType: 'public'
        };
      }

      if (settings.requiresFollowing && userId) {
        // Check if user follows the event creator
        const { data: eventData } = await supabase
          .from('events')
          .select('created_by')
          .eq('id', eventId)
          .single();

        if (eventData) {
          const { data: subscription } = await supabase
            .from('promoter_subscriptions')
            .select('*')
            .eq('subscriber_id', userId)
            .eq('promoter_id', eventData.created_by)
            .eq('status', 'active')
            .single();

          if (!subscription) {
            return {
              hasAccess: false,
              accessType: 'followers_only',
              reason: 'Must follow the promoter to access this event',
              requiresFollowing: true
            };
          }
        }
      }

      return {
        hasAccess: true,
        accessType: settings.requiresFollowing ? 'followers_only' : 'public'
      };
    } catch (error: any) {
      console.error('Error checking event access:', error);
      return {
        hasAccess: false,
        accessType: 'private',
        reason: 'Unable to verify access'
      };
    }
  }

  async getVisibleEvents(userId?: string, promoterId?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'active');

      if (promoterId) {
        query = query.eq('created_by', promoterId);
      }

      const { data: events, error } = await query;
      if (error) throw error;

      if (!userId) {
        // Return only public events for non-authenticated users
        return events?.filter(event => event.visibility === 'public') || [];
      }

      // Filter events based on access rules
      const visibleEvents = [];
      for (const event of events || []) {
        const accessInfo = await this.checkEventAccess(event.id, userId);
        if (accessInfo.hasAccess) {
          visibleEvents.push(event);
        }
      }

      return visibleEvents;
    } catch (error: any) {
      console.error('Error fetching visible events:', error);
      return [];
    }
  }

  async getEventVisibilitySettings(eventId: string): Promise<EventVisibilitySettings> {
    try {
      const { data: event, error } = await supabase
        .from('events')
        .select('visibility, custom_settings')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      if (!event) throw new Error('Event not found');

      // Default settings
      const defaultSettings: EventVisibilitySettings = {
        isPrivate: event.visibility === 'private',
        requiresFollowing: false,
        allowedTiers: [],
        guestListOnly: false
      };

      // Parse and merge custom settings
      if (event.custom_settings) {
        try {
          const parsedSettings = typeof event.custom_settings === 'string' 
            ? JSON.parse(event.custom_settings) 
            : event.custom_settings;
          
          if (parsedSettings && typeof parsedSettings === 'object') {
            return { ...defaultSettings, ...parsedSettings };
          }
        } catch (e) {
          console.warn('Failed to parse custom settings:', e);
        }
      }

      return defaultSettings;
    } catch (error: any) {
      console.error('Error fetching event visibility settings:', error);
      return {
        isPrivate: false,
        requiresFollowing: false,
        allowedTiers: [],
        guestListOnly: false
      };
    }
  }

  async updateEventVisibilitySettings(eventId: string, settings: EventVisibilitySettings): Promise<void> {
    try {
      const visibility = settings.isPrivate ? 'private' : 'public';
      
      // Convert settings to JSON safely
      const customSettings: Json = {
        isPrivate: settings.isPrivate,
        requiresFollowing: settings.requiresFollowing,
        allowedTiers: settings.allowedTiers,
        guestListOnly: settings.guestListOnly,
        ...(settings.customSettings || {})
      };

      const { error } = await supabase
        .from('events')
        .update({ 
          visibility,
          custom_settings: customSettings
        })
        .eq('id', eventId);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating event visibility settings:', error);
      throw error;
    }
  }
}

export const eventVisibilityService = new EventVisibilityServiceClass();
export type { EventVisibilitySettings, EventAccessInfo };
