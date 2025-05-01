
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3, Users, DollarSign, Share2, CalendarDays, Ticket } from 'lucide-react';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';

interface AnalyticsDashboardProps {
  eventId: string;
  eventAnalytics: {
    views: number;
    uniqueVisitors: number;
    ticketSales: number;
    revenue: number;
    conversionRate: number;
  };
  isLoading?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  eventId, 
  eventAnalytics,
  isLoading = false
}) => {
  // Sample data for charts
  const dailyData = [
    { name: 'Mon', views: 120, tickets: 5, revenue: 250 },
    { name: 'Tue', views: 132, tickets: 6, revenue: 300 },
    { name: 'Wed', views: 101, tickets: 4, revenue: 200 },
    { name: 'Thu', views: 134, tickets: 8, revenue: 400 },
    { name: 'Fri', views: 190, tickets: 12, revenue: 600 },
    { name: 'Sat', views: 230, tickets: 20, revenue: 1000 },
    { name: 'Sun', views: 220, tickets: 15, revenue: 750 },
  ];
  
  const referralData = [
    { name: 'Direct', value: 40 },
    { name: 'Social', value: 30 },
    { name: 'Search', value: 20 },
    { name: 'Email', value: 10 },
  ];
  
  const ticketTypeData = [
    { name: 'General', value: 60 },
    { name: 'VIP', value: 25 },
    { name: 'Early Bird', value: 15 },
  ];

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          value={eventAnalytics.ticketSales} 
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

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="referrals">Referral Sources</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4 pt-4">
          <AnalyticsLineChart
            title="Event Performance Over Time"
            description="Daily views, ticket sales and revenue"
            data={dailyData}
            series={[
              { key: 'views', name: 'Page Views', color: '#3B82F6' },
              { key: 'tickets', name: 'Ticket Sales', color: '#8B5CF6' },
            ]}
            height={300}
          />
          
          <AnalyticsBarChart
            title="Revenue by Day"
            description="Daily revenue from ticket sales"
            data={dailyData}
            series={[
              { key: 'revenue', name: 'Revenue ($)', color: '#10B981' },
            ]}
            height={250}
            formatter={(value) => [`$${value}`, 'Revenue']}
          />
        </TabsContent>
        
        <TabsContent value="referrals" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnalyticsPieChart
              title="Traffic Sources"
              description="How visitors are finding your event"
              data={referralData}
              colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
            />
            <Card>
              <CardHeader>
                <CardTitle>Referral Details</CardTitle>
                <CardDescription>Detailed breakdown of traffic sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralData.map(source => (
                    <div key={source.name} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          source.name === 'Direct' ? 'bg-blue-500' :
                          source.name === 'Social' ? 'bg-green-500' :
                          source.name === 'Search' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span>{source.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{source.value}%</span>
                        <span className="text-gray-500 text-sm">
                          {Math.round(eventAnalytics.views * (source.value / 100))} visits
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tickets" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Ticket Type</CardTitle>
                <CardDescription>Distribution of ticket sales by type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <AnalyticsPieChart
                  title=""
                  description=""
                  data={ticketTypeData}
                  colors={['#8B5CF6', '#EC4899', '#F97316']}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sales Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 py-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Conversion Rate</span>
                      <span className="font-medium">{eventAnalytics.conversionRate.toFixed(2)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${Math.min(eventAnalytics.conversionRate * 5, 100)}%` }} 
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Percentage of visitors who purchased tickets
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Average Revenue per Sale</span>
                      <span className="font-medium">
                        ${eventAnalytics.ticketSales > 0 
                          ? (eventAnalytics.revenue / eventAnalytics.ticketSales).toFixed(2) 
                          : '0.00'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Revenue Goal</span>
                      <span className="font-medium">
                        ${eventAnalytics.revenue.toFixed(2)} / $2,000.00
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${Math.min((eventAnalytics.revenue / 2000) * 100, 100)}%` }} 
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
