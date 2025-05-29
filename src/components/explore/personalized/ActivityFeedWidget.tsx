
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  ChefHat, 
  Award, 
  Route, 
  Camera,
  Clock,
  TrendingUp,
  Users,
  Filter
} from 'lucide-react';
import { useRealtimeActivity, RealtimeActivity } from '@/hooks/useRealtimeActivity';
import { Activity } from './types';

interface ActivityFeedWidgetProps {
  activities: Activity[];
}

const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({ activities }) => {
  const { activities: realtimeActivities, likeActivity, shareActivity } = useRealtimeActivity();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'friends' | 'nearby'>('all');

  // Category configurations with enhanced metadata
  const categoryConfig = {
    'check-in': {
      icon: MapPin,
      label: 'Check-ins',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      count: realtimeActivities.filter(a => a.type === 'check-in').length
    },
    'review': {
      icon: Star,
      label: 'Reviews',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      count: realtimeActivities.filter(a => a.type === 'review').length
    },
    'recipe': {
      icon: ChefHat,
      label: 'Recipes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      count: realtimeActivities.filter(a => a.type === 'recipe').length
    },
    'achievement': {
      icon: Award,
      label: 'Achievements',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      count: realtimeActivities.filter(a => a.type === 'achievement').length
    },
    'bar-crawl': {
      icon: Route,
      label: 'Bar Crawls',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      count: realtimeActivities.filter(a => a.type === 'bar-crawl').length
    },
    'photo-share': {
      icon: Camera,
      label: 'Photos',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      count: realtimeActivities.filter(a => a.type === 'photo-share').length
    }
  };

  const getFilteredActivities = (type?: string) => {
    let filtered = realtimeActivities;
    
    if (type && type !== 'all') {
      filtered = filtered.filter(activity => activity.type === type);
    }
    
    if (filterMode === 'friends') {
      // Mock filter for demonstration
      filtered = filtered.filter((_, index) => index % 2 === 0);
    } else if (filterMode === 'nearby') {
      filtered = filtered.filter(activity => activity.location);
    }
    
    return filtered;
  };

  const renderActivityItem = (activity: RealtimeActivity) => {
    const config = categoryConfig[activity.type as keyof typeof categoryConfig];
    const IconComponent = config?.icon || MapPin;

    return (
      <div key={activity.id} className="border-b border-gray-100 pb-4 last:border-b-0">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1 rounded ${config?.bgColor}`}>
                <IconComponent className={`h-3 w-3 ${config?.color}`} />
              </div>
              <span className="text-sm font-medium">{activity.title}</span>
              <Badge variant="outline" className="text-xs">
                {config?.label}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {activity.description}
            </p>
            
            {activity.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                {activity.location}
              </div>
            )}
            
            {activity.imageUrl && (
              <div className="mb-2">
                <img 
                  src={activity.imageUrl} 
                  alt="Activity" 
                  className="w-full max-w-xs h-32 object-cover rounded"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => likeActivity(activity.id)}
                  className={`p-1 h-auto ${activity.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                >
                  <Heart className={`h-4 w-4 ${activity.isLiked ? 'fill-current' : ''}`} />
                  <span className="ml-1 text-xs">{activity.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => shareActivity(activity.id)}
                  className="p-1 h-auto text-muted-foreground"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="ml-1 text-xs">Share</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {new Date(activity.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategoryStream = (type: string) => {
    const filteredActivities = getFilteredActivities(type === 'all' ? undefined : type);
    
    if (filteredActivities.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <div className="mb-2">No {type === 'all' ? 'recent' : categoryConfig[type as keyof typeof categoryConfig]?.label.toLowerCase()} activity</div>
          <div className="text-sm">Check back later for updates!</div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredActivities.map(renderActivityItem)}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Community Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterMode(filterMode === 'all' ? 'friends' : filterMode === 'friends' ? 'nearby' : 'all')}
              className="text-xs"
            >
              <Filter className="h-3 w-3 mr-1" />
              {filterMode === 'all' ? 'All' : filterMode === 'friends' ? 'Friends' : 'Nearby'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
            <TabsTrigger value="all" className="flex items-center gap-1 text-xs px-2 py-1">
              <Users className="h-3 w-3" />
              All
              <Badge variant="secondary" className="ml-1 text-xs">
                {realtimeActivities.length}
              </Badge>
            </TabsTrigger>
            
            {Object.entries(categoryConfig).map(([type, config]) => (
              <TabsTrigger 
                key={type} 
                value={type} 
                className="flex items-center gap-1 text-xs px-2 py-1"
              >
                <config.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{config.label}</span>
                {config.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {config.count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4">
            <TabsContent value="all" className="mt-0">
              {renderCategoryStream('all')}
            </TabsContent>
            
            {Object.keys(categoryConfig).map(type => (
              <TabsContent key={type} value={type} className="mt-0">
                {renderCategoryStream(type)}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityFeedWidget;
