
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartSeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface AnalyticsBarChartProps {
  data: Array<{ name: string; [key: string]: any; }>;
  title?: string;
  description?: string;
  height?: number;
  series?: ChartSeriesConfig[];
  formatter?: (value: any) => any;
}

const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({
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
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={formatValue} />
            {series.map((s) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                fill={s.color}
                name={s.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsBarChart;
