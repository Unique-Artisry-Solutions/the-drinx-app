
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, MapPin, Users, Trophy } from 'lucide-react';

interface Activity {
  id: string;
  type: 'check_in' | 'review' | 'achievement' | 'social';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    establishment?: string;
    rating?: number;
    points?: number;
  };
}

interface ActivityFeedWidgetProps {
  activities: Activity[];
}

const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'check_in':
        return <MapPin className="h-4 w-4 text-green-600" />;
      case 'review':
        return <Star className="h-4 w-4 text-amber-500" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-purple-600" />;
      case 'social':
        return <Users className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'check_in':
        return 'bg-green-50 border-green-200';
      case 'review':
        return 'bg-amber-50 border-amber-200';
      case 'achievement':
        return 'bg-purple-50 border-purple-200';
      case 'social':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length > 0 ? (
          activities.slice(0, 5).map((activity) => (
            <div 
              key={activity.id} 
              className={`p-4 rounded-lg border ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm line-clamp-1">{activity.title}</h3>
                    <time className="text-xs text-muted-foreground flex-shrink-0">
                      {formatTimeAgo(activity.timestamp)}
                    </time>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                  
                  {activity.metadata && (
                    <div className="flex items-center gap-3 pt-1">
                      {activity.metadata.establishment && (
                        <span className="text-xs text-muted-foreground">
                          at {activity.metadata.establishment}
                        </span>
                      )}
                      {activity.metadata.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs">{activity.metadata.rating}</span>
                        </div>
                      )}
                      {activity.metadata.points && (
                        <Badge variant="secondary" className="text-xs">
                          +{activity.metadata.points} pts
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs">Start exploring to see your activity here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeedWidget;
