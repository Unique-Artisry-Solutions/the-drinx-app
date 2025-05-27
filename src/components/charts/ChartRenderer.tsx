
import React from 'react';
import { SmartChart } from './ChartWrapper';
import { ChartDataPoint } from './index';

interface ChartRendererProps {
  data: ChartDataPoint[];
  preferredType?: 'line' | 'bar' | 'pie';
  title?: string;
  description?: string;
  height?: number;
  colors?: string[];
  formatter?: (value: any) => any;
  autoDetectType?: boolean;
}

const ChartRenderer: React.FC<ChartRendererProps> = ({
  data,
  preferredType = 'bar',
  title,
  description,
  height,
  colors,
  formatter,
  autoDetectType = false
}) => {
  // Auto-detect chart type based on data structure
  const detectChartType = (): 'line' | 'bar' | 'pie' => {
    if (!data.length) return preferredType;
    
    const sampleItem = data[0];
    const numericKeys = Object.keys(sampleItem).filter(key => 
      key !== 'name' && typeof sampleItem[key] === 'number'
    );
    
    // If there's a 'value' key and only one numeric field, suggest pie chart
    if (numericKeys.length === 1 && numericKeys.includes('value')) {
      return 'pie';
    }
    
    // If data has time-based names, suggest line chart
    const hasTimePattern = data.some(item => 
      /\d{1,2}:\d{2}|\d{1,2}\/\d{1,2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i.test(item.name)
    );
    
    if (hasTimePattern) {
      return 'line';
    }
    
    return preferredType;
  };

  const chartType = autoDetectType ? detectChartType() : preferredType;

  return (
    <SmartChart
      type={chartType}
      data={data}
      title={title}
      description={description}
      height={height}
      colors={colors}
      formatter={formatter}
    />
  );
};

export default ChartRenderer;
