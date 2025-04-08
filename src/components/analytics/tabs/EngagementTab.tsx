
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';

export const EngagementTab: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Review Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={[
                      { name: 'Positive', value: 65 },
                      { name: 'Neutral', value: 25 },
                      { name: 'Negative', value: 10 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#4ade80" />
                    <Cell fill="#facc15" />
                    <Cell fill="#f87171" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Social Media Engagement</CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Instagram', value: 320 },
                    { name: 'Facebook', value: 210 },
                    { name: 'Twitter', value: 170 },
                    { name: 'TikTok', value: 150 }
                  ]}
                  margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Engagements">
                    {[
                      <Cell key="0" fill="#E1306C" />, // Instagram
                      <Cell key="1" fill="#4267B2" />, // Facebook
                      <Cell key="2" fill="#1DA1F2" />, // Twitter
                      <Cell key="3" fill="#000000" />  // TikTok
                    ]}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Customer Feedback Categories</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Taste', value: 85 },
                  { name: 'Presentation', value: 78 },
                  { name: 'Service', value: 92 },
                  { name: 'Ambiance', value: 88 },
                  { name: 'Value', value: 72 }
                ]}
                margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{fontSize: 12}} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" tick={{fontSize: 12}} width={80} />
                <Tooltip formatter={(value) => [`${value}%`, 'Satisfaction']} />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Satisfaction Score %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
