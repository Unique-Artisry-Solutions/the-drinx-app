
import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPoint {
  name: string;
  [key: string]: any;
}

interface DataSeries {
  key: string;
  name: string;
  color: string;
}

interface AnalyticsBarChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  series: DataSeries[];
  height?: number;
  formatter?: (value: any) => any;
}

const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({
  title,
  description,
  data,
  series,
  height = 300,
  formatter
}) => {
  const defaultFormatter = formatter || ((value: any) => [value, '']);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px`, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={defaultFormatter} />
              <Legend />
              {series.map((s) => (
                <Bar 
                  key={s.key} 
                  dataKey={s.key} 
                  name={s.name} 
                  fill={s.color} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsBarChart;
