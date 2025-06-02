
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartSeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface AnalyticsLineChartProps {
  data: Array<{ name: string; [key: string]: any; }>;
  title?: string;
  description?: string;
  height?: number;
  series?: ChartSeriesConfig[];
  formatter?: (value: any) => any;
}

const AnalyticsLineChart: React.FC<AnalyticsLineChartProps> = ({
  data,
  title,
  description,
  height = 300,
  series = [
    { key: 'value', name: 'Value', color: '#8884d8' }
  ],
  formatter
}) => {
  const formatValue = (value: any) => {
    if (formatter) return formatter(value);
    return value;
  };

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={formatValue} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                name={s.name}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsLineChart;
