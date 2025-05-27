
import React from 'react';
import { DashboardWidgets } from '../DashboardWidgets';
import { QuickActions } from '../QuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardOverviewTabProps {
  promoterId: string;
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({ promoterId }) => {
  // Mock overview metrics
  const overviewMetrics = {
    totalEvents: 12,
    activeEvents: 5,
    totalTicketsSold: 1247,
    totalRevenue: 28540,
    conversionRate: 12.3
  };

  return (
    <>
      {/* Live Dashboard Widgets */}
      <DashboardWidgets promoterId={promoterId} />

      {/* Quick Actions Grid */}
      <QuickActions />

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{overviewMetrics.totalEvents}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{overviewMetrics.activeEvents}</div>
              <div className="text-sm text-muted-foreground">Active Events</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{overviewMetrics.totalTicketsSold}</div>
              <div className="text-sm text-muted-foreground">Tickets Sold</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">${overviewMetrics.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-cyan-600">{overviewMetrics.conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
