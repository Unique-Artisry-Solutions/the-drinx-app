
import { Json } from '@/integrations/supabase/types';

export const safeJsonToRecord = (json: Json): Record<string, any> => {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  return {};
};

export const safeJsonToArray = (json: Json): any[] => {
  if (Array.isArray(json)) {
    return json;
  }
  return [];
};

export const safeJsonToString = (json: Json): string => {
  if (typeof json === 'string') {
    return json;
  }
  if (typeof json === 'object' && json !== null) {
    return JSON.stringify(json);
  }
  return '';
};

export const safeJsonToNumber = (json: Json): number => {
  if (typeof json === 'number') {
    return json;
  }
  if (typeof json === 'string') {
    const parsed = parseFloat(json);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};
