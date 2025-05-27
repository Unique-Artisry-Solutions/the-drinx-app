
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

interface FollowerListProps {
  promoterId: string;
  searchTerm?: string;
}

const FollowerList: React.FC<FollowerListProps> = ({ promoterId, searchTerm = '' }) => {
  const { followers, isLoading } = useSubscriptions(promoterId);

  const filteredFollowers = useMemo(() => {
    if (!followers) return [];
    
    return followers.filter(follower => {
      const searchLower = searchTerm.toLowerCase();
      return (
        follower.subscriber_id.toLowerCase().includes(searchLower) ||
        (follower.promoter_name || '').toLowerCase().includes(searchLower)
      );
    });
  }, [followers, searchTerm]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredFollowers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            {searchTerm ? 'No followers found matching your search.' : 'No followers yet.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Followers ({filteredFollowers.length})</span>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Message All
          </Button>
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

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerList;
