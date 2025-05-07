
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3, Users, DollarSign, Share2, CalendarDays, Ticket } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useEventAnalytics } from '@/hooks/events/useEventAnalytics';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { addDays, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface EventAnalyticsDashboardProps {
  eventId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const EventAnalyticsDashboard: React.FC<EventAnalyticsDashboardProps> = ({ eventId }) => {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  
  const {
    isLoading,
    eventAnalytics,
    dailyMetrics,
    referralSources,
    ticketSalesAnalytics,
    setDateRange: setAnalyticsDateRange,
    refresh
  } = useEventAnalytics(eventId, {
    startDate: format(dateRange.from || new Date(), 'yyyy-MM-dd'),
    endDate: format(dateRange.to || new Date(), 'yyyy-MM-dd')
  });

  // Handle date range change
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    setAnalyticsDateRange({
      startDate: format(range.from, 'yyyy-MM-dd'),
      endDate: format(range.to, 'yyyy-MM-dd')
    });
  };

  // Format daily data for charts
  const dailyData = dailyMetrics.dates.map((date, index) => ({
    name: format(new Date(date), 'MMM dd'),
    views: dailyMetrics.views[index],
    tickets: dailyMetrics.ticketSales[index],
    revenue: dailyMetrics.revenue[index],
  }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const AnalyticsMetricCard = ({ 
    title, 
    value, 
    icon: Icon,
    iconColor,
    change
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ElementType;
    iconColor: string;
    change?: number;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% from previous period
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Event Analytics</h2>
        <DateRangePicker 
          date={dateRange} 
          onUpdate={handleDateRangeChange} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnalyticsMetricCard 
          title="Page Views" 
          value={eventAnalytics.views} 
          icon={BarChart3}
          iconColor="text-blue-500"
          change={5.2}
        />
        <AnalyticsMetricCard 
          title="Unique Visitors" 
          value={eventAnalytics.uniqueVisitors} 
          icon={Users}
          iconColor="text-green-500"
          change={3.1}
        />
        <AnalyticsMetricCard 
          title="Ticket Sales" 
          value={ticketSalesAnalytics.soldTickets} 
          icon={Ticket}
          iconColor="text-purple-500"
          change={12.3}
        />
        <AnalyticsMetricCard 
          title="Revenue" 
          value={`$${eventAnalytics.revenue.toFixed(2)}`} 
          icon={DollarSign}
          iconColor="text-emerald-500"
          change={8.5}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Sales</TabsTrigger>
          <TabsTrigger value="referrals">Referral Sources</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="campaigns">Marketing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
              <CardDescription>
                Visitors, ticket sales, and revenue over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Page Views"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tickets" 
                      stroke="#82ca9d" 
                      name="Tickets Sold"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Daily revenue from ticket sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Bar 
                      dataKey="revenue" 
                      fill="#8884d8" 
                      name="Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Sales by Type</CardTitle>
                <CardDescription>
                  Distribution of sales across ticket types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ticketSalesAnalytics.salesByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="sold"
                        nameKey="typeName"
                        label={({ typeName, percent }) => `${typeName}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {ticketSalesAnalytics.salesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} tickets`, props.payload.typeName]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Ticket Sales</CardTitle>
                <CardDescription>
                  Last 7 days of sales activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ticketSalesAnalytics.recentSales}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="quantity" name="Tickets" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Ticket Metrics</CardTitle>
              <CardDescription>
                Sales and conversion metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Sales Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sold</span>
                      <span>{ticketSalesAnalytics.soldTickets} / {ticketSalesAnalytics.totalTickets}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full"
                        style={{ 
                          width: `${ticketSalesAnalytics.totalTickets > 0 
                            ? (ticketSalesAnalytics.soldTickets / ticketSalesAnalytics.totalTickets) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Attendance Rate</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Checked In</span>
                      <span>{ticketSalesAnalytics.attendanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full"
                        style={{ width: `${ticketSalesAnalytics.attendanceRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Conversion Rate</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Views to Sales</span>
                      <span>{eventAnalytics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full"
                        style={{ width: `${Math.min(eventAnalytics.conversionRate * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                How visitors are finding your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={referralSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="source"
                        label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {referralSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} visits`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Top Referral Sources</h3>
                  {referralSources.slice(0, 5).map((source, index) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{source.source}</span>
                        <span>{source.count} visits ({source.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full"
                          style={{ 
                            width: `${source.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Analytics</CardTitle>
              <CardDescription>
                Check-in rates and attendee statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Attendance Rate</div>
                  <div className="text-2xl font-bold">{ticketSalesAnalytics.attendanceRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-400">of ticket holders checked in</div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Checked In</div>
                  <div className="text-2xl font-bold">
                    {Math.round(ticketSalesAnalytics.soldTickets * (ticketSalesAnalytics.attendanceRate / 100))}
                  </div>
                  <div className="text-xs text-gray-400">of {ticketSalesAnalytics.soldTickets} ticket holders</div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">No Shows</div>
                  <div className="text-2xl font-bold">
                    {Math.round(ticketSalesAnalytics.soldTickets * (1 - ticketSalesAnalytics.attendanceRate / 100))}
                  </div>
                  <div className="text-xs text-gray-400">missed the event</div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Attendance by Ticket Type</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-1">Ticket Type</th>
                      <th className="text-left py-2 px-1">Sold</th>
                      <th className="text-left py-2 px-1">Checked In</th>
                      <th className="text-left py-2 px-1">Check-in Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticketSalesAnalytics.salesByType.map((ticketType) => {
                      const checkedIn = Math.round(ticketType.sold * (ticketSalesAnalytics.attendanceRate / 100));
                      const checkInRate = ticketType.sold > 0 ? (checkedIn / ticketType.sold) * 100 : 0;
                      
                      return (
                        <tr key={ticketType.typeName} className="border-b">
                          <td className="py-2 px-1">{ticketType.typeName}</td>
                          <td className="py-2 px-1">{ticketType.sold}</td>
                          <td className="py-2 px-1">{checkedIn}</td>
                          <td className="py-2 px-1">{checkInRate.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaign Performance</CardTitle>
              <CardDescription>
                Effectiveness of your marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-4">
                Connect your marketing campaigns to track their performance. Each campaign will have detailed metrics on impressions, clicks, and conversions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Conversion Funnel</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Impressions</span>
                        <span>{eventAnalytics.views}</span>
                      </div>
                      <div className="w-full h-3 bg-blue-100 rounded-full">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Ticket Views</span>
                        <span>{Math.round(eventAnalytics.views * 0.4)}</span>
                      </div>
                      <div className="w-full h-3 bg-indigo-100 rounded-full">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Purchases</span>
                        <span>{eventAnalytics.ticketSales}</span>
                      </div>
                      <div className="w-full h-3 bg-purple-100 rounded-full">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ 
                            width: `${eventAnalytics.conversionRate}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Campaign Metrics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Click-Through Rate</span>
                      <span className="font-medium">{(eventAnalytics.ticketSales / eventAnalytics.views * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Conversion Rate</span>
                      <span className="font-medium">{eventAnalytics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Cost per Acquisition</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Revenue per Visitor</span>
                      <span className="font-medium">
                        ${eventAnalytics.views > 0 
                          ? (eventAnalytics.revenue / eventAnalytics.views).toFixed(2) 
                          : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Campaign Performance Comparison</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Connect multiple campaigns to compare their effectiveness
                </p>
                
                <div className="rounded-lg border p-4 flex items-center justify-center h-40">
                  <p className="text-gray-400">No campaign data available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventAnalyticsDashboard;
