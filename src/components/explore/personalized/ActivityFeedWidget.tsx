
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Star, 
  Camera,
  Trophy,
  Route,
  Clock
} from 'lucide-react';
import { Activity } from './types';

interface ActivityFeedWidgetProps {
  activities: Activity[];
}

const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ activities }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'check-in':
        return <MapPin className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      case 'recipe':
        return <MessageCircle className="h-4 w-4" />;
      case 'achievement':
        return <Trophy className="h-4 w-4" />;
      case 'bar-crawl':
        return <Route className="h-4 w-4" />;
      case 'photo-share':
        return <Camera className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'check-in':
        return 'text-blue-500';
      case 'review':
        return 'text-yellow-500';
      case 'recipe':
        return 'text-green-500';
      case 'achievement':
        return 'text-purple-500';
      case 'bar-crawl':
        return 'text-pink-500';
      case 'photo-share':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleLike = (activityId: string) => {
    console.log('Liked activity:', activityId);
  };

  const handleShare = (activityId: string) => {
    console.log('Shared activity:', activityId);
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Start exploring to see updates here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    {activity.user && (
                      <p className="text-xs text-muted-foreground mt-1">by {activity.user}</p>
                    )}
                    {activity.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {activity.location}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {formatTimeAgo(activity.timestamp)}
                  </Badge>
                </div>

                {activity.imageUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={activity.imageUrl} 
                      alt={activity.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(activity.id)}
                    className={`h-8 px-2 ${activity.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${activity.isLiked ? 'fill-current' : ''}`} />
                    {activity.likes}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(activity.id)}
                    className="h-8 px-2 text-muted-foreground"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-2">
          <Button variant="outline" className="w-full">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeedWidget;
