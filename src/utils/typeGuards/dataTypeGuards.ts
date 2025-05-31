
/**
 * Type guards for data structures and API responses
 */

import { 
  BaseListItemData, 
  BaseUserData, 
  BaseEventData, 
  BaseApiResponseData,
  BaseListResponseData 
} from '@/types/shared/BaseInterfaces';
import { isString, isBoolean, isObject, isArray, isValidUserType, isValidEventStatus } from './coreTypeGuards';

// ===== DATA STRUCTURE TYPE GUARDS =====
export const isBaseListItemData = (value: unknown): value is BaseListItemData => {
  if (!isObject(value)) return false;
  
  const item = value as Record<string, unknown>;
  
  // Required fields
  if (!isString(item.id) || !isString(item.name)) return false;
  
  // Optional fields
  if ('description' in item && item.description !== undefined && !isString(item.description)) return false;
  if ('isActive' in item && item.isActive !== undefined && !isBoolean(item.isActive)) return false;
  if ('createdAt' in item && item.createdAt !== undefined && !isString(item.createdAt)) return false;
  if ('updatedAt' in item && item.updatedAt !== undefined && !isString(item.updatedAt)) return false;
  
  return true;
};

export const isBaseUserData = (value: unknown): value is BaseUserData => {
  if (!isBaseListItemData(value)) return false;
  if (!isObject(value)) return false;
  
  const user = value as Record<string, unknown>;
  
  // Required fields
  if (!isString(user.email) || !isValidUserType(user.userType)) return false;
  
  // Optional fields
  if ('avatar' in user && user.avatar !== undefined && !isString(user.avatar)) return false;
  if ('isVerified' in user && user.isVerified !== undefined && !isBoolean(user.isVerified)) return false;
  if ('lastActiveAt' in user && user.lastActiveAt !== undefined && !isString(user.lastActiveAt)) return false;
  
  return true;
};

export const isBaseEventData = (value: unknown): value is BaseEventData => {
  if (!isBaseListItemData(value)) return false;
  if (!isObject(value)) return false;
  
  const event = value as Record<string, unknown>;
  
  // Required fields
  if (!isString(event.date) || !isValidEventStatus(event.status)) return false;
  
  // Optional fields
  if ('time' in event && event.time !== undefined && !isString(event.time)) return false;
  if ('location' in event && event.location !== undefined && !isString(event.location)) return false;
  if ('imageUrl' in event && event.imageUrl !== undefined && !isString(event.imageUrl)) return false;
  
  return true;
};

export const isBaseApiResponseData = <T = any>(value: unknown): value is BaseApiResponseData<T> => {
  if (!isObject(value)) return false;
  
  const response = value as Record<string, unknown>;
  
  // Required fields
  if (!('data' in response) || !isBoolean(response.success)) return false;
  
  // Optional fields
  if ('message' in response && response.message !== undefined && !isString(response.message)) return false;
  if ('error' in response && response.error !== undefined && !isString(response.error)) return false;
  
  return true;
};

export const isBaseListResponseData = <T = any>(value: unknown): value is BaseListResponseData<T> => {
  if (!isBaseApiResponseData(value)) return false;
  if (!isObject(value)) return false;
  
  const response = value as Record<string, unknown>;
  
  // Data should be an array for list responses
  if (!isArray(response.data)) return false;
  
  // Optional pagination
  if ('pagination' in response && response.pagination !== undefined) {
    const pagination = response.pagination;
    if (!isObject(pagination)) return false;
    
    const paginationObj = pagination as Record<string, unknown>;
    if (!('currentPage' in paginationObj) || !('totalPages' in paginationObj) || 
        !('totalItems' in paginationObj) || !('pageSize' in paginationObj)) {
      return false;
    }
  }
  
  return true;
};

// ===== ARRAY VALIDATION =====
export const isArrayOfType = <T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T
): value is T[] => {
  if (!isArray(value)) return false;
  return value.every(itemGuard);
};

export const validateArrayItems = <T>(
  value: unknown,
  itemGuard: (item: unknown) => item is T,
  errorPrefix: string = 'Array validation failed'
): T[] => {
  if (!isArray(value)) {
    throw new Error(`${errorPrefix}: Expected array, got ${typeof value}`);
  }
  
  const validatedItems: T[] = [];
  value.forEach((item, index) => {
    if (!itemGuard(item)) {
      throw new Error(`${errorPrefix}: Invalid item at index ${index}`);
    }
    validatedItems.push(item);
  });
  
  return validatedItems;
};

// ===== SAFE DATA EXTRACTORS =====
export const extractSafeApiData = <T>(
  response: unknown,
  dataGuard: (data: unknown) => data is T
): T | null => {
  if (!isBaseApiResponseData(response)) {
    console.error('Invalid API response format:', response);
    return null;
  }
  
  if (!response.success) {
    console.error('API response indicates failure:', response.error || response.message);
    return null;
  }
  
  if (!dataGuard(response.data)) {
    console.error('API response data validation failed:', response.data);
    return null;
  }
  
  return response.data;
};

export const extractSafeListData = <T>(
  response: unknown,
  itemGuard: (item: unknown) => item is T
): T[] => {
  if (!isBaseListResponseData(response)) {
    console.error('Invalid list response format:', response);
    return [];
  }
  
  if (!response.success) {
    console.error('List response indicates failure:', response.error || response.message);
    return [];
  }
  
  try {
    return validateArrayItems(response.data, itemGuard, 'List data validation failed');
  } catch (error) {
    console.error('List data validation error:', error);
    return [];
  }
};
