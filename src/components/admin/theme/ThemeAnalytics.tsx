
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line } from 'recharts';
import { Paintbrush, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

// Mock data for theme analytics
const themeUsageData = [
  { name: 'Winter Theme', views: 2400, conversions: 120, engagementRate: 0.35 },
  { name: 'Spring Theme', views: 3450, conversions: 190, engagementRate: 0.42 },
  { name: 'Summer Theme', views: 5230, conversions: 340, engagementRate: 0.56 },
  { name: 'Fall Theme', views: 3950, conversions: 220, engagementRate: 0.48 },
  { name: 'Holiday Theme', views: 4120, conversions: 310, engagementRate: 0.53 },
];

const themeColorsUsage = [
  { name: 'Green', value: 35 },
  { name: 'Blue', value: 25 },
  { name: 'Pink', value: 20 },
  { name: 'Purple', value: 15 },
  { name: 'Orange', value: 5 },
];

const engagementTrendData = [
  { date: '2023-01', darkTheme: 0.38, lightTheme: 0.42 },
  { date: '2023-02', darkTheme: 0.40, lightTheme: 0.41 },
  { date: '2023-03', darkTheme: 0.45, lightTheme: 0.39 },
  { date: '2023-04', darkTheme: 0.48, lightTheme: 0.38 },
  { date: '2023-05', darkTheme: 0.52, lightTheme: 0.37 },
  { date: '2023-06', darkTheme: 0.55, lightTheme: 0.36 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ThemeAnalytics: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Theme Analytics
        </CardTitle>
        <CardDescription>
          Track user engagement metrics across different themes and visual styles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="colors">Color Usage</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="pt-4">
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Theme Performance Overview</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={themeUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar name="Page Views" dataKey="views" fill="#8884d8" />
                    <Bar name="Conversions" dataKey="conversions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Engagement Rate by Theme</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={themeUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 0.6]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
                    <Bar name="Engagement Rate" dataKey="engagementRate" fill="#ff7c43" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="pt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h4 className="text-sm font-medium mb-3">Popular Color Usage</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={themeColorsUsage}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {themeColorsUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-medium mb-3">Color Combinations</h4>
                <div className="p-4 border rounded-md space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex gap-1 mr-2">
                        <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      </div>
                      <span>Pink + Green</span>
                    </div>
                    <span className="text-sm text-muted-foreground">42%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex gap-1 mr-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                      </div>
                      <span>Blue + Amber</span>
                    </div>
                    <span className="text-sm text-muted-foreground">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex gap-1 mr-2">
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                        <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                      </div>
                      <span>Purple + Emerald</span>
                    </div>
                    <span className="text-sm text-muted-foreground">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex gap-1 mr-2">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                      </div>
                      <span>Red + Blue</span>
                    </div>
                    <span className="text-sm text-muted-foreground">12%</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="pt-4">
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Theme Engagement Trends</h4>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="darkTheme" name="Dark Theme" stroke="#8884d8" />
                    <Line type="monotone" dataKey="lightTheme" name="Light Theme" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="p-4 border rounded-md bg-slate-50">
              <h4 className="text-sm font-medium mb-2">Key Insights</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  Dark theme engagement has been steadily increasing over time
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  Seasonal themes show higher engagement during their respective seasons
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  Color combinations with high contrast show better accessibility scores and engagement
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  User retention is 24% higher when using accessible color schemes
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ThemeAnalytics;
