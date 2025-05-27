
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';
import EventPerformanceMetrics from './EventPerformanceMetrics';
import AttendeeBehaviorTracking from './AttendeeBehaviorTracking';
import ConversionFunnelAnalysis from './ConversionFunnelAnalysis';
import EventFeatureHeatMap from './EventFeatureHeatMap';
import { BarChart3, Users, TrendingUp, Activity } from 'lucide-react';

interface EventAnalyticsDashboardProps {
  eventId: string;
  eventName: string;
}

const EventAnalyticsDashboard: React.FC<EventAnalyticsDashboardProps> = ({ 
  eventId, 
  eventName 
}) => {
  const [activeTab, setActiveTab] = useState('performance');
  const { metrics, eventAnalytics, isLoading, error } = useRealTimeAnalytics(eventId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Loading event analytics...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-red-500">Error loading analytics: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Event Analytics</h2>
          <p className="text-muted-foreground">{eventName}</p>
        </div>
        <Badge variant="outline" className="text-green-600">
          Live Analytics
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Total Attendees</div>
            </div>
            <div className="text-2xl font-bold mt-1">{eventAnalytics.totalAttendees}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Checked In</div>
            </div>
            <div className="text-2xl font-bold mt-1">{eventAnalytics.checkedInAttendees}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Conversion Rate</div>
            </div>
            <div className="text-2xl font-bold mt-1">{eventAnalytics.conversionRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Revenue</div>
            </div>
            <div className="text-2xl font-bold mt-1">${eventAnalytics.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <EventPerformanceMetrics eventId={eventId} metrics={metrics} />
        </TabsContent>

        <TabsContent value="behavior">
          <AttendeeBehaviorTracking eventId={eventId} />
        </TabsContent>

        <TabsContent value="funnel">
          <ConversionFunnelAnalysis eventId={eventId} />
        </TabsContent>

        <TabsContent value="heatmap">
          <EventFeatureHeatMap eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventAnalyticsDashboard;
