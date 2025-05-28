
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  User, 
  MapPin, 
  Trophy, 
  Camera,
  ChefHat,
  Navigation
} from 'lucide-react';
import { useRealtimeActivity, RealtimeActivity } from '@/hooks/useRealtimeActivity';
import { NotificationService } from '@/services/NotificationService';
import { OfflineService } from '@/services/OfflineService';

interface ActivityFeedWidgetProps {
  activities?: RealtimeActivity[];
  className?: string;
}

const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ 
  activities: propActivities,
  className = "" 
}) => {
  const { activities: hookActivities, isLoading, likeActivity, shareActivity } = useRealtimeActivity();
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  
  // Use prop activities if provided, otherwise use hook activities
  const activities = propActivities || hookActivities;

  const getActivityIcon = (activityType: RealtimeActivity['type']) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (activityType) {
      case 'photo-share':
        return <Camera {...iconProps} className="h-4 w-4 text-pink-500" />;
      case 'achievement':
        return <Trophy {...iconProps} className="h-4 w-4 text-yellow-500" />;
      case 'bar-crawl':
        return <Navigation {...iconProps} className="h-4 w-4 text-blue-500" />;
      case 'recipe':
        return <ChefHat {...iconProps} className="h-4 w-4 text-green-500" />;
      case 'check-in':
        return <MapPin {...iconProps} className="h-4 w-4 text-red-500" />;
      case 'review':
        return <MessageCircle {...iconProps} className="h-4 w-4 text-purple-500" />;
      default:
        return <User {...iconProps} />;
    }
  };

  const handleLike = async (activityId: string) => {
    try {
      if (OfflineService.isOffline()) {
        OfflineService.queueAction('like_activity', { activityId });
        NotificationService.addNotification({
          title: 'Action Queued',
          message: 'Like will be processed when online',
          type: 'info'
        });
      }
      await likeActivity(activityId);
    } catch (error) {
      NotificationService.addNotification({
        title: 'Error',
        message: 'Failed to like activity',
        type: 'error'
      });
    }
  };

  const handleShare = async (activityId: string) => {
    try {
      await shareActivity(activityId);
      NotificationService.addNotification({
        title: 'Shared!',
        message: 'Activity shared successfully',
        type: 'success'
      });
    } catch (error) {
      NotificationService.addNotification({
        title: 'Error',
        message: 'Failed to share activity',
        type: 'error'
      });
    }
  };

  const toggleExpanded = (activityId: string) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  if (isLoading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardHeader>
          <div className="h-6 bg-muted rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          Community Activity
          <Badge variant="secondary" className="ml-auto">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Check back later for updates!</p>
          </div>
        ) : (
          activities.map((currentActivity) => (
            <div
              key={currentActivity.id}
              className="group border rounded-lg p-4 hover:bg-muted/30 transition-colors duration-200 cursor-pointer"
              onClick={() => toggleExpanded(currentActivity.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={currentActivity.user.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                    {currentActivity.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getActivityIcon(currentActivity.type)}
                    <span className="font-medium text-sm">
                      {currentActivity.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(currentActivity.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                    {currentActivity.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {currentActivity.description}
                  </p>
                  
                  {currentActivity.location && (
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {currentActivity.location}
                      </span>
                    </div>
                  )}

                  {currentActivity.imageUrl && (
                    <div className="mt-2 mb-3">
                      <img 
                        src={currentActivity.imageUrl} 
                        alt="Activity"
                        className="rounded-lg max-w-full h-32 object-cover border"
                      />
                    </div>
                  )}

                  {/* Expanded content */}
                  {expandedActivity === currentActivity.id && (
                    <div className="mt-3 pt-3 border-t space-y-2 animate-in slide-in-from-top-2 duration-200">
                      {currentActivity.metadata && (
                        <div className="text-xs text-muted-foreground">
                          <p>Additional details about this activity...</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 px-2 ${currentActivity.isLiked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(currentActivity.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${currentActivity.isLiked ? 'fill-current' : ''}`} />
                        <span className="text-xs">{currentActivity.likes}</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-muted-foreground hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(currentActivity.id);
                        }}
                      >
                        <Share className="h-4 w-4 mr-1" />
                        <span className="text-xs">Share</span>
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-xs">Comment</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {activities.length > 0 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              View all activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeedWidget;
