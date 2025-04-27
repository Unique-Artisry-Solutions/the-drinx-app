import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { 
  Activity, Users, BarChart as BarChartIcon, 
  Clock, TrendingUp, Calendar, Award 
} from 'lucide-react';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer } from '@/components/ui/chart';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getAnalyticsData, getUserRetention } from '@/utils/analytics';
import RewardsAnalyticsPanel from './RewardsAnalyticsPanel';

interface StatsCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  change?: number;
}

interface AnalyticsDataItem {
  date?: string;
  year?: number;
  month?: number;
  week?: number;
  event_type?: string;
  event_count: number;
  unique_users: number;
  name?: string;
  total?: number;
  [key: string]: any;
}

interface RetentionDataItem {
  cohort_date: string;
  total_users: number;
  retained_users_week1: number;
  retained_users_week2: number;
  retained_users_week3: number;
  retained_users_week4: number;
}

interface EventDistributionItem {
  name: string;
  value: number;
}

type ChartTooltipType = TooltipProps<number, string>;

const AnalyticsDashboard: React.FC = () => {
  const { toast } = useToast();
  const { track } = useAnalytics();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [dailyData, setDailyData] = useState<AnalyticsDataItem[]>([]);
  const [weeklyData, setWeeklyData] = useState<AnalyticsDataItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<AnalyticsDataItem[]>([]);
  const [retentionData, setRetentionData] = useState<RetentionDataItem[]>([]);
  
  const getDateRange = () => {
    const end = new Date();
    let start;
    
    switch (timeframe) {
      case '7d':
        start = subDays(end, 7);
        break;
      case '30d':
        start = subDays(end, 30);
        break;
      case '90d':
        start = subDays(end, 90);
        break;
      case 'ytd':
        start = new Date(end.getFullYear(), 0, 1); // Jan 1st of current year
        break;
      default:
        start = subDays(end, 30);
    }
    
    return { start, end };
  };

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const { start, end } = getDateRange();
        
        const daily = await getAnalyticsData('daily', start, end);
        if (daily) {
          setDailyData(daily);
        }
        
        const weeklyStart = subMonths(end, 3);
        const weekly = await getAnalyticsData('weekly', weeklyStart, end);
        if (weekly) {
          setWeeklyData(weekly);
        }
        
        const monthlyStart = subMonths(end, 12);
        const monthly = await getAnalyticsData('monthly', monthlyStart, end);
        if (monthly) {
          setMonthlyData(monthly);
        }
        
        const retention = await getUserRetention(subMonths(end, 3), end);
        if (retention) {
          setRetentionData(retention);
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: "Error Loading Analytics",
          description: "Could not load analytics data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [toast, timeframe]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    track('analytics_tab_change', { tab: value });
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    track('analytics_timeframe_change', { timeframe: value });
  };
  
  const handleExportData = () => {
    track('analytics_export', { tab: activeTab });
    
    toast({
      title: "Export Started",
      description: `Exporting ${activeTab} data as CSV...`,
    });
  };
  
  const formatEventData = (data: AnalyticsDataItem[]): AnalyticsDataItem[] => {
    const eventsByDate: Record<string, AnalyticsDataItem> = {};
    
    data.forEach(item => {
      const dateKey = item.date || `${item.year}-${item.month || item.week}`;
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = { name: dateKey, total: 0, unique_users: 0, event_count: 0 };
      }
      if (item.event_type) {
        eventsByDate[dateKey][item.event_type] = item.event_count;
      }
      
      eventsByDate[dateKey].total = (eventsByDate[dateKey].total || 0) + item.event_count;
      
      if (item.unique_users) {
        eventsByDate[dateKey].unique_users = (eventsByDate[dateKey].unique_users || 0) + item.unique_users;
      }
    });
    
    return Object.values(eventsByDate).sort((a: AnalyticsDataItem, b: AnalyticsDataItem) => {
      return a.name && b.name ? a.name.localeCompare(b.name) : 0;
    });
  };
  
  const calculateStats = (): StatsCard[] => {
    if (!dailyData.length) return [];
    
    const pageViews = dailyData.reduce((sum, item) => 
      sum + (item.event_type === 'page_view' ? item.event_count : 0), 0);
      
    const signups = dailyData.reduce((sum, item) => 
      sum + (item.event_type === 'user_signup' ? item.event_count : 0), 0);
      
    const uniqueUsers = new Set(dailyData.flatMap(item => 
      item.unique_users ? Array(item.unique_users).fill(0).map((_, i) => i) : [])).size;
    
    const previousPeriodData = formatEventData(dailyData).slice(0, Math.floor(dailyData.length / 2));
    const currentPeriodData = formatEventData(dailyData).slice(Math.floor(dailyData.length / 2));
    
    const previousEngagement = previousPeriodData.reduce((sum, item) => sum + (item.total || 0), 0);
    const currentEngagement = currentPeriodData.reduce((sum, item) => sum + (item.total || 0), 0);
    const engagementChange = previousPeriodData.length && previousEngagement > 0
      ? ((currentEngagement - previousEngagement) / previousEngagement) * 100
      : 0;
    
    return [
      {
        title: "Total Page Views",
        value: pageViews.toLocaleString(),
        description: `Over last ${timeframe}`,
        icon: <Activity className="h-5 w-5 text-blue-500" />
      },
      {
        title: "Unique Users",
        value: uniqueUsers.toLocaleString(),
        description: `Across all events`,
        icon: <Users className="h-5 w-5 text-green-500" />
      },
      {
        title: "New Signups",
        value: signups.toLocaleString(),
        description: `New users registered`,
        icon: <TrendingUp className="h-5 w-5 text-purple-500" />
      },
      {
        title: "User Engagement",
        value: currentEngagement.toLocaleString(),
        description: `Total interactions`,
        icon: <BarChartIcon className="h-5 w-5 text-orange-500" />,
        change: Math.round(engagementChange)
      }
    ];
  };
  
  const stats = calculateStats();
  const formattedDailyData = formatEventData(dailyData);
  const formattedWeeklyData = formatEventData(weeklyData);
  const formattedMonthlyData = formatEventData(monthlyData);
  
  const eventDistribution = dailyData.reduce<Record<string, number>>((acc, item) => {
    const eventType = item.event_type;
    if (eventType) {
      if (!acc[eventType]) acc[eventType] = 0;
      acc[eventType] += item.event_count;
    }
    return acc;
  }, {});
  
  const pieChartData: EventDistributionItem[] = Object.entries(eventDistribution).map(([name, value]) => ({ name, value }));
  
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];

  const CustomTooltip: React.FC<ChartTooltipType> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="text-sm font-medium">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value ? entry.value.toLocaleString() : 0}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="h-10 w-10 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportData} variant="outline">
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              {stat.change !== undefined && (
                <div className={`flex items-center mt-2 text-xs ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}% from previous period
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events Breakdown</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>User activity trends over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer 
                config={{
                  'page_view': { label: 'Page Views', color: '#8884d8' },
                  'user_signup': { label: 'Sign Ups', color: '#82ca9d' },
                  'item_viewed': { label: 'Item Views', color: '#ffc658' }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedDailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="page_view" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Page Views" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="user_signup" 
                      stroke="#82ca9d" 
                      name="Sign Ups" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="item_viewed" 
                      stroke="#ffc658" 
                      name="Item Views" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Distribution</CardTitle>
                <CardDescription>Breakdown of event types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} events`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Aggregate events per month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="total" name="Total Events" fill="#8884d8" />
                    <Bar dataKey="unique_users" name="Unique Users" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Event Analytics</CardTitle>
              <CardDescription>Breakdown of all tracked events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Unique Users</TableHead>
                      <TableHead>% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(eventDistribution).map(([eventType, count]) => {
                      const totalEvents = Object.values(eventDistribution).reduce((sum, val) => sum + val, 0);
                      const percentage = totalEvents > 0 ? (count / totalEvents * 100).toFixed(1) : '0.0';
                      const uniqueUsers = dailyData
                        .filter(item => item.event_type === eventType)
                        .reduce((sum, item) => sum + (item.unique_users || 0), 0);
                      
                      return (
                        <TableRow key={eventType}>
                          <TableCell className="font-medium">{eventType}</TableCell>
                          <TableCell>{count.toLocaleString()}</TableCell>
                          <TableCell>{uniqueUsers.toLocaleString()}</TableCell>
                          <TableCell>{percentage}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention">
          <Card>
            <CardHeader>
              <CardTitle>User Retention Analysis</CardTitle>
              <CardDescription>Weekly cohort retention</CardDescription>
            </CardHeader>
            <CardContent>
              {retentionData?.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>User retention rate by cohort weeks</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cohort Date</TableHead>
                        <TableHead className="text-right">New Users</TableHead>
                        <TableHead className="text-right">Week 1</TableHead>
                        <TableHead className="text-right">Week 2</TableHead>
                        <TableHead className="text-right">Week 3</TableHead>
                        <TableHead className="text-right">Week 4</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {retentionData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {format(new Date(row.cohort_date), 'yyyy-MM-dd')}
                          </TableCell>
                          <TableCell className="text-right">{row.total_users}</TableCell>
                          <TableCell className="text-right">
                            {row.total_users > 0 
                              ? Math.round(row.retained_users_week1 / row.total_users * 100) + '%' 
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.total_users > 0 
                              ? Math.round(row.retained_users_week2 / row.total_users * 100) + '%' 
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.total_users > 0 
                              ? Math.round(row.retained_users_week3 / row.total_users * 100) + '%' 
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.total_users > 0 
                              ? Math.round(row.retained_users_week4 / row.total_users * 100) + '%' 
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No retention data available for the selected period
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Engagement Trends</CardTitle>
              <CardDescription>Week-over-week activity analysis</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer 
                config={{
                  'total': { label: 'Total Events', color: '#8884d8' },
                  'unique_users': { label: 'Unique Users', color: '#82ca9d' }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedWeeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="total" name="Total Events" fill="#8884d8" />
                    <Bar dataKey="unique_users" name="Unique Users" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsAnalyticsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
