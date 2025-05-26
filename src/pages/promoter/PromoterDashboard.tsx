
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Users, Calendar, TrendingUp, DollarSign, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { usePromoterAnalytics } from '@/hooks/usePromoterAnalytics';
import { useAuth } from '@/contexts/auth';

const PromoterDashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    analytics, 
    eventPerformance, 
    campaignPerformance,
    isLoading 
  } = usePromoterAnalytics({
    promoterId: user?.id,
    range: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      to: new Date()
    }
  });

  // Calculate real metrics
  const activeCampaigns = campaignPerformance.filter(c => c.status === 'active').length;
  const totalReach = campaignPerformance.reduce((sum, c) => sum + c.reach, 0);
  const totalEvents = eventPerformance.length;
  const upcomingEvents = eventPerformance.filter(e => new Date(e.date) > new Date()).length;
  const avgEngagement = analytics.length > 0 
    ? analytics.reduce((sum, a) => sum + a.engagement_rate, 0) / analytics.length 
    : 0;
  const totalRevenue = eventPerformance.reduce((sum, e) => sum + e.revenue, 0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Promoter Dashboard</h1>
          <p className="text-gray-600 mt-2">Loading your campaign data...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Promoter Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your events and track campaign performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {campaignPerformance.length > activeCampaigns ? 
                `+${campaignPerformance.length - activeCampaigns} completed` : 
                'All campaigns active'
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalReach > 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach}
            </div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">{upcomingEvents} upcoming</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagement.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue > 1000 ? `${(totalRevenue / 1000).toFixed(1)}K` : totalRevenue.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest promotional activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaignPerformance.slice(0, 3).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.status === 'active' ? 'Currently running' : 
                       campaign.status === 'completed' ? 'Completed' : 'Planned'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600 capitalize">{campaign.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.reach.toLocaleString()} reach
                    </p>
                  </div>
                </div>
              ))}
              
              {campaignPerformance.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No campaigns yet</p>
                  <p className="text-sm">Create your first campaign to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common promotional tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link to="/promoter/events">
                <Button variant="ghost" className="w-full text-left p-3 bg-spiritless-pink/10 hover:bg-spiritless-pink/20 rounded-lg transition-colors justify-start">
                  Create New Event
                </Button>
              </Link>
              <Link to="/promoter/analytics">
                <Button variant="ghost" className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                  View Analytics Report
                </Button>
              </Link>
              <Link to="/promoter/marketing-analytics">
                <Button variant="ghost" className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Marketing Analytics
                </Button>
              </Link>
              <Link to="/promoter/events">
                <Button variant="ghost" className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                  Manage Event Tickets
                </Button>
              </Link>
              <Link to="/promoter/profile">
                <Button variant="ghost" className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                  Update Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromoterDashboard;
