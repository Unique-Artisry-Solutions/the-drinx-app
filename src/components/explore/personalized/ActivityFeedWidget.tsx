
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Share2, MessageCircle, User, MapPin, Trophy, Camera, Coffee } from 'lucide-react';
import { useRealtimeActivity, RealtimeActivity } from '@/hooks/useRealtimeActivity';
import { OfflineService } from '@/services/OfflineService';
import { Badge } from '@/components/ui/badge';

export interface ActivityFeedWidgetProps {
  activities?: RealtimeActivity[];
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ activities: propActivities }) => {
  const { activities: realtimeActivities, isLoading, likeActivity, shareActivity } = useRealtimeActivity();
  const [activeFilter, setActiveFilter] = useState<'all' | 'friends' | 'nearby'>('all');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const activities = propActivities || realtimeActivities;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const filteredActivities = activities.filter(activity => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'friends') return activity.metadata?.isFriend;
    if (activeFilter === 'nearby') return activity.location;
    return true;
  });

  const handleLike = async (activityId: string) => {
    if (!isOnline) {
      OfflineService.queueAction('like_activity', { activityId });
      return;
    }
    await likeActivity(activityId);
  };

  const handleShare = async (activityId: string) => {
    if (!isOnline) {
      OfflineService.queueAction('share_activity', { activityId });
      return;
    }
    await shareActivity(activityId);
  };

  const getActivityIcon = (type: RealtimeActivity['type']) => {
    switch (type) {
      case 'check-in': return MapPin;
      case 'review': return MessageCircle;
      case 'recipe': return Coffee;
      case 'achievement': return Trophy;
      case 'bar-crawl': return MapPin;
      case 'photo-share': return Camera;
      default: return User;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
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
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Activity Feed
          </div>
          <div className="flex items-center gap-2">
            {!isOnline && (
              <Badge variant="destructive" className="text-xs">
                Offline
              </Badge>
            )}
            {OfflineService.getQueuedActions().length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {OfflineService.getQueuedActions().length} queued
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredActivities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            
            return (
              <div key={activity.id} className="p-3 rounded-lg border bg-card/50 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {activity.user.avatar ? (
                      <img 
                        src={activity.user.avatar} 
                        alt={activity.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    
                    {activity.location && (
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activity.location}</span>
                      </div>
                    )}
                    
                    {activity.imageUrl && (
                      <div className="mb-3">
                        <img 
                          src={activity.imageUrl} 
                          alt="Activity"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLike(activity.id)}
                        className={`h-6 px-2 text-xs ${activity.isLiked ? 'text-red-500' : ''}`}
                      >
                        <Heart className={`h-3 w-3 mr-1 ${activity.isLiked ? 'fill-current' : ''}`} />
                        {activity.likes}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleShare(activity.id)}
                        className="h-6 px-2 text-xs"
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activities to show</p>
              <p className="text-sm">Check back later for updates!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
