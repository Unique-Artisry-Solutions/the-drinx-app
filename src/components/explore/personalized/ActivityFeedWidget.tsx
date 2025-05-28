
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Activity, 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Trophy, 
  Camera, 
  Users,
  ChefHat,
  Filter,
  TrendingUp,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeActivity, RealtimeActivity } from '@/hooks/useRealtimeActivity';
import { NotificationService } from '@/services/NotificationService';
import { OfflineService } from '@/services/OfflineService';

export interface ActivityFeedWidgetProps {
  activities?: RealtimeActivity[];
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ 
  activities: propActivities 
}) => {
  const { activities, isLoading, likeActivity, shareActivity } = useRealtimeActivity();
  const [activeFilter, setActiveFilter] = useState<'all' | 'friends' | 'nearby' | 'trending'>('all');
  const [selectedActivity, setSelectedActivity] = useState<RealtimeActivity | null>(null);

  const displayActivities = propActivities || activities;

  const getActivityIcon = (type: RealtimeActivity['type']) => {
    switch (type) {
      case 'check-in': return <MapPin className="h-4 w-4" />;
      case 'review': return <MessageCircle className="h-4 w-4" />;
      case 'recipe': return <ChefHat className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'bar-crawl': return <Users className="h-4 w-4" />;
      case 'photo-share': return <Camera className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: RealtimeActivity['type']) => {
    switch (type) {
      case 'check-in': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'review': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'recipe': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'achievement': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'bar-crawl': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      case 'photo-share': return 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleLike = async (activity: RealtimeActivity) => {
    if (OfflineService.isOffline()) {
      OfflineService.queueAction('like_activity', { activityId: activity.id });
      NotificationService.addNotification({
        title: 'Action queued',
        message: 'Your like will be processed when you\'re back online',
        type: 'info'
      });
      return;
    }

    await likeActivity(activity.id);
    NotificationService.addNotification({
      title: activity.isLiked ? 'Unliked' : 'Liked!',
      message: `You ${activity.isLiked ? 'unliked' : 'liked'} ${activity.user.name}'s activity`,
      type: 'success'
    });
  };

  const handleShare = async (activity: RealtimeActivity) => {
    await shareActivity(activity.id);
    NotificationService.addNotification({
      title: 'Shared successfully!',
      message: `${activity.user.name}'s activity has been shared`,
      type: 'success'
    });
  };

  const filteredActivities = displayActivities.filter(activity => {
    switch (activeFilter) {
      case 'friends':
        return activity.metadata?.is_friend;
      case 'nearby':
        return activity.location;
      case 'trending':
        return activity.likes > 10;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Community Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Community Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeFilter} onValueChange={(value: any) => setActiveFilter(value)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="friends" className="text-xs">Friends</TabsTrigger>
            <TabsTrigger value="nearby" className="text-xs">Nearby</TabsTrigger>
            <TabsTrigger value="trending" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Hot
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeFilter} className="space-y-4">
            <AnimatePresence mode="wait">
              {filteredActivities.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity in this category yet</p>
                </motion.div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="p-4 hover:shadow-sm transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary/50">
                        <div className="flex gap-3">
                          {/* Avatar */}
                          <Avatar className="h-8 w-8 ring-2 ring-background">
                            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                            <AvatarFallback className="text-xs">
                              {activity.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`p-1 rounded-full ${getActivityColor(activity.type)}`}>
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{activity.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatTimeAgo(activity.timestamp)}</span>
                                  {activity.location && (
                                    <>
                                      <span>•</span>
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate">{activity.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {activity.description}
                            </p>

                            {/* Image */}
                            {activity.imageUrl && (
                              <div className="mb-3 rounded-lg overflow-hidden">
                                <img 
                                  src={activity.imageUrl} 
                                  alt="Activity"
                                  className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                  onClick={() => setSelectedActivity(activity)}
                                />
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLike(activity)}
                                  className={`h-8 px-2 ${activity.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                                >
                                  <Heart className={`h-4 w-4 mr-1 ${activity.isLiked ? 'fill-current' : ''}`} />
                                  <span className="text-xs">{activity.likes}</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleShare(activity)}
                                  className="h-8 px-2 text-muted-foreground"
                                >
                                  <Share2 className="h-4 w-4 mr-1" />
                                  <span className="text-xs">Share</span>
                                </Button>
                              </div>

                              {/* Activity type badge */}
                              <Badge variant="outline" className="text-xs capitalize">
                                {activity.type.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>

        {/* Activity Detail Modal */}
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-lg">
            {selectedActivity && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${getActivityColor(selectedActivity.type)}`}>
                      {getActivityIcon(selectedActivity.type)}
                    </div>
                    {selectedActivity.title}
                  </DialogTitle>
                  <DialogDescription>
                    By {selectedActivity.user.name} • {formatTimeAgo(selectedActivity.timestamp)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {selectedActivity.imageUrl && (
                    <img 
                      src={selectedActivity.imageUrl} 
                      alt="Activity"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-sm">{selectedActivity.description}</p>
                  {selectedActivity.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedActivity.location}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(selectedActivity)}
                        className={activity.isLiked ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${selectedActivity.isLiked ? 'fill-current' : ''}`} />
                        {selectedActivity.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(selectedActivity)}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {selectedActivity.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ActivityFeedWidget;
