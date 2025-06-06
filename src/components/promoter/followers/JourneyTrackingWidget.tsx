
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePromoterJourneyAnalytics } from '@/hooks/useFollowerJourney';
import { MapPin, Users, TrendingUp, Clock } from 'lucide-react';

interface JourneyTrackingWidgetProps {
  promoterId: string;
}

const JourneyTrackingWidget: React.FC<JourneyTrackingWidgetProps> = ({ promoterId }) => {
  const { data: analytics, isLoading } = usePromoterJourneyAnalytics(promoterId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journey Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  const topSources = Object.entries(analytics?.sourceBreakdown || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const recentEventTypes = analytics?.recentEvents?.reduce((acc: Record<string, number>, event: any) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Discovery Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSources.length > 0 ? (
              topSources.map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {source.replace('_', ' ')}
                  </span>
                  <Badge variant="secondary">
                    {count}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                No discovery data available yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Events</span>
              <Badge variant="outline">
                {analytics?.totalEvents || 0}
              </Badge>
            </div>
            
            {Object.entries(recentEventTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">
                  {type.replace('_', ' ')}
                </span>
                <Badge variant="secondary">
                  {count}
                </Badge>
              </div>
            ))}
            
            {Object.keys(recentEventTypes).length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No recent activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyTrackingWidget;
