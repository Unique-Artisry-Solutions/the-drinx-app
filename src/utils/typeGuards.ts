
/**
 * Safely converts a JSON value to a Record<string, any>
 * Handles string JSON, JSON objects, and nullish values
 */
export const safeJsonToRecord = (jsonValue: any): Record<string, any> => {
  if (!jsonValue) {
    return {};
  }
  
  if (typeof jsonValue === 'string') {
    try {
      return JSON.parse(jsonValue);
    } catch (e) {
      console.error('Error parsing JSON string:', e);
      return {};
    }
  }
  
  if (typeof jsonValue === 'object') {
    return jsonValue as Record<string, any>;
  }
  
  return {};
};

/**
 * Converts a string value to the appropriate attendee status type
 * Ensures the status value is one of the valid options: 'registered', 'checked_in', 'cancelled', 'no_show'
 */
export const toAttendeeStatus = (status: string | undefined): 'registered' | 'checked_in' | 'cancelled' | 'no_show' => {
  if (!status) return 'registered';

  switch (status.toLowerCase()) {
    case 'checked_in':
    case 'checked-in': 
      return 'checked_in';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    case 'no_show':
    case 'no-show':
      return 'no_show';
    case 'registered':
    default:
      return 'registered';
  }
};

/**
 * Type-safe conversion from JSON to specific interface types
 * Used for complex types like EventLocation, EventContactInfo, etc.
 */
export const safeJsonToType = <T>(jsonValue: any, defaultValue: T): T => {
  const record = safeJsonToRecord(jsonValue);
  return { ...defaultValue, ...record };
};

/**
 * Helper functions for specific event-related types
 */
export const safeJsonToEventLocation = (jsonValue: any): Record<string, any> => {
  return safeJsonToRecord(jsonValue);
};

export const safeJsonToEventContactInfo = (jsonValue: any): Record<string, any> => {
  return safeJsonToRecord(jsonValue);
};
