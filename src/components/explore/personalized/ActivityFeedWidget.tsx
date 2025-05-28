
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, User, MapPin, Heart, MessageCircle, Share2, Activity, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Activity {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  location?: string;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
}

export interface ActivityFeedWidgetProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  {
    id: '1',
    type: 'check-in',
    title: 'Sarah checked in',
    description: 'At The Mocktail Lounge with an amazing Virgin Mojito!',
    timestamp: '2 hours ago',
    user: 'Sarah',
    location: 'The Mocktail Lounge',
    likes: 12,
    comments: 3,
    isLiked: false
  },
  {
    id: '2',
    type: 'review',
    title: 'New review posted',
    description: 'Amazing virgin piña colada! The presentation was incredible and taste even better.',
    timestamp: '4 hours ago',
    user: 'Mike',
    likes: 8,
    comments: 1,
    isLiked: true
  },
  {
    id: '3',
    type: 'recipe',
    title: 'Recipe shared',
    description: 'Cucumber Mint Refresher - perfect for summer days!',
    timestamp: '6 hours ago',
    user: 'Emma',
    likes: 15,
    comments: 5,
    isLiked: false
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Achievement unlocked',
    description: 'Completed first bar crawl circuit! 🎉',
    timestamp: '1 day ago',
    user: 'Alex',
    likes: 23,
    comments: 7,
    isLiked: true
  }
];

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ 
  activities = defaultActivities 
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [filter, setFilter] = useState<Activity['type'] | 'all'>('all');
  const [likedActivities, setLikedActivities] = useState<Set<string>>(
    new Set(activities.filter(a => a.isLiked).map(a => a.id))
  );

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const handleLike = (activityId: string) => {
    setLikedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'check-in':
        return <MapPin className="h-4 w-4" />;
      case 'review':
        return <MessageCircle className="h-4 w-4" />;
      case 'recipe':
        return <User className="h-4 w-4" />;
      case 'achievement':
        return <Activity className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'check-in':
        return 'bg-blue-500 text-white';
      case 'review':
        return 'bg-green-500 text-white';
      case 'recipe':
        return 'bg-purple-500 text-white';
      case 'achievement':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-900/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              Community Activity
            </CardTitle>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  variants={itemVariants}
                  layout
                  className="group cursor-pointer"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="p-4 rounded-lg border border-gray-100 hover:border-primary/30 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)} flex-shrink-0`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{activity.timestamp}</span>
                            {activity.location && (
                              <>
                                <span className="mx-1">•</span>
                                <MapPin className="h-3 w-3" />
                                <span>{activity.location}</span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(activity.id);
                              }}
                            >
                              <Heart className={`h-3 w-3 mr-1 ${
                                likedActivities.has(activity.id) ? 'fill-red-500 text-red-500' : ''
                              }`} />
                              {activity.likes || 0}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Comment on', activity.title);
                              }}
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {activity.comments || 0}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Share', activity.title);
                              }}
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedActivity && getActivityIcon(selectedActivity.type)}
              {selectedActivity?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedActivity?.user && `By ${selectedActivity.user}`}
              {selectedActivity?.timestamp && ` • ${selectedActivity.timestamp}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">{selectedActivity?.description}</p>
            
            {selectedActivity?.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{selectedActivity.location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => selectedActivity && handleLike(selectedActivity.id)}
              >
                <Heart className={`h-4 w-4 ${
                  selectedActivity && likedActivities.has(selectedActivity.id) ? 'fill-red-500 text-red-500' : ''
                }`} />
                {selectedActivity?.likes || 0} Likes
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {selectedActivity?.comments || 0} Comments
              </Button>
              
              <Button variant="outline" size="sm" className="ml-auto">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
