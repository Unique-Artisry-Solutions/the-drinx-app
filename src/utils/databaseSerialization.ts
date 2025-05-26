
/**
 * Utilities for safely converting TypeScript interfaces to database-compatible JSON objects
 */

// Type guard to check if a value is JSON-serializable
export function isJsonSerializable(value: unknown): boolean {
  try {
    JSON.stringify(value);
    return true;
  } catch {
    return false;
  }
}

// Convert any object to a JSON-compatible format for Supabase
export function toJsonCompatible<T extends Record<string, any>>(obj: T): Record<string, any> {
  if (!obj || typeof obj !== 'object') {
    return {};
  }

  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) {
      continue; // Skip undefined values
    }
    
    if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result[key] = value;
    } else if (Array.isArray(value)) {
      result[key] = value.map(item => 
        typeof item === 'object' && item !== null ? toJsonCompatible(item) : item
      );
    } else if (typeof value === 'object') {
      result[key] = toJsonCompatible(value);
    } else if (value instanceof Date) {
      result[key] = value.toISOString();
    } else {
      // For any other type, convert to string as fallback
      result[key] = String(value);
    }
  }
  
  return result;
}

// Sanitize data specifically for analytics events
export function sanitizeAnalyticsData(data: Record<string, any>): Record<string, any> {
  const sanitized = toJsonCompatible(data);
  
  // Ensure we don't exceed reasonable size limits for database storage
  const jsonString = JSON.stringify(sanitized);
  if (jsonString.length > 10000) { // 10KB limit
    console.warn('Analytics data size exceeds recommended limit, truncating...');
    return {
      ...sanitized,
      _truncated: true,
      _originalSize: jsonString.length
    };
  }
  
  return sanitized;
}

// Type-safe database insertion helper
export function prepareDatabaseRecord<T extends Record<string, any>>(
  record: T,
  requiredFields: (keyof T)[]
): Record<string, any> | null {
  // Validate required fields
  for (const field of requiredFields) {
    if (record[field] === undefined || record[field] === null) {
      console.error(`Missing required field: ${String(field)}`);
      return null;
    }
  }
  
  // Convert to JSON-compatible format
  const jsonCompatible = toJsonCompatible(record);
  
  // Final validation
  if (!isJsonSerializable(jsonCompatible)) {
    console.error('Record is not JSON serializable after conversion');
    return null;
  }
  
  return jsonCompatible;
}
