
import React, { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AnalyticsPieChartProps {
  title: string;
  description: string;
  data: { name: string; value: number; }[];
  colors?: string[];
  onSliceClick?: (entry: { name: string; value: number; }) => void;
}

const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({
  title,
  description,
  data,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  onSliceClick
}) => {
  const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
  const chartColors = colors?.length ? colors : defaultColors;
  
  const handleClick = useCallback((entry: any, index: number) => {
    if (onSliceClick) {
      onSliceClick(entry);
    }
  }, [onSliceClick]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              onClick={handleClick}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={chartColors[index % chartColors.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}`, 'Value']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnalyticsPieChart;
