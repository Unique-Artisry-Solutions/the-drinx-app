
import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

interface DataPoint {
  name: string;
  [key: string]: any;
}

interface AnalyticsBarChartProps {
  data: DataPoint[];
  height?: number;
  formatter?: (value: any) => any;
}

const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({
  data,
  height = 300,
  formatter
}) => {
  const defaultFormatter = formatter || ((value: any) => [value, '']);

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={defaultFormatter} />
          <Legend />
          <Bar dataKey="clicks" name="Clicks" fill="#8884d8" />
          <Bar dataKey="conversions" name="Conversions" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsBarChart;
