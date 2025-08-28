/**
 * Analytics formatting and helper utilities
 */

/**
 * Format analytics number with appropriate suffixes
 */
export function formatAnalyticsNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format percentage with proper decimals
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format analytics date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const start = startDate.toLocaleDateString();
  const end = endDate.toLocaleDateString(); 
  return `${start} - ${end}`;
}

/**
 * Format analytics duration in readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

/**
 * Calculate percentage change between two values
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format analytics time period labels
 */
export function formatTimePeriod(period: 'daily' | 'weekly' | 'monthly', date: Date): string {
  switch (period) {
    case 'daily':
      return date.toLocaleDateString();
    case 'weekly': {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return `Week of ${weekStart.toLocaleDateString()}`;
    }
    case 'monthly':
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Generate analytics color palette for charts
 */
export function getAnalyticsColors(): string[] {
  return [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1',
    '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
  ];
}

/**
 * Sanitize analytics string for safe display
 */
export function sanitizeAnalyticsString(str: string): string {
  return str.replace(/[<>]/g, '').trim();
}

/**
 * Group analytics data by time period
 */
export function groupAnalyticsDataByPeriod<T extends { date?: string; timestamp?: string }>(
  data: T[],
  period: 'hour' | 'day' | 'week' | 'month'
): Record<string, T[]> {
  return data.reduce((acc, item) => {
    const dateStr = item.date || item.timestamp;
    if (!dateStr) return acc;
    
    const date = new Date(dateStr);
    let key: string;
    
    switch (period) {
      case 'hour':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth()}`;
        break;
      default:
        key = dateStr;
    }
    
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}