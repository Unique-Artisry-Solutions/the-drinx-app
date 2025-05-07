
import { EventLocation, EventContactInfo } from '@/types/EventTypes';

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
  return safeJsonToType<Record<string, any>>(input, defaultValue);
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
