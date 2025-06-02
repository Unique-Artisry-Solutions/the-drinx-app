
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const themeUsageData = [
  { theme: 'Light', users: 65 },
  { theme: 'Dark', users: 28 },
  { theme: 'Auto', users: 7 },
];

const ThemeAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={themeUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="theme" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themeUsageData.map((data) => (
          <Card key={data.theme}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{data.theme} Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.users}%</div>
              <p className="text-xs text-muted-foreground">of users</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThemeAnalytics;
