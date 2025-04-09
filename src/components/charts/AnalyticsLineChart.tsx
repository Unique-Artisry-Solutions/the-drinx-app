
import React from 'react';
import { 
  ResponsiveContainer, LineChart, Line, 
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

interface AnalyticsLineChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  series: DataSeries[];
  height?: number;
  formatter?: (value: any) => any;
}

const AnalyticsLineChart: React.FC<AnalyticsLineChartProps> = ({
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
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={defaultFormatter} />
              <Legend />
              {series.map((s) => (
                <Line 
                  key={s.key} 
                  type="monotone" 
                  dataKey={s.key} 
                  name={s.name} 
                  stroke={s.color} 
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsLineChart;
