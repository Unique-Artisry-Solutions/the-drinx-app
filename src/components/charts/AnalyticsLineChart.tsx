
import React from 'react';
import { 
  ResponsiveContainer, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

interface DataPoint {
  name: string;
  [key: string]: any;
}

interface AnalyticsLineChartProps {
  data: DataPoint[];
  height?: number;
  formatter?: (value: any) => any;
}

const AnalyticsLineChart: React.FC<AnalyticsLineChartProps> = ({
  data,
  height = 300,
  formatter
}) => {
  const defaultFormatter = formatter || ((value: any) => [value, '']);

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={defaultFormatter} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsLineChart;
