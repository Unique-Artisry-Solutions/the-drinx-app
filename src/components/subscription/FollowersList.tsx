
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';
import { usePromoterFollowers } from '@/hooks/promoter/usePromoterFollowers';
import { FollowerData } from '@/types/PromoterTypes';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface NotificationPreferences {
  events?: boolean;
  promotions?: boolean;
  announcements?: boolean;
}

interface FollowersListProps {
  showManagement?: boolean;
}

const FollowersList: React.FC<FollowersListProps> = ({ showManagement = false }) => {
  const { followers, loading, updateFollowerPreferences } = usePromoterFollowers();

  const handleTogglePreference = async (followerId: string, preferences: NotificationPreferences) => {
    try {
      await updateFollowerPreferences(followerId, preferences);
    } catch (error) {
      console.error("Failed to update notification preferences", error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Handle notification preference parsing from different object structures
  const getPreference = (preferences: any, key: string, defaultValue = false): boolean => {
    if (!preferences) return defaultValue;
    
    if (Array.isArray(preferences)) {
      // Handle array format
      return preferences.includes(key);
    } else if (typeof preferences === 'object') {
      // Handle object format
      return preferences[key] === true;
    }
    return defaultValue;
  };
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Followers
          {!loading && (
            <Badge variant="secondary" className="ml-2">
              {followers.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : followers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No followers yet</p>
            <p className="text-sm mt-2">Invite people to follow your promoter profile</p>
            <Button className="mt-4" variant="outline">
              Share Profile
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {followers.map((follower) => (
                <div key={follower.id} className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={follower.avatar_url || undefined} alt={follower.display_name || 'Follower'} />
                      <AvatarFallback>
                        {follower.display_name ? getInitials(follower.display_name) : 'F'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{follower.display_name || 'Anonymous Follower'}</p>
                      <p className="text-sm text-gray-500">Following since {new Date(follower.follow_date).toLocaleDateString()}</p>
                      {showManagement && follower.notification_preferences && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant={
                            getPreference(follower.notification_preferences, 'events') 
                              ? "default" 
                              : "outline"
                          } className="text-xs">
                            Events
                          </Badge>
                          <Badge variant={
                            getPreference(follower.notification_preferences, 'promotions') 
                              ? "default" 
                              : "outline"
                          } className="text-xs">
                            Promotions
                          </Badge>
                          <Badge variant={
                            getPreference(follower.notification_preferences, 'announcements') 
                              ? "default" 
                              : "outline"
                          } className="text-xs">
                            Announcements
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {showManagement && (
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={follower.notification_preferences && 
                          getPreference(follower.notification_preferences, 'events')}
                        onCheckedChange={(checked) => handleTogglePreference(
                          follower.id, 
                          { 
                            ...follower.notification_preferences as NotificationPreferences, 
                            events: checked 
                          }
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowersList;
