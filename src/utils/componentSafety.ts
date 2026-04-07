
/**
 * Component safety utilities for preventing crashes from malformed data
 */

import { 
  User, 
  Establishment, 
  Event, 
  Cocktail, 
  SwigCircuit,
  EstablishmentCard,
  EventCard,
  UserProfile
} from '@/types/CoreTypes';

// Type guards for core entities
export const isValidUser = (user: any): user is User => {
  return user && 
    typeof user === 'object' && 
    typeof user.id === 'string' && 
    typeof user.name === 'string';
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
    typeof event.time === 'string' &&
    typeof event.created_by === 'string';
};

export const isValidCocktail = (cocktail: any): cocktail is Cocktail => {
  return cocktail && 
    typeof cocktail === 'object' && 
    typeof cocktail.id === 'string' && 
    typeof cocktail.name === 'string' &&
    (typeof cocktail.price === 'number' || typeof cocktail.price === 'string');
};

export const isValidSwigCircuit = (swigCircuit: any): swigCircuit is SwigCircuit => {
  return swigCircuit && 
    typeof swigCircuit === 'object' && 
    typeof swigCircuit.id === 'string' && 
    typeof swigCircuit.name === 'string' &&
    typeof swigCircuit.organizer === 'string' &&
    typeof swigCircuit.startDate === 'string' &&
    typeof swigCircuit.endDate === 'string' &&
    Array.isArray(swigCircuit.establishments);
};

// Safe getters with defaults
export const safeGetUser = (user: any): User => {
  if (isValidUser(user)) {
    return {
      id: user.id,
      name: user.name,
      email: user.email || '',
      display_name: user.display_name || user.name,
      username: user.username || user.name.toLowerCase().replace(/\s+/g, ''),
      avatar: user.avatar || user.avatar_url || '',
      avatar_url: user.avatar_url || user.avatar || '',
      bio: user.bio || '',
      phone: user.phone || '',
      user_type: user.user_type || 'individual',
      email_notifications: user.email_notifications ?? true,
      push_notifications: user.push_notifications ?? true,
      created_at: user.created_at,
      updated_at: user.updated_at
    };
  }
  
  return {
    id: 'unknown',
    name: 'Unknown User',
    email: '',
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
      phone: establishment.phone || '',
      website: establishment.website || '',
      bio: establishment.bio || '',
      description: establishment.description || establishment.bio || '',
      image: establishment.image || establishment.image_url || '',
      image_url: establishment.image_url || establishment.image || '',
      cocktail_count: establishment.cocktail_count || establishment.cocktailCount || 0,
      cocktailCount: establishment.cocktailCount || establishment.cocktail_count || 0,
      distance: establishment.distance || '',
      distance_in_miles: establishment.distance_in_miles || establishment.distanceValue || 0,
      distanceValue: establishment.distanceValue || establishment.distance_in_miles || 0,
      created_at: establishment.created_at,
      updated_at: establishment.updated_at
    };
  }
  
  return {
    id: 'unknown',
    name: 'Unknown Establishment',
    address: 'Address not available',
    latitude: 0,
    longitude: 0,
    cocktail_count: 0,
    cocktailCount: 0,
    distance: 'Unknown'
  };
};

export const safeGetEvent = (event: any): Event => {
  if (isValidEvent(event)) {
    return {
      id: event.id,
      name: event.name,
      description: event.description || '',
      date: event.date,
      time: event.time,
      created_by: event.created_by,
      venue_id: event.venue_id || '',
      image_url: event.image_url || '',
      promotional_materials: event.promotional_materials || [],
      status: event.status || 'draft',
      capacity: event.capacity || 0,
      event_type: event.event_type || '',
      event_url: event.event_url || '',
      is_public: event.is_public ?? true,
      location_details: event.location_details,
      contact_info: event.contact_info,
      custom_settings: event.custom_settings || {},
      venue: event.venue,
      distance: event.distance || 0,
      attendees: event.attendees || { registered: 0 },
      created_at: event.created_at,
      updated_at: event.updated_at
    };
  }
  
  return {
    id: 'unknown',
    name: 'Unknown Event',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '00:00',
    created_by: 'unknown',
    status: 'draft',
    is_public: false,
    attendees: { registered: 0 }
  };
};

export const safeGetCocktail = (cocktail: any): Cocktail => {
  if (isValidCocktail(cocktail)) {
    return {
      id: cocktail.id,
      name: cocktail.name,
      price: cocktail.price,
      description: cocktail.description || '',
      image_url: cocktail.image_url || '',
      ingredients: cocktail.ingredients || {},
      establishment_id: cocktail.establishment_id || '',
      establishment: cocktail.establishment || '',
      created_at: cocktail.created_at
    };
  }
  
  return {
    id: 'unknown',
    name: 'Unknown Cocktail',
    price: 0,
    establishment: 'Unknown Establishment'
  };
};

