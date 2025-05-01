import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CalendarIcon, 
  BarChart3, 
  RefreshCcw, 
  Users, 
  Calendar as CalendarIcon2, 
  Ticket, 
  DollarSign, 
  TrendingUp,
  LineChart
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, addDays, subDays } from 'date-fns';
import { usePromoterAnalytics } from '@/hooks/usePromoterAnalytics';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePromoterAnalyticsTracking } from '@/hooks/usePromoterAnalyticsTracking'; 
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';
import AnalyticsBarChart from '@/components/charts/AnalyticsBarChart';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';
import EventAnalyticsTab from '@/components/promoter/analytics/EventAnalyticsTab';
import AudienceAnalyticsTab from '@/components/promoter/analytics/AudienceAnalyticsTab';
import CampaignAnalyticsTab from '@/components/promoter/analytics/CampaignAnalyticsTab';

const PromoterAnalyticsPage = () => {
  const { user } = useAuth();
  const { trackPage } = useAnalytics();
  const { trackPromoterEvent, trackCampaignAction } = usePromoterAnalyticsTracking();
  
  const [date, setDate] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Track page view and promoter dashboard access
  useEffect(() => {
    trackPage('promoter_analytics_page');
    trackPromoterEvent('dashboard_accessed', {
      view_type: 'analytics',
      date_range: {
        start: date.from?.toISOString(),
        end: date.to?.toISOString()
      }
    });
  }, [trackPage, trackPromoterEvent, date]);
  
  // Track tab changes
  useEffect(() => {
    trackPromoterEvent('dashboard_tab_changed', { 
      tab: activeTab,
      timestamp: new Date().toISOString()
    });
  }, [activeTab, trackPromoterEvent]);
  
  const {
    analytics,
    eventPerformance,
    campaignPerformance,
    audienceMetrics,
    subscriberTrend,
    engagementTrend,
    isLoading,
    error,
    refresh
  } = usePromoterAnalytics({
    range: date
  });
  
  // Handle refresh with analytics tracking
  const handleRefresh = () => {
    trackPromoterEvent('dashboard_refreshed', {
      tab: activeTab
    });
    refresh();
  };
  
  // Track campaign performance view
  const handleCampaignTabView = () => {
    if (activeTab === 'campaigns' && campaignPerformance.length > 0) {
      trackCampaignAction('performance_viewed', 'all', {
        campaigns_count: campaignPerformance.length,
        date_range: {
          start: date.from?.toISOString(),
          end: date.to?.toISOString()
        }
      });
    }
  };
  
  // Track audience metrics view
  const handleAudienceTabView = () => {
    if (activeTab === 'audience' && audienceMetrics.length > 0) {
      trackPromoterEvent('audience_metrics_viewed', {
        metrics_count: audienceMetrics.length,
        date_range: {
          start: date.from?.toISOString(),
          end: date.to?.toISOString()
        }
      });
    }
  };
  
  // Effect to track tabs that need special tracking
  useEffect(() => {
    if (activeTab === 'campaigns') {
      handleCampaignTabView();
    } else if (activeTab === 'audience') {
      handleAudienceTabView();
    }
  }, [activeTab, campaignPerformance, audienceMetrics]);

  // Calculate summary metrics
  const totalEvents = eventPerformance.length;
  const totalAttendees = eventPerformance.reduce((sum, event) => sum + event.attendees, 0);
  const totalRevenue = eventPerformance.reduce((sum, event) => sum + event.revenue, 0);
  const avgEngagementRate = analytics.length > 0 
    ? analytics.reduce((sum, day) => sum + day.engagement_rate, 0) / analytics.length
    : 0;
  
  // Prepare chart data for subscriber trends
  const subscriberTrendData = subscriberTrend.map(item => ({
    name: format(new Date(item.date), 'MMM dd'),
    subscribers: item.metric_value
  }));
  
  // Prepare chart data for engagement trends
  const engagementTrendData = engagementTrend.map(item => ({
    name: format(new Date(item.date), 'MMM dd'),
    engagement: item.metric_value
  }));

  // Prepare audience demographic data for pie chart
  const audienceDemographicData = [
    { name: '18-24', value: 25 },
    { name: '25-34', value: 35 },
    { name: '35-44', value: 20 },
    { name: '45+', value: 20 },
  ];

  // Prepare campaign performance data for bar chart
  const campaignPerformanceData = campaignPerformance.map(campaign => ({
    name: campaign.name,
    reach: campaign.reach,
    engagement: campaign.engagement,
    conversion: Math.round(campaign.reach * (campaign.conversion_rate/100))
  }));

  // Prepare event comparison data for bar chart
  const eventComparisonData = eventPerformance.map(event => ({
    name: event.name,
    attendees: event.attendees,
    revenue: event.revenue / 100 // Scale down for better visualization
  }));

  // Track audience metric view
  const handleAudienceMetricClick = (metricName: string, segment: string) => {
    trackPromoterEvent('audience_metric_viewed', {
      metricName,
      segment,
      value: audienceMetrics.find(m => m.metric_name === metricName && m.segment === segment)?.metric_value
    });
  };

  // Track campaign selection
  const handleCampaignSelect = (campaignId: string) => {
    const campaign = campaignPerformance.find(c => c.id === campaignId);
    if (campaign) {
      trackPromoterEvent('campaign_performance_viewed', {
        campaignId,
        campaignName: campaign.name,
        campaignStatus: campaign.status
      });
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error Loading Analytics</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Dashboard Header with Title, Description and Date Range Picker */}
        <div className="mb-6 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Promoter Analytics</h1>
            <p className="text-muted-foreground">
              Track the performance of your events, campaigns, and audience engagement
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDate(newDate);
                      // Track date range selection
                      trackPromoterEvent('date_range_changed', {
                        new_start_date: newDate.from?.toISOString(),
                        new_end_date: newDate.to?.toISOString(),
                        tab: activeTab
                      });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh} 
              title="Refresh data"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Overview cards - Using AnalyticsMetricCard component */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6">
          <AnalyticsMetricCard
            title="Total Events"
            value={isLoading ? "-" : totalEvents}
            icon={CalendarIcon2}
            iconColor="text-blue-500"
            change={10}
          />
          
          <AnalyticsMetricCard
            title="Total Attendees"
            value={isLoading ? "-" : totalAttendees}
            icon={Users}
            iconColor="text-green-500"
            change={15}
          />
          
          <AnalyticsMetricCard
            title="Total Revenue"
            value={isLoading ? "-" : `$${totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            iconColor="text-emerald-500"
            change={12}
          />
          
          <AnalyticsMetricCard
            title="Avg. Engagement"
            value={isLoading ? "-" : `${avgEngagementRate.toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="text-purple-500"
            change={5}
          />
        </div>

        {/* Analytics tabs - Updated with new tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
          }} 
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events List</TabsTrigger>
            <TabsTrigger value="event-analytics">
              <LineChart className="h-4 w-4 mr-1" />
              Event Analytics
            </TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-4">
            {/* Subscriber Growth Trend Chart */}
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <AnalyticsLineChart
                title="Subscriber Growth"
                description="Track your subscriber growth over time"
                data={subscriberTrendData}
                series={[
                  {
                    key: "subscribers",
                    name: "Subscribers",
                    color: "#8B5CF6"
                  }
                ]}
                formatter={(value) => [`${value}`, 'subscribers']}
              />
            )}

            {/* Engagement Rate Trend Chart */}
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <AnalyticsLineChart
                title="Engagement Rate"
                description="Track audience engagement with your content"
                data={engagementTrendData}
                series={[
                  {
                    key: "engagement",
                    name: "Engagement Rate %",
                    color: "#06B6D4"
                  }
                ]}
                formatter={(value) => [`${value}%`, 'engagement']}
              />
            )}
            
            {/* Event Performance Comparison */}
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <AnalyticsBarChart
                title="Event Performance"
                description="Compare attendance and revenue across events"
                data={eventComparisonData}
                series={[
                  {
                    key: "attendees",
                    name: "Attendees",
                    color: "#10B981"
                  },
                  {
                    key: "revenue",
                    name: "Revenue ($100s)",
                    color: "#F59E0B"
                  }
                ]}
                formatter={(value) => [`${value}`, value === "revenue" ? "$100s" : "people"]}
              />
            )}
          </TabsContent>
          
          {/* Events List Tab Content */}
          <TabsContent value="events" className="space-y-4">
            {/* Event Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Event Performance</CardTitle>
                <CardDescription>
                  Attendance and revenue metrics for your events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : eventPerformance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Attendees</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventPerformance.map((event) => (
                        <TableRow key={event.id} onClick={() => {
                          // Track event row click
                          trackPromoterEvent('event_details_viewed', {
                            eventId: event.id,
                            eventName: event.name
                          });
                        }}>
                          <TableCell className="font-medium">{event.name}</TableCell>
                          <TableCell>{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                          <TableCell>{event.attendees}</TableCell>
                          <TableCell>${event.revenue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No event data available</p>
                )}
              </CardContent>
            </Card>

            {/* Event Revenue by Venue Chart */}
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <AnalyticsBarChart
                title="Event Revenue by Venue"
                description="Compare revenue generation across different venues"
                data={eventPerformance.map(event => ({
                  name: event.venue_name,
                  revenue: event.revenue
                }))}
                series={[
                  {
                    key: "revenue",
                    name: "Revenue ($)",
                    color: "#F59E0B"
                  }
                ]}
                formatter={(value) => [`$${value}`, 'revenue']}
              />
            )}
          </TabsContent>
          
          {/* Event Analytics Tab Content */}
          <TabsContent value="event-analytics" className="space-y-4">
            <EventAnalyticsTab 
              eventPerformance={eventPerformance} 
              isLoading={isLoading}
            />
          </TabsContent>
          
          {/* Campaign Analytics Tab Content */}
          <TabsContent value="campaigns" className="space-y-4">
            <CampaignAnalyticsTab 
              campaignPerformance={campaignPerformance} 
              isLoading={isLoading}
              onCampaignSelect={handleCampaignSelect}
            />
          </TabsContent>
          
          {/* Audience Analytics Tab Content */}
          <TabsContent value="audience" className="space-y-4">
            <AudienceAnalyticsTab 
              audienceMetrics={audienceMetrics} 
              subscriberTrend={subscriberTrend}
              engagementTrend={engagementTrend}
              isLoading={isLoading}
              onMetricClick={handleAudienceMetricClick}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterAnalyticsPage;
