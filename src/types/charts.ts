
// Centralized Chart Types - Phase 9E
// Single source of truth for all chart-related types

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

export interface EnhancedChartProps extends BaseChartProps {
  series?: ChartSeriesConfig[];
}
