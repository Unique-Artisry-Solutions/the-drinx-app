
import { supabase } from '@/lib/supabase';

export interface EventVisibilitySettings {
  isPublic: boolean;
  followerOnlyAccess?: boolean;
  premiumFollowerAccess?: boolean;
  specificTierAccess?: string[];
  earlyAccess?: {
    enabled: boolean;
    daysEarly: number;
    forFollowerTypes: ('free' | 'premium' | 'specific_tiers')[];
    specificTiers?: string[];
  };
}

export interface EventAccessInfo {
  hasAccess: boolean;
  accessType: 'public' | 'follower' | 'premium_follower' | 'tier_specific' | 'early_access';
  reason?: string;
  requiresFollowing?: boolean;
  availableAt?: string;
}

class EventVisibilityService {
  async setEventVisibility(eventId: string, settings: EventVisibilitySettings): Promise<void> {
    const { error } = await supabase
      .from('events')
      .update({
        is_public: settings.isPublic,
        custom_settings: {
          ...settings,
          visibility_type: this.getVisibilityType(settings)
        }
      })
      .eq('id', eventId);

    if (error) throw error;
  }

  async checkEventAccess(
    eventId: string, 
    userId?: string
  ): Promise<EventAccessInfo> {
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('is_public, custom_settings, created_by, date')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return { hasAccess: false, accessType: 'public', reason: 'Event not found' };
    }

    // If event is public, everyone has access
    if (event.is_public) {
      return { hasAccess: true, accessType: 'public' };
    }

    // If no user, check if public access is available
    if (!userId) {
      return { 
        hasAccess: false, 
        accessType: 'public', 
        reason: 'Sign in required',
        requiresFollowing: true 
      };
    }

    // If user is the event creator, they always have access
    if (event.created_by === userId) {
      return { hasAccess: true, accessType: 'public' };
    }

    const settings = event.custom_settings as EventVisibilitySettings;
    if (!settings) {
      return { hasAccess: false, accessType: 'public', reason: 'Access restricted' };
    }

    // Check early access
    if (settings.earlyAccess?.enabled) {
      const eventDate = new Date(event.date);
      const earlyAccessDate = new Date(eventDate);
      earlyAccessDate.setDate(eventDate.getDate() - settings.earlyAccess.daysEarly);
      
      if (new Date() >= earlyAccessDate) {
        const earlyAccessResult = await this.checkEarlyAccess(
          event.created_by, 
          userId, 
          settings.earlyAccess
        );
        
        if (earlyAccessResult.hasAccess) {
          return earlyAccessResult;
        }
      }
    }

    // Check follower status
    const followerInfo = await this.getFollowerInfo(event.created_by, userId);

    // Check follower-only access
    if (settings.followerOnlyAccess && !followerInfo.isFollowing) {
      return {
        hasAccess: false,
        accessType: 'follower',
        reason: 'Must be following this promoter',
        requiresFollowing: true
      };
    }

    // Check premium follower access
    if (settings.premiumFollowerAccess) {
      if (!followerInfo.isFollowing) {
        return {
          hasAccess: false,
          accessType: 'premium_follower',
          reason: 'Must be a premium follower',
          requiresFollowing: true
        };
      }
      
      if (!followerInfo.isPremium) {
        return {
          hasAccess: false,
          accessType: 'premium_follower',
          reason: 'Premium follower access required'
        };
      }
    }

    // Check specific tier access
    if (settings.specificTierAccess?.length) {
      if (!followerInfo.isFollowing) {
        return {
          hasAccess: false,
          accessType: 'tier_specific',
          reason: 'Must be following this promoter',
          requiresFollowing: true
        };
      }

      if (!followerInfo.tierId || !settings.specificTierAccess.includes(followerInfo.tierId)) {
        return {
          hasAccess: false,
          accessType: 'tier_specific',
          reason: 'Specific tier access required'
        };
      }
    }

    // If all checks pass, user has access
    return {
      hasAccess: true,
      accessType: followerInfo.isPremium ? 'premium_follower' : 'follower'
    };
  }

  private async checkEarlyAccess(
    promoterId: string,
    userId: string,
    earlyAccess: NonNullable<EventVisibilitySettings['earlyAccess']>
  ): Promise<EventAccessInfo> {
    const followerInfo = await this.getFollowerInfo(promoterId, userId);

    // Check if user qualifies for early access
    const qualifiesForEarly = earlyAccess.forFollowerTypes.some(type => {
      switch (type) {
        case 'free':
          return followerInfo.isFollowing && !followerInfo.isPremium;
        case 'premium':
          return followerInfo.isPremium;
        case 'specific_tiers':
          return followerInfo.tierId && earlyAccess.specificTiers?.includes(followerInfo.tierId);
        default:
          return false;
      }
    });

    if (qualifiesForEarly) {
      return { hasAccess: true, accessType: 'early_access' };
    }

    return { hasAccess: false, accessType: 'early_access', reason: 'Early access not available' };
  }

  private async getFollowerInfo(promoterId: string, userId: string) {
    const { data: follower } = await supabase
      .from('promoter_followers')
      .select('tier_id, follow_status')
      .eq('promoter_id', promoterId)
      .eq('subscriber_id', userId)
      .eq('follow_status', 'active')
      .maybeSingle();

    return {
      isFollowing: !!follower,
      isPremium: !!follower?.tier_id,
      tierId: follower?.tier_id || null
    };
  }

  private getVisibilityType(settings: EventVisibilitySettings): string {
    if (settings.isPublic) return 'public';
    if (settings.specificTierAccess?.length) return 'tier_specific';
    if (settings.premiumFollowerAccess) return 'premium_only';
    if (settings.followerOnlyAccess) return 'follower_only';
    return 'private';
  }

  async getVisibleEvents(userId?: string, promoterId?: string) {
    let query = supabase
      .from('events')
      .select(`
        id,
        name,
        date,
        time,
        description,
        image_url,
        created_by,
        is_public,
        custom_settings,
        status
      `)
      .eq('status', 'published');

    if (promoterId) {
      query = query.eq('created_by', promoterId);
    }

    const { data: events, error } = await query;
    if (error) throw error;

    if (!userId) {
      // Return only public events for non-authenticated users
      return events.filter(event => event.is_public);
    }

    // Filter events based on access permissions
    const visibleEvents = [];
    for (const event of events) {
      const accessInfo = await this.checkEventAccess(event.id, userId);
      if (accessInfo.hasAccess) {
        visibleEvents.push({
          ...event,
          accessType: accessInfo.accessType
        });
      }
    }

    return visibleEvents;
  }
}

export const eventVisibilityService = new EventVisibilityService();
