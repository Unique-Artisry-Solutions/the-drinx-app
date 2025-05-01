
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, BarChart3, RefreshCcw, Users, Calendar as CalendarIcon2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, addDays, subDays } from 'date-fns';
import { usePromoterAnalytics } from '@/hooks/usePromoterAnalytics';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAnalytics } from '@/hooks/useAnalytics';

const PromoterAnalyticsPage = () => {
  const { user } = useAuth();
  const { trackPage } = useAnalytics();
  
  const [date, setDate] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Track page view
  useEffect(() => {
    trackPage('promoter_analytics_page');
  }, [trackPage]);
  
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
  
  // Calculate summary metrics
  const totalEvents = eventPerformance.length;
  const totalAttendees = eventPerformance.reduce((sum, event) => sum + event.attendees, 0);
  const totalRevenue = eventPerformance.reduce((sum, event) => sum + event.revenue, 0);
  const avgEngagementRate = analytics.length > 0 
    ? analytics.reduce((sum, day) => sum + day.engagement_rate, 0) / analytics.length
    : 0;
  
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error Loading Analytics</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={refresh}>
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
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="icon" onClick={refresh}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarIcon2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{totalEvents}</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{totalAttendees}</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{avgEngagementRate.toFixed(1)}%</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>
                  Overall performance metrics for your promoter activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-[250px] w-full" />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Detailed analytics visualization will be implemented in the full version.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      This MVP provides the data foundation and basic UI components.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-4">
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
                  <div className="rounded-md border">
                    <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium">
                      <div>Event</div>
                      <div>Date</div>
                      <div>Attendees</div>
                      <div>Revenue</div>
                    </div>
                    <div className="divide-y">
                      {eventPerformance.map((event) => (
                        <div key={event.id} className="grid grid-cols-4 gap-4 p-4 text-sm">
                          <div className="font-medium">{event.name}</div>
                          <div>{format(new Date(event.date), "MMM d, yyyy")}</div>
                          <div>{event.attendees}</div>
                          <div>${event.revenue}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No event data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="campaigns" className="space-y-4">
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
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium">
                      <div>Campaign</div>
                      <div>Status</div>
                      <div>Reach</div>
                      <div>Engagement</div>
                      <div>Conversion</div>
                    </div>
                    <div className="divide-y">
                      {campaignPerformance.map((campaign) => (
                        <div key={campaign.id} className="grid grid-cols-5 gap-4 p-4 text-sm">
                          <div className="font-medium">{campaign.name}</div>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              campaign.status === 'active' 
                                ? 'bg-green-100 text-green-800'
                                : campaign.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </div>
                          <div>{campaign.reach}</div>
                          <div>{campaign.engagement}</div>
                          <div>{campaign.conversion_rate}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">No campaign data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>
                  Information about your subscriber demographics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-[200px] w-full" />
                  </div>
                ) : audienceMetrics.length > 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Audience demographic visualizations will be implemented in the full version.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      This MVP provides the data foundation and basic UI components.
                    </p>
                  </div>
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
