
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  MessageSquare, 
  Calendar,
  Bell,
  BellOff,
  MoreHorizontal
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { formatDistanceToNow } from 'date-fns';
import { FollowerListProps } from '@/types/FollowerComponentTypes';
import FollowerErrorBoundary from './FollowerErrorBoundary';
import { FollowerListSkeleton } from './FollowerLoadingStates';

const FollowerList: React.FC<FollowerListProps> = ({ 
  promoterId, 
  searchTerm = '',
  filters,
  showActions = false,
  maxItems,
  className = '',
  onError,
  onSuccess
}) => {
  const { followers, isLoading } = useSubscriptions(promoterId);

  const filteredFollowers = useMemo(() => {
    if (!followers) return [];
    
    let filtered = followers.filter(follower => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        follower.subscriber_id.toLowerCase().includes(searchLower) ||
        (follower.promoter_name || '').toLowerCase().includes(searchLower)
      );

      if (!matchesSearch) return false;

      // Apply filters if provided
      if (filters) {
        if (filters.status && follower.follow_status !== filters.status) return false;
        if (filters.notificationsEnabled !== undefined) {
          const hasNotifications = follower.notification_preferences?.events ?? true;
          if (filters.notificationsEnabled !== hasNotifications) return false;
        }
        if (filters.joinedAfter && new Date(follower.created_at) < filters.joinedAfter) return false;
        if (filters.joinedBefore && new Date(follower.created_at) > filters.joinedBefore) return false;
      }

      return true;
    });

    // Limit results if maxItems is specified
    if (maxItems && filtered.length > maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [followers, searchTerm, filters, maxItems]);

  if (isLoading) {
    return <FollowerListSkeleton count={maxItems || 5} />;
  }

  if (filteredFollowers.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            {searchTerm ? 'No followers found matching your search.' : 'No followers yet.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Followers ({filteredFollowers.length})</span>
          {showActions && (
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Message All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredFollowers.map((follower, index) => {
            const joinedDate = new Date(follower.created_at);
            const hasNotifications = follower.notification_preferences?.events ?? true;
            
            return (
              <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${follower.subscriber_id}`} />
                    <AvatarFallback>
                      {follower.subscriber_id.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Follower #{index + 1}</h4>
                      {hasNotifications ? (
                        <Badge variant="secondary" className="text-xs">
                          <Bell className="h-3 w-3 mr-1" />
                          Notifications On
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <BellOff className="h-3 w-3 mr-1" />
                          Notifications Off
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {formatDistanceToNow(joinedDate, { addSuffix: true })}
                      </span>
                      <span>ID: {follower.subscriber_id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </div>

                {showActions && (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerList;
