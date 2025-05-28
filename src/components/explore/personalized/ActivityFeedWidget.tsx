import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Clock } from 'lucide-react';
import { useRealtimeActivity } from '@/hooks/useRealtimeActivity';
import { useIsMobile } from '@/hooks/use-mobile';

// export interface RealtimeActivity {
//   id: string;
//   type: 'check-in' | 'review' | 'recipe' | 'achievement' | 'bar-crawl' | 'photo-share';
//   title: string;
//   description: string;
//   timestamp: string;
//   user: {
//     id: string;
//     name: string;
//     avatar?: string;
//   };
//   location?: string;
//   imageUrl?: string;
//   likes: number;
//   isLiked: boolean;
//   metadata?: Record<string, any>;
// }

const ActivityFeedWidget: React.FC = () => {
  const { activities, isLoading, likeActivity, shareActivity } = useRealtimeActivity();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading activity...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'photo-share':
        return '📸';
      case 'achievement':
        return '🏆';
      case 'bar-crawl':
        return '🚶';
      case 'recipe':
        return '🍹';
      case 'check-in':
        return '📍';
      case 'review':
        return '⭐';
      default:
        return '📱';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-lg">🌊</span>
          Community Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>
                    {activity.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{activity.user.name}</span>
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  {activity.location && (
                    <p className="text-xs text-muted-foreground mt-1">📍 {activity.location}</p>
                  )}
                </div>
              </div>
              
              {activity.imageUrl && (
                <div className="rounded-md overflow-hidden">
                  <img 
                    src={activity.imageUrl} 
                    alt="Activity" 
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => likeActivity(activity.id)}
                    className={`h-8 px-2 ${activity.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${activity.isLiked ? 'fill-current' : ''}`} />
                    {activity.likes}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Comment
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => shareActivity(activity.id)}
                  className="h-8 px-2 text-muted-foreground"
                >
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first to check in or share something!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeedWidget;
