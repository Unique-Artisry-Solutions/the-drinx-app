
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
  BarChart,
  ChartLine
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
import EventPerformanceDetail from '@/components/promoter/analytics/EventPerformanceDetail';
import AudienceRetentionChart from '@/components/promoter/analytics/AudienceRetentionChart';
import CampaignROICalculator from '@/components/promoter/analytics/CampaignROICalculator';

const PromoterAnalyticsPage = () => {
  const { user } = useAuth();
  const { trackPage } = useAnalytics();
  const { trackPromoterEvent, trackCampaignAction } = usePromoterAnalyticsTracking();
  
  const [date, setDate] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  
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
    audienceDemographics,
    audienceRetention,
    campaignROI,
    eventDetails,
    subscriberTrend,
    engagementTrend,
    isLoading,
    error,
    refresh
  } = usePromoterAnalytics({
    range: date,
    selectedEventId,
    selectedCampaignId
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
  const audienceDemographicData = audienceDemographics || [
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

        {/* Analytics tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value);
          }} 
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
          
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
                formatter={(value) => [value, 'subscribers']}
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
                formatter={(value) => [value, 'engagement']}
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
                formatter={(value) => [value, ""]}
              />
            )}
          </TabsContent>
          
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
                        <TableHead>Ticket Sales</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventPerformance.map((event) => (
                        <TableRow 
                          key={event.id} 
                          className="cursor-pointer"
                          onClick={() => {
                            // Track event row click
                            trackPromoterEvent('event_details_viewed', {
                              eventId: event.id,
                              eventName: event.name
                            });
                            setSelectedEventId(event.id);
                          }}
                        >
                          <TableCell className="font-medium">{event.name}</TableCell>
                          <TableCell>{format(new Date(event.date), "MMM d, yyyy")}</TableCell>
                          <TableCell>{event.attendees}</TableCell>
                          <TableCell>{event.ticket_sales}</TableCell>
                          <TableCell>${event.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No event data available</p>
                )}
              </CardContent>
            </Card>

            {/* Detailed Event Performance */}
            {selectedEventId && !isLoading && (
              <EventPerformanceDetail 
                eventData={eventDetails} 
                isLoading={isLoading}
                onClose={() => setSelectedEventId(null)}
              />
            )}

            {/* Revenue by Ticket Type */}
            {!isLoading && !selectedEventId && (
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Ticket Type</CardTitle>
                  <CardDescription>
                    Breakdown of revenue across different ticket tiers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <AnalyticsPieChart
                      title=""
                      description=""
                      data={[
                        { name: 'General Admission', value: 7500 },
                        { name: 'VIP', value: 4500 },
                        { name: 'Early Bird', value: 2000 },
                        { name: 'Premium', value: 3000 },
                      ]}
                      colors={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Event Comparison Over Time */}
            {!isLoading && !selectedEventId && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Performance Over Time</CardTitle>
                  <CardDescription>
                    Compare current events with historical performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <AnalyticsLineChart
                      title=""
                      data={[
                        { name: 'Jan', current: 30, previous: 20 },
                        { name: 'Feb', current: 40, previous: 30 },
                        { name: 'Mar', current: 45, previous: 40 },
                        { name: 'Apr', current: 60, previous: 45 },
                        { name: 'May', current: 70, previous: 55 },
                      ]}
                      series={[
                        {
                          key: "current",
                          name: "Current Year",
                          color: "#3B82F6"
                        },
                        {
                          key: "previous",
                          name: "Previous Year",
                          color: "#9CA3AF"
                        }
                      ]}
                      formatter={(value) => [value, 'attendees']}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="campaigns" className="space-y-4">
            {/* Campaign Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Marketing Campaigns</CardTitle>
                <CardDescription>
                  Performance metrics for your marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : campaignPerformance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reach</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>Conversion</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaignPerformance.map((campaign) => (
                        <TableRow 
                          key={campaign.id} 
                          className="cursor-pointer"
                          onClick={() => {
                            // Track campaign row click
                            trackCampaignAction('performance_viewed', campaign.id, {
                              campaignName: campaign.name,
                              campaignStatus: campaign.status
                            });
                            setSelectedCampaignId(campaign.id);
                          }}
                        >
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              campaign.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : campaign.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </TableCell>
                          <TableCell>{campaign.reach}</TableCell>
                          <TableCell>{campaign.clicks || Math.floor(campaign.reach * 0.15)}</TableCell>
                          <TableCell>{campaign.ctr || '15.2'}%</TableCell>
                          <TableCell>{campaign.conversion_rate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No campaign data available</p>
                )}
              </CardContent>
            </Card>

            {/* Campaign ROI Calculator */}
            {selectedCampaignId && !isLoading && (
              <CampaignROICalculator
                campaignData={campaignROI}
                isLoading={isLoading}
                onClose={() => setSelectedCampaignId(null)}
              />
            )}

            {/* Channel Performance Comparison */}
            {!isLoading && !selectedCampaignId && (
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance by Channel</CardTitle>
                  <CardDescription>Compare effectiveness across different marketing channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <AnalyticsBarChart
                      title=""
                      data={[
                        { name: 'Email', reach: 2500, engagement: 500, conversion: 125 },
                        { name: 'Social', reach: 5000, engagement: 850, conversion: 175 },
                        { name: 'Direct', reach: 1200, engagement: 480, conversion: 96 },
                        { name: 'Referral', reach: 800, engagement: 200, conversion: 64 },
                      ]}
                      series={[
                        {
                          key: "reach",
                          name: "Reach",
                          color: "#06B6D4"
                        },
                        {
                          key: "engagement",
                          name: "Engagement",
                          color: "#8B5CF6"
                        },
                        {
                          key: "conversion",
                          name: "Conversions",
                          color: "#F59E0B"
                        }
                      ]}
                      formatter={(value) => [value, ""]}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conversion Funnel */}
            {!isLoading && !selectedCampaignId && (
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>Track user journey from awareness to conversion</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    <div className="relative pt-2">
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium">Impressions (10,000)</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-blue-500 rounded-t-lg h-4"></div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium">Clicks (2,500)</span>
                        <span>25%</span>
                      </div>
                      <div className="w-3/4 bg-purple-500 h-4"></div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium">Sign-ups (750)</span>
                        <span>7.5%</span>
                      </div>
                      <div className="w-1/2 bg-green-500 h-4"></div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="font-medium">Purchases (300)</span>
                        <span>3%</span>
                      </div>
                      <div className="w-1/4 bg-amber-500 rounded-b-lg h-4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4">
            {/* Audience Demographics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <AnalyticsPieChart
                  title="Age Demographics"
                  description="Age distribution of your audience"
                  data={audienceDemographicData}
                  colors={['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B']}
                  onSliceClick={(entry) => {
                    // Track pie chart slice click
                    trackPromoterEvent('demographic_segment_viewed', {
                      segment: entry.name,
                      value: entry.value,
                      segmentType: 'age'
                    });
                  }}
                />
              )}

              {/* Location Distribution Chart */}
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <AnalyticsPieChart
                  title="Location Distribution"
                  description="Geographic distribution of your audience"
                  data={[
                    { name: 'City Center', value: 40 },
                    { name: 'North District', value: 30 },
                    { name: 'South Area', value: 20 },
                    { name: 'East Region', value: 10 }
                  ]}
                  colors={['#F97316', '#8B5CF6', '#06B6D4', '#10B981']}
                  onSliceClick={(entry) => {
                    // Track pie chart slice click
                    trackPromoterEvent('demographic_segment_viewed', {
                      segment: entry.name,
                      value: entry.value,
                      segmentType: 'location'
                    });
                  }}
                />
              )}
            </div>

            {/* Audience Retention Chart */}
            <AudienceRetentionChart 
              retentionData={audienceRetention || [
                { cohort: 'Jan 2025', month0: 100, month1: 75, month2: 60, month3: 45 },
                { cohort: 'Feb 2025', month0: 100, month1: 70, month2: 55, month3: 0 },
                { cohort: 'Mar 2025', month0: 100, month1: 80, month2: 0, month3: 0 },
                { cohort: 'Apr 2025', month0: 100, month1: 0, month2: 0, month3: 0 },
              ]}
              isLoading={isLoading}
            />

            {/* Engagement Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Audience Engagement Patterns</CardTitle>
                <CardDescription>How your audience interacts with your content over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AnalyticsLineChart
                  title=""
                  data={[
                    { name: 'Mon', views: 42, likes: 25, shares: 8 },
                    { name: 'Tue', views: 38, likes: 22, shares: 6 },
                    { name: 'Wed', views: 45, likes: 30, shares: 10 },
                    { name: 'Thu', views: 55, likes: 35, shares: 12 },
                    { name: 'Fri', views: 70, likes: 48, shares: 16 },
                    { name: 'Sat', views: 64, likes: 40, shares: 14 },
                    { name: 'Sun', views: 48, likes: 28, shares: 9 },
                  ]}
                  series={[
                    {
                      key: "views",
                      name: "Views",
                      color: "#3B82F6"
                    },
                    {
                      key: "likes",
                      name: "Likes",
                      color: "#EC4899"
                    },
                    {
                      key: "shares",
                      name: "Shares",
                      color: "#10B981"
                    }
                  ]}
                  formatter={(value) => [value, '']}
                />
              </CardContent>
            </Card>

            {/* Audience Interests Table */}
            <Card>
              <CardHeader>
                <CardTitle>Audience Interests</CardTitle>
                <CardDescription>
                  Top interests and preferences of your audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : audienceMetrics.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Segment</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audienceMetrics.map((metric, index) => (
                        <TableRow 
                          key={`${metric.metric_name}-${index}`}
                          onClick={() => {
                            // Track audience metric row click
                            trackPromoterEvent('audience_metric_viewed', {
                              metricName: metric.metric_name,
                              segment: metric.segment,
                              value: metric.metric_value
                            });
                          }}
                        >
                          <TableCell className="font-medium">{metric.metric_name}</TableCell>
                          <TableCell>{metric.segment}</TableCell>
                          <TableCell>{metric.metric_value}</TableCell>
                          <TableCell className={index % 2 === 0 ? "text-green-500" : "text-red-500"}>
                            {index % 2 === 0 ? "↑" : "↓"} {Math.abs(Math.floor(Math.random() * 10) + 1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No audience data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterAnalyticsPage;
