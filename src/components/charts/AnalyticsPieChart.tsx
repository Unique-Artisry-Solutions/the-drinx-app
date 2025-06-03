
import React, { useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AnalyticsPieChartProps {
  data: { name: string; value: number; color?: string; }[];
  colors?: string[];
  title?: string;
  description?: string;
  onSliceClick?: (entry: { name: string; value: number; }) => void;
  height?: number;
}

const AnalyticsPieChart: React.FC<AnalyticsPieChartProps> = ({
  data,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  title,
  description,
  onSliceClick,
  height = 300
}) => {
  const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
  const chartColors = colors?.length ? colors : defaultColors;
  
  const handleClick = useCallback((entry: any, index: number) => {
    if (onSliceClick) {
      onSliceClick(entry);
    }
  }, [onSliceClick]);

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
                  fill={entry.color || chartColors[index % chartColors.length]} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}`, 'Value']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsPieChart;
