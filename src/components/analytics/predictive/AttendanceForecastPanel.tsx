
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceForecastPanelProps {
  data?: any;
  isLoading?: boolean;
}

const mockForecastData = [
  { date: '2024-01', actual: 120, predicted: 125 },
  { date: '2024-02', actual: 150, predicted: 145 },
  { date: '2024-03', actual: 180, predicted: 175 },
  { date: '2024-04', actual: null, predicted: 195 },
  { date: '2024-05', actual: null, predicted: 210 },
  { date: '2024-06', actual: null, predicted: 225 },
];

const AttendanceForecastPanel: React.FC<AttendanceForecastPanelProps> = ({ 
  data, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockForecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Actual Attendance"
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#82ca9d" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Attendance"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AttendanceForecastPanel;
