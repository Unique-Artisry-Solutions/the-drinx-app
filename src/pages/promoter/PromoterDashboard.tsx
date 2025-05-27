
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { DashboardWidgets } from '@/components/promoter/DashboardWidgets';
import { QuickActions } from '@/components/promoter/QuickActions';

const PromoterDashboard = () => {
  const navigate = useNavigate();

  // Mock promoter ID - in real implementation, this would come from auth context
  const promoterId = "promoter-123";

  // Mock overview metrics
  const overviewMetrics = {
    totalEvents: 12,
    activeEvents: 5,
    totalTicketsSold: 1247,
    totalRevenue: 28540,
    conversionRate: 12.3
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Promoter Dashboard</h1>
          <p className="text-muted-foreground">Monitor your events and promotional campaigns in real-time</p>
        </div>
        <Button onClick={() => navigate('/promoter/events')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

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
    </div>
  );
};

export default PromoterDashboard;
