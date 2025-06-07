
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PredictiveChurnAnalysisProps {
  promoterId: string;
}

const PredictiveChurnAnalysis: React.FC<PredictiveChurnAnalysisProps> = ({ promoterId }) => {
  // Mock data for churn analysis
  const churnData = [
    { name: 'Low Risk', value: 65, color: '#10B981' },
    { name: 'Medium Risk', value: 25, color: '#F59E0B' },
    { name: 'High Risk', value: 10, color: '#EF4444' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Churn Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={churnData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {churnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Churn prediction based on engagement patterns and interaction frequency.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveChurnAnalysis;
