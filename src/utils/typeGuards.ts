
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
