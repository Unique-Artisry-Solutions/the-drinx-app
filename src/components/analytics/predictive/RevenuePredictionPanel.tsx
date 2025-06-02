
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenuePredictionPanelProps {
  data?: any;
  isLoading?: boolean;
}

const mockRevenueData = [
  { month: 'Jan', actual: 12000, predicted: 11800 },
  { month: 'Feb', actual: 14500, predicted: 14200 },
  { month: 'Mar', actual: 16800, predicted: 16500 },
  { month: 'Apr', actual: null, predicted: 18200 },
  { month: 'May', actual: null, predicted: 19800 },
  { month: 'Jun', actual: null, predicted: 21500 },
];

const RevenuePredictionPanel: React.FC<RevenuePredictionPanelProps> = ({ isLoading }) => {
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
        <CardTitle>Revenue Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, '']} />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="Actual Revenue"
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#82ca9d" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenuePredictionPanel;
