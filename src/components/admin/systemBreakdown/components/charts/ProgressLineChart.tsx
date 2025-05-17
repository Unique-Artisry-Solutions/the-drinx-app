
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export type ProgressData = {
  month: string;
  frontend: number;
  backend: number;
};

interface ProgressLineChartProps {
  data: ProgressData[];
  title?: string;
}

const ProgressLineChart: React.FC<ProgressLineChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
        <p className="text-gray-500">No progress data available</p>
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="frontend"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name="UI"
            />
            <Line
              type="monotone"
              dataKey="backend"
              stroke="#82ca9d"
              name="Backend"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressLineChart;
