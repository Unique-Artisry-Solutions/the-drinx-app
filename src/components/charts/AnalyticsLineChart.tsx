
import React from 'react';
import { 
  ResponsiveContainer, LineChart, Line, 
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

interface AnalyticsLineChartProps {
  data: DataPoint[];
  height?: number;
  title?: string;
  description?: string;
  series?: SeriesConfig[];
  formatter?: (value: any) => any;
}

const AnalyticsLineChart: React.FC<AnalyticsLineChartProps> = ({
  data,
  height = 300,
  title,
  description,
  series,
  formatter
}) => {
  const defaultFormatter = formatter || ((value: any) => [value, '']);
  
  // If no series provided, use legacy 'value' key
  const renderSeries = series && series.length > 0 ? series : [
    { key: 'value', name: 'Value', color: '#8884d8' }
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
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={defaultFormatter} />
            <Legend />
            {renderSeries.map((seriesItem, index) => (
              <Line 
                key={seriesItem.key}
                type="monotone" 
                dataKey={seriesItem.key}
                name={seriesItem.name}
                stroke={seriesItem.color} 
                activeDot={{ r: 8 }} 
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsLineChart;
