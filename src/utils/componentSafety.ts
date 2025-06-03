
/**
 * Component Safety Layer
 * Type guards, safe getters, and adapters for reliable component rendering
 */

import { User, Establishment, Event, Cocktail, BarCrawl } from '@/types/CoreTypes';
import { EventAttendee, EventTicketType } from '@/types/EventTypes';

// =============================================================================
// TYPE GUARDS
// =============================================================================

export const isValidUser = (user: any): user is User => {
  return user && typeof user === 'object' && typeof user.id === 'string';
};

export const isValidEstablishment = (establishment: any): establishment is Establishment => {
  return establishment && 
         typeof establishment === 'object' && 
         typeof establishment.id === 'string' &&
         typeof establishment.name === 'string' &&
         typeof establishment.address === 'string' &&
         typeof establishment.latitude === 'number' &&
         typeof establishment.longitude === 'number';
};

export const isValidEvent = (event: any): event is Event => {
  return event && 
         typeof event === 'object' && 
         typeof event.id === 'string' &&
         typeof event.name === 'string' &&
         typeof event.date === 'string' &&
         typeof event.time === 'string';
};

export const isValidCocktail = (cocktail: any): cocktail is Cocktail => {
  return cocktail && 
         typeof cocktail === 'object' && 
         typeof cocktail.id === 'string' &&
         typeof cocktail.name === 'string' &&
         (typeof cocktail.price === 'number' || typeof cocktail.price === 'string');
};

export const isValidBarCrawl = (barCrawl: any): barCrawl is BarCrawl => {
  return barCrawl && 
         typeof barCrawl === 'object' && 
         typeof barCrawl.id === 'string' &&
         typeof barCrawl.name === 'string' &&
         typeof barCrawl.organizer === 'string' &&
         typeof barCrawl.startDate === 'string' &&
         typeof barCrawl.endDate === 'string';
};

export const isValidEventAttendee = (attendee: any): attendee is EventAttendee => {
  return attendee && 
         typeof attendee === 'object' && 
         typeof attendee.event_id === 'string' &&
         typeof attendee.status === 'string';
};

// =============================================================================
// SAFE GETTERS WITH DEFAULTS
// =============================================================================

export const safeGetUser = (user: any): User => {
  if (isValidUser(user)) {
    return {
      id: user.id,
      name: user.name || 'Unknown User',
      display_name: user.display_name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      avatar_url: user.avatar_url,
      bio: user.bio,
      phone: user.phone,
      user_type: user.user_type || 'individual',
      email_notifications: user.email_notifications ?? true,
      push_notifications: user.push_notifications ?? true,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }

  return {
    id: user?.id || 'unknown',
    name: 'Unknown User',
    user_type: 'individual',
    email_notifications: true,
    push_notifications: true
  };
};

export const safeGetEstablishment = (establishment: any): Establishment => {
  if (isValidEstablishment(establishment)) {
    return {
      id: establishment.id,
      name: establishment.name,
      address: establishment.address,
      latitude: establishment.latitude,
      longitude: establishment.longitude,
      phone: establishment.phone,
      website: establishment.website,
      bio: establishment.bio,
      description: establishment.description,
      image: establishment.image,
      image_url: establishment.image_url,
      cocktail_count: establishment.cocktail_count || establishment.cocktailCount || 0,
      cocktailCount: establishment.cocktailCount || establishment.cocktail_count || 0,
      distance: establishment.distance,
      distance_in_miles: establishment.distance_in_miles,
      distanceValue: establishment.distanceValue,
      created_at: establishment.created_at,
      updated_at: establishment.updated_at
    };
  }

  return {
    id: establishment?.id || 'unknown',
    name: establishment?.name || 'Unknown Establishment',
    address: establishment?.address || 'Address not available',
    latitude: establishment?.latitude || 0,
    longitude: establishment?.longitude || 0,
    cocktail_count: 0,
    cocktailCount: 0
  };
};

export const safeGetEvent = (event: any): Event => {
  if (isValidEvent(event)) {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      created_by: event.created_by,
      venue_id: event.venue_id,
      image_url: event.image_url,
      promotional_materials: event.promotional_materials || [],
      status: event.status || 'draft',
      capacity: event.capacity,
      event_type: event.event_type,
      event_url: event.event_url,
      is_public: event.is_public ?? true,
      location_details: event.location_details,
      contact_info: event.contact_info,
      custom_settings: event.custom_settings || {},
      venue: event.venue,
      distance: event.distance,
      attendees: event.attendees,
      created_at: event.created_at,
      updated_at: event.updated_at
    };
  }

  return {
    id: event?.id || 'unknown',
    name: event?.name || 'Unknown Event',
    date: event?.date || new Date().toISOString().split('T')[0],
    time: event?.time || '00:00',
    created_by: event?.created_by || 'unknown',
    status: 'draft',
    promotional_materials: [],
    custom_settings: {}
  };
};

