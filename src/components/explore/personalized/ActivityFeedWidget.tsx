
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share, Clock } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { RealtimeActivity, ActivityFilterType, ActivityFilterHandler } from '@/types/explore';

interface ActivityFeedWidgetProps {
  activities?: RealtimeActivity[];
  isLoading?: boolean;
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({
  activities = [],
  isLoading = false
}) => {
  const [filter, setFilter] = useState<ActivityFilterType>('all');

  // Type-safe filter handler
  const handleFilterChange: ActivityFilterHandler = (value: ActivityFilterType) => {
    setFilter(value);
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'friends') return activity.type !== 'check-in';
    if (filter === 'nearby') return activity.location;
    return true;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'check-in': return '📍';
      case 'review': return '⭐';
      case 'recipe': return '🍹';
      case 'achievement': return '🏆';
      case 'bar-crawl': return '🚶';
      case 'photo-share': return '📸';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'check-in': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'recipe': return 'bg-purple-100 text-purple-800';
      case 'achievement': return 'bg-green-100 text-green-800';
      case 'bar-crawl': return 'bg-orange-100 text-orange-800';
      case 'photo-share': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Activity
          <div className="flex gap-1">
            {(['all', 'friends', 'nearby'] as ActivityFilterType[]).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleFilterChange(filterType)}
                className="text-xs px-2 py-1 h-6"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No recent activity
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{activity.user.name}</span>
                    <Badge variant="outline" className={`text-xs ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)} {activity.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                  
                  {activity.imageUrl && (
                    <img 
                      src={activity.imageUrl} 
                      alt="Activity" 
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistance(new Date(activity.timestamp), new Date(), { addSuffix: true })}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500">
                        <Heart className={`h-3 w-3 ${activity.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        {activity.likes}
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-blue-500">
                        <MessageCircle className="h-3 w-3" />
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-green-500">
                        <Share className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeedWidget;
