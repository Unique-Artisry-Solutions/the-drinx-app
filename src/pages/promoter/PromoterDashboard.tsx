
import React from 'react';
import { DashboardOverviewTab } from '@/components/promoter/dashboard/DashboardOverviewTab';
import MessagingWidget from '@/components/promoter/dashboard/MessagingWidget';
import RecentActivityCard from '@/components/establishment/RecentActivityCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickActions } from '@/components/promoter/QuickActions';
import { DashboardWidgets } from '@/components/promoter/DashboardWidgets';

const PromoterDashboard = () => {
  console.log('PromoterDashboard rendering...');

  // Mock data for recent activity - fixed to use numeric IDs
  const mockActivities = [
    {
      id: 1,
      type: 'visit' as const,
      user: 'Sarah Johnson',
      content: 'Attended your event at Blue Moon Lounge',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'order' as const,
      user: 'Mike Chen',
      content: 'Purchased VIP tickets for Summer Circuit',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'review' as const,
      user: 'Emma Davis',
      content: 'Left 5-star review for Downtown Pub event',
      time: '6 hours ago'
    }
  ];

  // Mock performance overview data
  const performanceData = {
    totalEvents: 12,
    activeEvents: 5,
    totalTicketsSold: 1247,
    totalRevenue: 28540,
    monthlyGrowth: 15.3
  };

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{performanceData.totalEvents}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{performanceData.activeEvents}</div>
              <div className="text-sm text-muted-foreground">Active Events</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{performanceData.totalTicketsSold}</div>
              <div className="text-sm text-muted-foreground">Tickets Sold</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">${performanceData.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-cyan-600">{performanceData.monthlyGrowth}%</div>
              <div className="text-sm text-muted-foreground">Monthly Growth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <QuickActions />

      {/* Live Dashboard Widgets */}
      <DashboardWidgets promoterId="current-promoter" />

      {/* Performance Overview, Venue Communications, and Recent Activity in 3-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{performanceData.totalEvents}</div>
                  <div className="text-xs text-blue-600">Total Events</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{performanceData.activeEvents}</div>
                  <div className="text-xs text-green-600">Active Events</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tickets Sold</span>
                  <span className="font-medium">{performanceData.totalTicketsSold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-medium">${performanceData.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Growth</span>
                  <span className="font-medium text-green-600">+{performanceData.monthlyGrowth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Venue Communications */}
        <MessagingWidget />

        {/* Recent Activity */}
        <RecentActivityCard activities={mockActivities} />
      </div>
    </div>
  );
};

export default PromoterDashboard;