export const safeGetCocktail = (cocktail: any): Cocktail => {
  if (isValidCocktail(cocktail)) {
    return {
      id: cocktail.id,
      name: cocktail.name,
      price: cocktail.price,
      description: cocktail.description,
      image_url: cocktail.image_url,
      ingredients: cocktail.ingredients,
      establishment_id: cocktail.establishment_id,
      establishment: cocktail.establishment,
      created_at: cocktail.created_at
    };
  }

  return {
    id: cocktail?.id || 'unknown',
    name: cocktail?.name || 'Unknown Cocktail',
    price: cocktail?.price || 0,
    establishment: cocktail?.establishment || 'Unknown Establishment'
  };
};

export const safeGetBarCrawl = (barCrawl: any): BarCrawl => {
  if (isValidBarCrawl(barCrawl)) {
    return {
      id: barCrawl.id,
      name: barCrawl.name,
      organizer: barCrawl.organizer,
      startDate: barCrawl.startDate,
      endDate: barCrawl.endDate,
      description: barCrawl.description,
      imageUrl: barCrawl.imageUrl,
      establishments: barCrawl.establishments || [],
      invitedUsers: barCrawl.invitedUsers || [],
      status: barCrawl.status || 'planned',
      created_at: barCrawl.created_at
    };
  }

  return {
    id: barCrawl?.id || 'unknown',
    name: barCrawl?.name || 'Unknown Bar Crawl',
    organizer: barCrawl?.organizer || 'Unknown Organizer',
    startDate: barCrawl?.startDate || new Date().toISOString().split('T')[0],
    endDate: barCrawl?.endDate || new Date().toISOString().split('T')[0],
    establishments: [],
    invitedUsers: [],
    status: 'planned'
  };
};

// =============================================================================
// COMPONENT-SPECIFIC TYPE ADAPTERS
// =============================================================================

export interface SafeEstablishmentCardProps {
  establishment: Establishment;
  distance?: string;
  cocktailCount?: number;
  onClick?: () => void;
}

export const adaptToEstablishmentCard = (establishment: any): SafeEstablishmentCardProps => {
  const safeEst = safeGetEstablishment(establishment);
  
  return {
    establishment: safeEst,
    distance: safeEst.distance || 
             (safeEst.distance_in_miles ? `${safeEst.distance_in_miles.toFixed(1)} mi` : undefined),
    cocktailCount: safeEst.cocktailCount || safeEst.cocktail_count || 0
  };
};

export interface SafeEventCardProps {
  event: Event;
  venue?: { id: string; name: string; address?: string };
  distance?: number;
  attendees?: { registered: number; checked_in?: number; capacity?: number };
}

export const adaptToEventCard = (event: any): SafeEventCardProps => {
  const safeEvent = safeGetEvent(event);
  
  return {
    event: safeEvent,
    venue: safeEvent.venue || (safeEvent.venue_id ? { 
      id: safeEvent.venue_id, 
      name: 'Unknown Venue' 
    } : undefined),
    distance: safeEvent.distance,
    attendees: safeEvent.attendees
  };
};

export interface SafeUserProfileProps {
  user: User;
  isCurrentUser?: boolean;
  showContactInfo?: boolean;
}

export const adaptToUserProfile = (user: any, isCurrentUser = false): SafeUserProfileProps => {
  return {
    user: safeGetUser(user),
    isCurrentUser,
    showContactInfo: isCurrentUser
  };
};

// =============================================================================
// ARRAY SAFETY HELPERS
// =============================================================================

export const safeArray = <T>(arr: any, validator: (item: any) => item is T): T[] => {
  if (!Array.isArray(arr)) return [];
  return arr.filter(validator);
};

export const safeEstablishmentArray = (establishments: any[]): Establishment[] => {
  return safeArray(establishments, isValidEstablishment);
};

export const safeEventArray = (events: any[]): Event[] => {
  return safeArray(events, isValidEvent);
};

export const safeCocktailArray = (cocktails: any[]): Cocktail[] => {
  return safeArray(cocktails, isValidCocktail);
};

export const safeUserArray = (users: any[]): User[] => {
  return safeArray(users, isValidUser);
};

// =============================================================================
// PROPERTY ACCESS SAFETY
// =============================================================================

export const safeAccess = <T>(obj: any, path: string, defaultValue: T): T => {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current !== undefined ? current : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const safeString = (value: any, defaultValue = ''): string => {
  return typeof value === 'string' ? value : defaultValue;
};

export const safeNumber = (value: any, defaultValue = 0): number => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

export const safeBoolean = (value: any, defaultValue = false): boolean => {
  return typeof value === 'boolean' ? value : defaultValue;
};

// =============================================================================
// COMPONENT RENDER GUARDS
// =============================================================================

export const withSafeProps = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  propValidators: Partial<Record<keyof T, (value: any) => boolean>>,
  fallbackComponent?: React.ComponentType<any>
) => {
  return (props: T) => {
    const isValid = Object.entries(propValidators).every(([key, validator]) => {
      const value = props[key as keyof T];
      return validator ? validator(value) : true;
    });

    if (!isValid && fallbackComponent) {
      const FallbackComponent = fallbackComponent;
      return <FallbackComponent />;
    }

    if (!isValid) {
      console.warn('Component received invalid props:', props);
      return null;
    }

    return <Component {...props} />;
  };
};
