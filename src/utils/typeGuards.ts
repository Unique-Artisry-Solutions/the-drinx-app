
/**
 * Utility functions to handle type casting and validation
 */

import { Json } from '@/integrations/supabase/types';

/**
 * Type guard to check if value is a plain object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Safe conversion of JSON value to Record<string, any>
 */
export function safeJsonToRecord(value: Json | null | undefined): Record<string, any> {
  if (isObject(value)) {
    return value as Record<string, any>;
  }
  return {};
}

/**
 * Type guard for event attendee status
 */
export function isValidAttendeeStatus(status: string): status is "registered" | "checked_in" | "cancelled" | "no_show" {
  return ["registered", "checked_in", "cancelled", "no_show"].includes(status);
}

/**
 * Safe conversion of string to event attendee status
 */
export function toAttendeeStatus(status: string): "registered" | "checked_in" | "cancelled" | "no_show" {
  if (isValidAttendeeStatus(status)) {
    return status;
  }
  return "registered";
}

/**
 * Type guard for marketing campaign status
 */
export function isValidCampaignStatus(status: string): status is "draft" | "active" | "completed" | "cancelled" {
  return ["draft", "active", "completed", "cancelled"].includes(status);
}

/**
 * Safe conversion of string to marketing campaign status
 */
export function toCampaignStatus(status: string): "draft" | "active" | "completed" | "cancelled" {
  if (isValidCampaignStatus(status)) {
    return status;
  }
  return "draft";
}