export const safeGetSwigCircuit = (swigCircuit: any): SwigCircuit => {
  if (isValidSwigCircuit(swigCircuit)) {
    return {
      id: swigCircuit.id,
      name: swigCircuit.name,
      organizer: swigCircuit.organizer,
      startDate: swigCircuit.startDate,
      endDate: swigCircuit.endDate,
      description: swigCircuit.description || '',
      imageUrl: swigCircuit.imageUrl || '',
      establishments: swigCircuit.establishments || [],
      invitedUsers: swigCircuit.invitedUsers || [],
      status: swigCircuit.status || 'planned',
      created_at: swigCircuit.created_at
    };
  }
  
  return {
    id: 'unknown',
    name: 'Unknown Bar Crawl',
    organizer: 'Unknown',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    establishments: [],
    status: 'planned'
  };
};

// Component-specific adapters
export const adaptToEstablishmentCard = (establishment: any): EstablishmentCard => {
  const safe = safeGetEstablishment(establishment);
  return {
    id: safe.id,
    name: safe.name,
    address: safe.address,
    cocktailCount: safe.cocktailCount,
    image: safe.image,
    distance: safe.distance
  };
};

export const adaptToEventCard = (event: any): EventCard => {
  const safe = safeGetEvent(event);
  return {
    id: safe.id,
    name: safe.name,
    date: safe.date,
    image_url: safe.image_url,
    description: safe.description,
    venue: safe.venue
  };
};

export const adaptToUserProfile = (user: any): UserProfile => {
  const safe = safeGetUser(user);
  return {
    id: safe.id,
    name: safe.name,
    avatar: safe.avatar,
    bio: safe.bio,
    user_type: safe.user_type
  };
};

// Array safety utilities
export const safeEstablishmentArray = (establishments: any[]): Establishment[] => {
  if (!Array.isArray(establishments)) return [];
  return establishments
    .filter(est => est && typeof est === 'object')
    .map(est => safeGetEstablishment(est))
    .filter(est => est.id !== 'unknown');
};

export const safeEventArray = (events: any[]): Event[] => {
  if (!Array.isArray(events)) return [];
  return events
    .filter(event => event && typeof event === 'object')
    .map(event => safeGetEvent(event))
    .filter(event => event.id !== 'unknown');
};

export const safeUserArray = (users: any[]): User[] => {
  if (!Array.isArray(users)) return [];
  return users
    .filter(user => user && typeof user === 'object')
    .map(user => safeGetUser(user))
    .filter(user => user.id !== 'unknown');
};

export const safeCocktailArray = (cocktails: any[]): Cocktail[] => {
  if (!Array.isArray(cocktails)) return [];
  return cocktails
    .filter(cocktail => cocktail && typeof cocktail === 'object')
    .map(cocktail => safeGetCocktail(cocktail))
    .filter(cocktail => cocktail.id !== 'unknown');
};

export const safeSwigCircuitArray = (swigCircuits: any[]): SwigCircuit[] => {
  if (!Array.isArray(swigCircuits)) return [];
  return swigCircuits
    .filter(swigCircuit => swigCircuit && typeof swigCircuit === 'object')
    .map(swigCircuit => safeGetSwigCircuit(swigCircuit))
    .filter(swigCircuit => swigCircuit.id !== 'unknown');
};

// Property access safety
export const safeGet = <T>(obj: any, path: string, defaultValue: T): T => {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current == null || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current !== undefined ? current : defaultValue;
  } catch (error) {
    console.warn(`safeGet error for path ${path}:`, error);
    return defaultValue;
  }
};

// String safety
export const safeString = (value: any, fallback = ''): string => {
  if (typeof value === 'string') return value;
  if (value == null) return fallback;
  try {
    return String(value);
  } catch {
    return fallback;
  }
};

// Number safety
export const safeNumber = (value: any, fallback = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) ? parsed : fallback;
  }
  return fallback;
};

// Boolean safety
export const safeBoolean = (value: any, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

// Date safety
export const safeDate = (value: any, fallback?: Date): Date => {
  try {
    if (value instanceof Date) return value;
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? (fallback || new Date()) : date;
    }
    return fallback || new Date();
  } catch {
    return fallback || new Date();
  }
};

// Error boundary helpers
export const withErrorBoundary = <T>(
  operation: () => T,
  fallback: T,
  errorMessage?: string
): T => {
  try {
    return operation();
  } catch (error) {
    if (errorMessage) {
      console.warn(errorMessage, error);
    }
    return fallback;
  }
};
