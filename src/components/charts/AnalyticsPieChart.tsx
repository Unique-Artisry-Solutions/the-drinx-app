
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsPieChartProps {
  data: Array<{ name: string; value: number; color?: string; }>;
  title?: string;
  description?: string;
  height?: number;
  colors?: string[];
}

const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({
  data,
  title,
  description,
  height = 300,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1']
}) => {
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, entryIndex) => (
                <Cell 
                  key={`cell-${entryIndex}`} 
                  fill={entry.color || colors[entryIndex % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPieChart;
