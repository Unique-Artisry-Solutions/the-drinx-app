
/**
 * Render safety utilities for preventing component crashes
 */

import React from 'react';

// Safe array rendering with error boundaries
export const safeMap = <T, R>(
  array: T[] | null | undefined,
  mapFn: (item: T, index: number) => R,
  fallback: R[] = []
): R[] => {
  try {
    if (!Array.isArray(array)) return fallback;
    return array.map(mapFn);
  } catch (error) {
    console.warn('safeMap error:', error);
    return fallback;
  }
};

// Safe conditional rendering
export const safeRender = (
  condition: any,
  component: React.ReactNode,
  fallback: React.ReactNode = null
): React.ReactNode => {
  try {
    return condition ? component : fallback;
  } catch (error) {
    console.warn('safeRender error:', error);
    return fallback;
  }
};

// Safe string interpolation
export const safeTemplate = (
  template: string,
  values: Record<string, any>,
  fallback = 'Data unavailable'
): string => {
  try {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      const value = values[key];
      return value !== undefined && value !== null ? String(value) : match;
    });
  } catch (error) {
    console.warn('safeTemplate error:', error);
    return fallback;
  }
};

// Safe numeric operations
export const safeCalculation = <T>(
  calculation: () => T,
  fallback: T
): T => {
  try {
    const result = calculation();
    return (typeof result === 'number' && (isNaN(result) || !isFinite(result))) ? fallback : result;
  } catch (error) {
    console.warn('safeCalculation error:', error);
    return fallback;
  }
};

// Safe date formatting
export const safeFormatDate = (
  date: any,
  options?: Intl.DateTimeFormatOptions,
  fallback = 'Invalid date'
): string => {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return fallback;
    return dateObj.toLocaleDateString(undefined, options);
  } catch (error) {
    console.warn('safeFormatDate error:', error);
    return fallback;
  }
};

// Safe URL generation
export const safeUrl = (
  baseUrl: string,
  params: Record<string, any> = {},
  fallback = '#'
): string => {
  try {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
    return url.toString();
  } catch (error) {
    console.warn('safeUrl error:', error);
    return fallback;
  }
};

// Safe component key generation
export const safeKey = (
  item: any,
  index: number,
  idField = 'id'
): string => {
  try {
    if (item && typeof item === 'object' && item[idField]) {
      return String(item[idField]);
    }
    return `item-${index}`;
  } catch (error) {
    console.warn('safeKey error:', error);
    return `fallback-${index}`;
  }
};
