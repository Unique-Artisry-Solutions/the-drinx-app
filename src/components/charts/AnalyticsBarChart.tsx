
import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

interface DataPoint {
  name: string;
  [key: string]: any;
}

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface AnalyticsBarChartProps {
  data: DataPoint[];
  height?: number;
  title?: string;
  description?: string;
  series?: SeriesConfig[];
  formatter?: (value: any) => any;
}

const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({
  data,
  height = 300,
  title,
  description,
  series,
  formatter
}) => {
  const defaultFormatter = formatter || ((value: any) => [value, '']);
  
  // If no series provided, use legacy 'clicks' and 'conversions' keys
  const renderSeries = series && series.length > 0 ? series : [
    { key: 'clicks', name: 'Clicks', color: '#8884d8' },
    { key: 'conversions', name: 'Conversions', color: '#82ca9d' }
  ];

  return (
    <div className="w-full">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={defaultFormatter} />
            <Legend />
            {renderSeries.map((seriesItem, index) => (
              <Bar 
                key={seriesItem.key}
                dataKey={seriesItem.key} 
                name={seriesItem.name} 
                fill={seriesItem.color} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsBarChart;
