
import React from 'react';
import AnalyticsLineChart from './AnalyticsLineChart';
import AnalyticsBarChart from './AnalyticsBarChart';
import AnalyticsPieChart from './AnalyticsPieChart';

// Legacy wrapper for line charts that expect a single data series
export const LegacyLineChart: React.FC<{
  data: Array<{ name: string; value: number; }>;
  height?: number;
  formatter?: (value: any) => any;
}> = ({ data, height, formatter }) => {
  return (
    <AnalyticsLineChart
      data={data}
      height={height}
      formatter={formatter}
      series={[{ key: 'value', name: 'Value', color: '#8884d8' }]}
    />
  );
};

// Legacy wrapper for bar charts that expect clicks/conversions
export const LegacyBarChart: React.FC<{
  data: Array<{ name: string; clicks?: number; conversions?: number; [key: string]: any; }>;
  height?: number;
  formatter?: (value: any) => any;
}> = ({ data, height, formatter }) => {
  return (
    <AnalyticsBarChart
      data={data}
      height={height}
      formatter={formatter}
      series={[
        { key: 'clicks', name: 'Clicks', color: '#8884d8' },
        { key: 'conversions', name: 'Conversions', color: '#82ca9d' }
      ]}
    />
  );
};

// Enhanced wrapper that automatically detects data structure and creates appropriate series
export const SmartChart: React.FC<{
  type: 'line' | 'bar' | 'pie';
  data: Array<{ name: string; [key: string]: any; }>;
  title?: string;
  description?: string;
  height?: number;
  colors?: string[];
  formatter?: (value: any) => any;
}> = ({ type, data, title, description, height, colors, formatter }) => {
  // Auto-detect series from data keys (excluding 'name')
  const detectSeries = () => {
    if (!data.length) return [];
    
    const sampleItem = data[0];
    const dataKeys = Object.keys(sampleItem).filter(key => 
      key !== 'name' && typeof sampleItem[key] === 'number'
    );
    
    const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];
    
    return dataKeys.map((key, index) => ({
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      color: defaultColors[index % defaultColors.length]
    }));
  };

  const series = detectSeries();

  if (type === 'pie') {
    return (
      <AnalyticsPieChart
        data={data}
        title={title}
        description={description}
        height={height}
        colors={colors}
      />
    );
  }

  if (type === 'line') {
    return (
      <AnalyticsLineChart
        data={data}
        title={title}
        description={description}
        height={height}
        series={series}
        formatter={formatter}
      />
    );
  }

  return (
    <AnalyticsBarChart
      data={data}
      title={title}
      description={description}
      height={height}
      series={series}
      formatter={formatter}
    />
  );
};

export default SmartChart;
