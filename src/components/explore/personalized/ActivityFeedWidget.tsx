
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Heart, Trophy, Camera, Users } from 'lucide-react';

interface ActivityUser {
  id: string;
  name: string;
  avatar?: string;
}

interface ActivityItem {
  id: string;
  type: 'check-in' | 'recipe' | 'favorite' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  user: ActivityUser;
  likes: number;
  isLiked: boolean;
  imageUrl?: string;
}

interface ActivityFeedWidgetProps {
  activities?: ActivityItem[];
}

const NewUserGuidanceItems = [
  {
    icon: MapPin,
    title: "Check into a nearby establishment",
    description: "Find sober-friendly venues and earn points for visiting",
    color: "text-blue-600"
  },
  {
    icon: Camera,
    title: "Share your first mocktail photo",
    description: "Document your alcohol-free journey and inspire others",
    color: "text-green-600"
  },
  {
    icon: Heart,
    title: "Save your favorite recipes",
    description: "Build your personal collection of amazing mocktails",
    color: "text-red-600"
  },
  {
    icon: Users,
    title: "Follow interesting promoters",
    description: "Stay updated on sober events and community activities",
    color: "text-purple-600"
  }
];

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({
  activities = []
}) => {
  const isNewUser = activities.length === 0;

  if (isNewUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Get Started with Your Sober Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Here are some ways to begin building your alcohol-free social life:
            </p>
            {NewUserGuidanceItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <IconComponent className={`h-5 w-5 mt-0.5 ${item.color}`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              );
            })}
            <div className="pt-4 border-t">
              <Button className="w-full" size="sm">
                Explore Nearby Places
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex space-x-3 p-3 rounded-lg border">
              <div className="flex-shrink-0">
                <img
                  src={activity.user.avatar || '/placeholder.svg'}
                  alt={activity.user.name}
                  className="w-8 h-8 rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                      </div>
                      {activity.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {activity.imageUrl && (
                    <img
                      src={activity.imageUrl}
                      alt="Activity"
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-red-500">
                    <Heart className={`h-3 w-3 ${activity.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{activity.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
