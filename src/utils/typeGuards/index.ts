
/**
 * Type Guards Index - Central export for all type guard utilities
 */

// Core type guards
export * from './coreTypeGuards';

// Component-specific type guards
export * from './componentTypeGuards';

// Data structure type guards
export * from './dataTypeGuards';

// Re-export commonly used guards with aliases for convenience
export {
  isString as isValidString,
  isNumber as isValidNumber,
  isBoolean as isValidBoolean,
  isNonEmptyString as isValidNonEmptyString,
  isValidEmail,
  isValidUrl,
  isValidUserType,
  isValidEventStatus,
  isValidPaymentStatus
} from './coreTypeGuards';

export {
  isBaseComponentProps as isValidComponentProps,
  isBaseCardProps as isValidCardProps,
  isBaseFormFieldProps as isValidFormFieldProps,
  isBaseNavItemProps as isValidNavItemProps,
  isBaseModalProps as isValidModalProps,
  isBaseActionProps as isValidActionProps
} from './componentTypeGuards';

export {
  isBaseListItemData as isValidListItem,
  isBaseUserData as isValidUserData,
  isBaseEventData as isValidEventData,
  isBaseApiResponseData as isValidApiResponse,
  isBaseListResponseData as isValidListResponse
} from './dataTypeGuards';

// Utility functions for common validation patterns
export { validateWithGuard, validateArray } from './coreTypeGuards';
export { validateComponentProps, extractSafeProps } from './componentTypeGuards';
export { validateArrayItems, extractSafeApiData, extractSafeListData } from './dataTypeGuards';
