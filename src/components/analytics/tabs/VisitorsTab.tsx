
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Mock data for demographics until we have real data
const mockAgeData = [
  { name: '18-24', value: 30 },
  { name: '25-34', value: 40 },
  { name: '35-44', value: 15 },
  { name: '45-54', value: 10 },
  { name: '55+', value: 5 },
];

const mockGenderData = [
  { name: 'Male', value: 48 },
  { name: 'Female', value: 45 },
  { name: 'Non-binary', value: 5 },
  { name: 'Other', value: 2 },
];

interface VisitorsTabProps {
  formattedVisitorData: Array<{
    name: string;
    visitors: number;
    returningVisitors: number;
    uniqueVisitors: number;
  }>;
}

export const VisitorsTab: React.FC<VisitorsTabProps> = ({
  formattedVisitorData
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Visitor Demographics - Age</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={mockAgeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockAgeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Visitor Demographics - Gender</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={mockGenderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockGenderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Returning Visitor Rate</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedVisitorData}
                margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis 
                  tick={{fontSize: 12}} 
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip formatter={(value) => [`${value}%`, 'Return Rate']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="returningVisitors"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
