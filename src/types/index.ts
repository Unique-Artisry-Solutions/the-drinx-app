
// Types Index - Phase 9C Consolidation
// Centralized type definitions and exports

// Core types
export * from './userRole';
export * from './ProfileTypes';
export * from './notification';

// Admin types
export * from './admin/TabTypes';

// Component types
export * from '../components/shared/types';
export * from '../components/auth/types';

// Chart types (consolidated from charts/index.ts)
export interface ChartDataPoint {
  name: string;
  [key: string]: any;
}

export interface ChartSeriesConfig {
  key: string;
  name: string;
  color: string;
}

export interface BaseChartProps {
  data: ChartDataPoint[];
  height?: number;
  title?: string;
  description?: string;
  formatter?: (value: any) => any;
}
