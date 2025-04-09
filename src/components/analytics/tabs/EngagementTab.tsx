
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Cell, LineChart, Line } from 'recharts';
import { Award, MessageSquare, Users, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

export const EngagementTab: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-medium">Loyalty Rate</h3>
          </div>
          <div className="text-3xl font-bold">78%</div>
          <p className="text-sm text-muted-foreground mt-1">Repeat customer rate</p>
          <div className="text-sm text-green-600 mt-1">↑ 12% from last month</div>
        </Card>
        
        <Card className="p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">User Content</h3>
          </div>
          <div className="text-3xl font-bold">146</div>
          <p className="text-sm text-muted-foreground mt-1">Items created this month</p>
          <div className="text-sm text-green-600 mt-1">↑ 24% from last month</div>
        </Card>
        
        <Card className="p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-medium">Feedback Score</h3>
          </div>
          <div className="text-3xl font-bold">4.7/5</div>
          <p className="text-sm text-muted-foreground mt-1">Average customer rating</p>
          <div className="text-sm text-green-600 mt-1">↑ 0.3 from last month</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-amber-500" />
              Loyalty Program Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { month: 'Jan', active: 120, redemption: 60, acquisition: 30 },
                    { month: 'Feb', active: 132, redemption: 75, acquisition: 25 },
                    { month: 'Mar', active: 145, redemption: 85, acquisition: 28 },
                    { month: 'Apr', active: 160, redemption: 90, acquisition: 32 },
                    { month: 'May', active: 178, redemption: 110, acquisition: 35 },
                    { month: 'Jun', active: 195, redemption: 125, acquisition: 42 }
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="active" stroke="#8884d8" name="Active Members" />
                  <Line type="monotone" dataKey="redemption" stroke="#82ca9d" name="Reward Redemptions" />
                  <Line type="monotone" dataKey="acquisition" stroke="#ffc658" name="New Signups" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              User-Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { type: 'Reviews', count: 65 },
                    { type: 'Photos', count: 42 },
                    { type: 'Recipes', count: 28 },
                    { type: 'Comments', count: 35 },
                    { type: 'Tips', count: 22 }
                  ]}
                  margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{fontSize: 12}} />
                  <YAxis type="category" dataKey="type" tick={{fontSize: 12}} width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Content Items">
                    {[
                      <Cell key="0" fill="#8884d8" />,
                      <Cell key="1" fill="#83a6ed" />,
                      <Cell key="2" fill="#8dd1e1" />,
                      <Cell key="3" fill="#82ca9d" />,
                      <Cell key="4" fill="#a4de6c" />
                    ]}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ThumbsUp className="h-5 w-5 mr-2 text-green-500" />
              Customer Feedback Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[300px] w-full">
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
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-purple-500" />
              Feedback Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { month: 'Jan', received: 48, responded: 42 },
                    { month: 'Feb', received: 56, responded: 46 },
                    { month: 'Mar', received: 63, responded: 58 },
                    { month: 'Apr', received: 52, responded: 49 },
                    { month: 'May', received: 72, responded: 65 },
                    { month: 'Jun', received: 80, responded: 74 }
                  ]}
                  margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="received" fill="#8884d8" name="Received" />
                  <Bar dataKey="responded" fill="#82ca9d" name="Responded" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
