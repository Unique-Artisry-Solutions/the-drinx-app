
import React from 'react';
import Layout from '@/components/Layout';
import { usePromoterAnalytics } from '@/hooks/usePromoterAnalytics';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromoterAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
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
    promoterId: user?.id,
    range: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      to: new Date()
    }
  });

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Analytics Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refresh}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-purple-600 mb-4">Loading Analytics...</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const totalViews = analytics.reduce((sum, a) => sum + a.total_views, 0);
  const totalVisitors = analytics.reduce((sum, a) => sum + a.unique_visitors, 0);
  const avgEngagement = analytics.length > 0 
    ? analytics.reduce((sum, a) => sum + a.engagement_rate, 0) / analytics.length 
    : 0;
  const totalRevenue = eventPerformance.reduce((sum, e) => sum + e.revenue, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-600">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your promotion performance and audience engagement</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All events</p>
            </CardContent>
          </Card>
        </div>

        {/* Event Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
              <CardDescription>Your recent event metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventPerformance.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.venue_name} • {event.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${event.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{event.attendees} attendees</p>
                    </div>
                  </div>
                ))}
                {eventPerformance.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No events found</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Your marketing campaign results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.status} • {campaign.reach.toLocaleString()} reach
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{campaign.conversion_rate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">{campaign.engagement.toLocaleString()} engagements</p>
                    </div>
                  </div>
                ))}
                {campaignPerformance.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No campaigns found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audience Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Audience Insights</CardTitle>
            <CardDescription>Understanding your audience demographics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Age Groups */}
              <div>
                <h4 className="font-medium mb-3">Age Groups</h4>
                <div className="space-y-2">
                  {audienceMetrics.filter(m => m.metric_name === 'age_group').map((metric) => (
                    <div key={metric.id} className="flex justify-between items-center">
                      <span className="text-sm">{metric.segment}</span>
                      <span className="text-sm font-medium">{metric.metric_value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div>
                <h4 className="font-medium mb-3">Locations</h4>
                <div className="space-y-2">
                  {audienceMetrics.filter(m => m.metric_name === 'location').map((metric) => (
                    <div key={metric.id} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{metric.segment}</span>
                      <span className="text-sm font-medium">{metric.metric_value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h4 className="font-medium mb-3">Interests</h4>
                <div className="space-y-2">
                  {audienceMetrics.filter(m => m.metric_name === 'interests').map((metric) => (
                    <div key={metric.id} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{metric.segment}</span>
                      <span className="text-sm font-medium">{metric.metric_value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PromoterAnalyticsPage;
