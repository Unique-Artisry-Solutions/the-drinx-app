
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
