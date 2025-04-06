
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardData } from '@/hooks/useDashboardData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const EstablishmentAnalyticsPage = () => {
  const { 
    stats, 
    visitorData, 
    ratingData, 
    mocktailData,
    barCrawlData,
    isLoading 
  } = useDashboardData();

  const mockAgeData = [
    { name: '18-24', value: 25 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 20 },
    { name: '45-54', value: 12 },
    { name: '55+', value: 8 },
  ];

  const mockGenderData = [
    { name: 'Female', value: 48 },
    { name: 'Male', value: 45 },
    { name: 'Non-binary', value: 5 },
    { name: 'Prefer not to say', value: 2 },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto p-6 pb-12">
        <h1 className="text-3xl font-bold mb-8">Establishment Analytics</h1>
        
        <Tabs defaultValue="overview" className="w-full mb-10">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Visitor Growth</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={visitorData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="visitors" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Ratings Overview</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ratingData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rating" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Popular Mocktails</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[360px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={mocktailData}
                        layout="vertical"
                        margin={{ top: 10, right: 10, left: 5, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{fontSize: 12}} />
                        <YAxis type="category" dataKey="name" tick={{fontSize: 12}} width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Bar Crawl Participation</CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={barCrawlData} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="participants" stroke="#ff7300" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="visitors" className="space-y-8 mt-6">
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
                <CardTitle>Visit Frequency</CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'First Time', visits: 120 },
                      { name: 'Occasional', visits: 85 },
                      { name: 'Regular', visits: 65 },
                      { name: 'Frequent', visits: 45 },
                      { name: 'VIP', visits: 25 },
                    ]} margin={{ top: 10, right: 10, left: 5, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{fontSize: 12}} />
                      <YAxis tick={{fontSize: 12}} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="visits" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="mt-6">
            {/* This would be implemented with real data in a production environment */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-10">
                <p className="text-lg">Detailed sales analytics will be available soon.</p>
                <p className="text-material-on-surface-variant mt-2">We're working on integrating with your point-of-sale system.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement" className="mt-6">
            {/* This would be implemented with real data in a production environment */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Engagement</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-10">
                <p className="text-lg">Detailed engagement metrics will be available soon.</p>
                <p className="text-material-on-surface-variant mt-2">We're aggregating social media and review platform data.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EstablishmentAnalyticsPage;
