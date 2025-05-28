
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, Heart } from 'lucide-react';
import { RecentActivity } from '@/hooks/usePersonalizedData';

interface ActivityFeedWidgetProps {
  activities: RecentActivity[];
}

const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return MapPin;
      case 'review':
        return Star;
      case 'favorite':
        return Heart;
      default:
        return MapPin;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'visit':
        return 'text-blue-500';
      case 'review':
        return 'text-yellow-500';
      case 'favorite':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full bg-muted ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.establishment}
                  </p>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.details}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeedWidget;
