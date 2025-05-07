import { EventLocation, EventContactInfo, ABTestResult, ReferralSource } from '@/types/EventTypes';
import { NotificationChannel } from '@/types/CampaignSegmentTypes';

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

/**
 * Safely converts a JSON string or object to a specified type with fallback defaults
 * @param input JSON string or already parsed object
 * @param defaultValue Default value if conversion fails
 * @returns Typed object
 */
export function safeJsonToType<T>(input: string | object | null | undefined, defaultValue: T): T {
  if (input === null || input === undefined) {
    return defaultValue;
  }
  
  try {
    if (typeof input === 'string') {
      return JSON.parse(input) as T;
    } else if (typeof input === 'object') {
      return input as T;
    }
    return defaultValue;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

/**
 * Safely converts a JSON string or object to a Record<string, any> with fallback
 * @param input JSON string or already parsed object
 * @param defaultValue Optional default value if conversion fails
 * @returns Record object
 */
export function safeJsonToRecord(
  input: string | object | null | undefined, 
  defaultValue: Record<string, any> = {}
): Record<string, any> {
  // Handle non-object primitives that might come from database
  if (input === null || input === undefined) {
    return defaultValue;
  }
  
  if (typeof input === 'number' || typeof input === 'boolean') {
    console.warn(`Attempted to convert non-object type (${typeof input}) to record:`, input);
    return defaultValue;
  }
  
  try {
    let result: Record<string, any>;
    
    if (typeof input === 'string') {
      try {
        result = JSON.parse(input);
        // Ensure the parsed result is an object
        if (typeof result !== 'object' || result === null || Array.isArray(result)) {
          console.warn('JSON parsing did not result in an object:', result);
          return defaultValue;
        }
      } catch (e) {
        console.warn('Failed to parse JSON string:', e);
        return defaultValue;
      }
    } else {
      // Input is already an object
      result = input as Record<string, any>;
    }
    
    return result;
  } catch (error) {
    console.error('Error in safeJsonToRecord:', error);
    return defaultValue;
  }
}

/**
 * Safely converts JSON data to EventLocation type
 * @param input JSON data to convert
 * @returns EventLocation object
 */
export function safeJsonToEventLocation(input: any): EventLocation {
  const defaultLocation: EventLocation = {
    address: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  };
  
  if (!input) return defaultLocation;
  
  try {
    let locationData: any;
    
    if (typeof input === 'string') {
      try {
        locationData = JSON.parse(input);
      } catch (e) {
        return defaultLocation;
      }
    } else if (typeof input === 'object') {
      locationData = input;
    } else {
      return defaultLocation;
    }
    
    // Ensure the object has all required fields
    return {
      address: locationData.address || '',
      city: locationData.city || '',
      state: locationData.state || '',
      zip: locationData.zip || '',
      country: locationData.country || ''
    };
  } catch (error) {
    console.error('Error converting to EventLocation:', error);
    return defaultLocation;
  }
}

/**
 * Safely converts JSON data to EventContactInfo type
 * @param input JSON data to convert
 * @returns EventContactInfo object
 */
export function safeJsonToEventContactInfo(input: any): EventContactInfo {
  const defaultContactInfo: EventContactInfo = {
    name: '',
    email: ''
  };
  
  if (!input) return defaultContactInfo;
  
  try {
    let contactData: any;
    
    if (typeof input === 'string') {
      try {
        contactData = JSON.parse(input);
      } catch (e) {
        return defaultContactInfo;
      }
    } else if (typeof input === 'object') {
      contactData = input;
    } else {
      return defaultContactInfo;
    }
    
    // Ensure the object has all required fields
    return {
      name: contactData.name || '',
      email: contactData.email || ''
    };
  } catch (error) {
    console.error('Error converting to EventContactInfo:', error);
    return defaultContactInfo;
  }
}

/**
 * Converts a string to valid attendee status or returns a fallback
 * @param status string value to convert
 * @param defaultStatus default value if conversion fails
 * @returns valid attendee status
 */
export function toAttendeeStatus(
  status: string | null | undefined,
  defaultStatus: 'registered' | 'checked_in' | 'cancelled' | 'no_show' = 'registered'
): 'registered' | 'checked_in' | 'cancelled' | 'no_show' {
  if (!status) return defaultStatus;
  
  const validStatuses = ['registered', 'checked_in', 'cancelled', 'no_show'];
  if (validStatuses.includes(status)) {
    return status as 'registered' | 'checked_in' | 'cancelled' | 'no_show';
  }
  
  return defaultStatus;
}

/**
 * Safely converts a JSON string or object to ABTestResult with fallback defaults
 * @param input JSON string or already parsed object
 * @returns ABTestResult object
 */
export function safeJsonToABTestResult(
  input: string | object | null | undefined
): ABTestResult {
  const defaultResult: ABTestResult = {
    variants: [],
    winner: null,
    variantA: undefined,
    variantB: undefined,
    improvement: 0,
    significantResult: false
  };
  
  if (!input) return defaultResult;
  
  try {
    let resultData: any;
    
    if (typeof input === 'string') {
      try {
        resultData = JSON.parse(input);
      } catch (e) {
        return defaultResult;
      }
    } else if (typeof input === 'object') {
      resultData = input;
    } else {
      return defaultResult;
    }
    
    return {
      variants: resultData.variants || [],
      winner: resultData.winner || null,
      variantA: resultData.variantA,
      variantB: resultData.variantB,
      improvement: resultData.improvement !== undefined ? resultData.improvement : 0,
      significantResult: resultData.significantResult || false
    };
  } catch (error) {
    console.error('Error converting to ABTestResult:', error);
    return defaultResult;
  }
}

/**
 * Adapter function to convert between backend and frontend ReferralSource formats
 * @param input Backend referral source data
 * @returns Frontend-compatible ReferralSource object
 */
export function adaptReferralSource(input: any): ReferralSource {
  if (!input) return { source: '', count: 0, percentage: 0, name: '', visits: 0, conversions: 0, conversionRate: 0 };
  
  // If data is already in frontend format
  if (input.source !== undefined) {
    return {
      source: input.source || '',
      count: input.count || 0,
      percentage: input.percentage || 0,
      name: input.source || '',
      visits: input.count || 0,
      conversions: 0,
      conversionRate: input.percentage || 0
    };
  }
  
  // If data is in backend format
  if (input.name !== undefined) {
    return {
      source: input.name || '',
      count: input.visits || 0,
      percentage: input.conversionRate || 0,
      name: input.name || '',
      visits: input.visits || 0,
      conversions: input.conversions || 0,
      conversionRate: input.conversionRate || 0
    };
  }
  
  // Default empty object with all properties
  return {
    source: '',
    count: 0,
    percentage: 0,
    name: '',
    visits: 0,
    conversions: 0,
    conversionRate: 0
  };
}

/**
 * Adapter function to convert ReferralSource objects to TicketAnalyticsData format
 * @param source ReferralSource object
 * @returns TicketAnalyticsData object
 */
export function adaptToTicketAnalyticsData(source: ReferralSource): any {
  return {
    name: source.name || source.source,
    typeName: source.name || source.source,
    sold: source.count || source.visits || 0,
    available: 0,
    revenue: 0,
    total: (source.count || source.visits || 0) * 2 // Just a mock calculation for total
  };
}

/**
 * Type guard function to check if a value is a valid notification channel
 * @param value Value to check
 * @returns Boolean indicating if value is a valid notification channel
 */
export function isNotificationChannel(value: string): value is NotificationChannel {
  return ['email', 'in_app', 'push'].includes(value);
}

/**
 * Safely convert string array to notification channels array
 * @param channels Array of strings to convert
 * @returns Array of valid notification channels
 */
export function toNotificationChannels(channels: string[]): NotificationChannel[] {
  return channels.filter(isNotificationChannel);
}
