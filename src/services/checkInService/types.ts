
/**
 * Consolidated check-in types - single source of truth
 */

// Base context interface
export interface BaseCheckInContext {
  entityId: string;
  entityName: string;
  locationData?: {
    latitude: number;
    longitude: number;
  };
  additionalData?: Record<string, any>;
}

// Establishment-specific context
export interface EstablishmentCheckInContext extends BaseCheckInContext {
  type: 'establishment';
}

// Bar crawl-specific context
export interface BarCrawlCheckInContext extends BaseCheckInContext {
  type: 'bar_crawl';
}

// Swig circuit-specific context
export interface SwigCircuitCheckInContext extends BaseCheckInContext {
  type: 'swig_circuit';
  additionalData: {
    establishment_id: string;
    establishment_name: string;
  };
}

// Union type for all check-in contexts - FIXED to include all types
export type CheckInContext = 
  | EstablishmentCheckInContext 
  | BarCrawlCheckInContext 
  | SwigCircuitCheckInContext;

// Check-in options
export interface CheckInOptions {
  rating?: number | null;
  note?: string;
  establishmentName?: string;
}

// Check-in result interface
export interface CheckInResult {
  success: boolean;
  message: string;
  pointsEarned?: number;
  transaction?: any;
}

// History filter options
export interface HistoryFilterOptions {
  type?: 'establishment' | 'bar_crawl' | 'swig_circuit';
  limit?: number;
  offset?: number;
}

// Type guards for runtime validation
export function isEstablishmentContext(context: CheckInContext): context is EstablishmentCheckInContext {
  return context.type === 'establishment';
}

export function isBarCrawlContext(context: CheckInContext): context is BarCrawlCheckInContext {
  return context.type === 'bar_crawl';
}

export function isSwigCircuitContext(context: CheckInContext): context is SwigCircuitCheckInContext {
  return context.type === 'swig_circuit';
}
