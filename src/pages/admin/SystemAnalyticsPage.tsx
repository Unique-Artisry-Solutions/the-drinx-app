
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, subDays, subMonths } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Loader2 } from 'lucide-react';
import { getAnalyticsData, getUserRetention } from '@/utils/analytics';
import AnalyticsService from '@/components/admin/analytics/AnalyticsService';
import { useAnalytics } from '@/hooks/useAnalytics';

const SystemAnalyticsPage: React.FC = () => {
  const { track } = useAnalytics();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [retentionData, setRetentionData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch daily data
      const daily = await getAnalyticsData('daily', subDays(new Date(), 30), new Date());
      if (daily) setDailyData(daily);
      
      // Fetch weekly data
      const weekly = await getAnalyticsData('weekly', subMonths(new Date(), 3), new Date());
      if (weekly) setWeeklyData(weekly);
      
      // Fetch monthly data
      const monthly = await getAnalyticsData('monthly', subMonths(new Date(), 12), new Date());
      if (monthly) setMonthlyData(monthly);
      
      // Fetch retention data
      const retention = await getUserRetention(subMonths(new Date(), 3), new Date());
      if (retention) setRetentionData(retention);
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [dateRange]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    track('analytics_tab_change', { tab: value });
  };

  const handleExport = () => {
    // In a real app, this would export CSV data
    track('analytics_export', { type: activeTab });
    alert('Data exported (demo)');
  };

  // Helper function to format chart data
  const formatEventData = (data: any[]) => {
    const eventTypes = new Set<string>();
    data.forEach(item => eventTypes.add(item.event_type));
    
    // Group by date
    const groupedData = data.reduce((acc, item) => {
      const key = item.date || `${item.year}-${item.month || item.week}`;
      if (!acc[key]) acc[key] = { date: key };
      acc[key][item.event_type] = item.event_count;
      return acc;
    }, {});
    
    return Object.values(groupedData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <AnalyticsService pageView="admin_analytics" />
      
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">System Analytics</h1>
          <Button onClick={handleExport}>Export Data</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>User Sessions</CardTitle>
              <CardDescription>Total user sessions in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {dailyData.reduce((sum, item) => sum + (item.event_type === 'page_view' ? item.event_count : 0), 0)}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>Unique users in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {dailyData.reduce((sum, item) => sum + (item.event_type === 'page_view' ? item.unique_users : 0), 0)}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Retention Rate</CardTitle>
              <CardDescription>Average weekly retention rate</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              {retentionData.length > 0 
                ? Math.round((retentionData.reduce((sum, item) => sum + (item.total_users > 0 ? item.retained_users_week1 / item.total_users : 0), 0) / retentionData.length) * 100) + '%'
                : 'N/A'}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Event Tracking</TabsTrigger>
            <TabsTrigger value="retention">User Retention</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Daily user activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={formatEventData(dailyData)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="page_view" stroke="#8884d8" name="Page Views" />
                    <Line type="monotone" dataKey="user_signup" stroke="#82ca9d" name="Sign Ups" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Distribution</CardTitle>
                <CardDescription>Events tracked across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" name="Week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="event_count" fill="#8884d8" name="Events" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="retention">
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>Weekly cohort retention analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {retentionData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 text-left">Cohort Date</th>
                          <th className="border p-2 text-right">Users</th>
                          <th className="border p-2 text-right">Week 1</th>
                          <th className="border p-2 text-right">Week 2</th>
                          <th className="border p-2 text-right">Week 3</th>
                          <th className="border p-2 text-right">Week 4</th>
                        </tr>
                      </thead>
                      <tbody>
                        {retentionData.map((row, i) => (
                          <tr key={i}>
                            <td className="border p-2">{format(new Date(row.cohort_date), 'yyyy-MM-dd')}</td>
                            <td className="border p-2 text-right">{row.total_users}</td>
                            <td className="border p-2 text-right">
                              {row.total_users > 0 ? Math.round(row.retained_users_week1 / row.total_users * 100) + '%' : 'N/A'}
                            </td>
                            <td className="border p-2 text-right">
                              {row.total_users > 0 ? Math.round(row.retained_users_week2 / row.total_users * 100) + '%' : 'N/A'}
                            </td>
                            <td className="border p-2 text-right">
                              {row.total_users > 0 ? Math.round(row.retained_users_week3 / row.total_users * 100) + '%' : 'N/A'}
                            </td>
                            <td className="border p-2 text-right">
                              {row.total_users > 0 ? Math.round(row.retained_users_week4 / row.total_users * 100) + '%' : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No retention data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SystemAnalyticsPage;
