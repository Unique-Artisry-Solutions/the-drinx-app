
// Charts types - Standalone to avoid circular dependencies
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartSeriesConfig {
  dataKey: string;
  name?: string;
  color?: string;
  type?: 'line' | 'bar' | 'area';
}

export interface BaseChartProps {
  data: ChartDataPoint[];
  series?: ChartSeriesConfig[];
  width?: number;
  height?: number;
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export interface AnalyticsChartData extends ChartDataPoint {
  timestamp?: string;
  category?: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: any;
}
