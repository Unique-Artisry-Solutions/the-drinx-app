
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, MapPin } from 'lucide-react';

export interface Activity {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  location?: string;
}

export interface ActivityFeedWidgetProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  {
    id: '1',
    type: 'check-in',
    title: 'Sarah checked in',
    description: 'At The Mocktail Lounge',
    timestamp: '2 hours ago',
    user: 'Sarah',
    location: 'The Mocktail Lounge'
  },
  {
    id: '2',
    type: 'review',
    title: 'New review posted',
    description: 'Amazing virgin piña colada!',
    timestamp: '4 hours ago',
    user: 'Mike'
  },
  {
    id: '3',
    type: 'recipe',
    title: 'Recipe shared',
    description: 'Cucumber Mint Refresher',
    timestamp: '6 hours ago',
    user: 'Emma'
  }
];

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ 
  activities = defaultActivities 
}) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'check-in':
        return <MapPin className="h-4 w-4" />;
      case 'review':
        return <User className="h-4 w-4" />;
      case 'recipe':
        return <User className="h-4 w-4" />;
      case 'achievement':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'check-in':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-green-100 text-green-800';
      case 'recipe':
        return 'bg-purple-100 text-purple-800';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
