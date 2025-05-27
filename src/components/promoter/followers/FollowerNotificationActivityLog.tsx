
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  Send, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Timer
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { FollowerComponentProps } from '@/types/FollowerComponentTypes';
import FollowerErrorBoundary from './FollowerErrorBoundary';

interface NotificationActivity {
  id: string;
  title: string;
  content: string;
  priority: string;
  created_at: string;
  metadata: any;
  recipient_count?: number;
}

const FollowerNotificationActivityLog: React.FC<FollowerComponentProps> = ({
  promoterId,
  className = '',
  onError
}) => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['promoter-notification-activity', promoterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('metadata->>promoter_id', promoterId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Group by title and created_at to get batch info
      const grouped = new Map<string, NotificationActivity>();
      
      data?.forEach(notification => {
        const key = `${notification.title}-${notification.created_at}`;
        if (grouped.has(key)) {
          const existing = grouped.get(key)!;
          existing.recipient_count = (existing.recipient_count || 0) + 1;
        } else {
          grouped.set(key, {
            id: notification.id,
            title: notification.title,
            content: notification.content,
            priority: notification.priority,
            created_at: notification.created_at,
            metadata: notification.metadata,
            recipient_count: 1
          });
        }
      });

      return Array.from(grouped.values()).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!promoterId
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <CheckCircle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'low':
        return <Timer className="h-4 w-4 text-gray-500" />;
      default:
        return <Send className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string, metadata: any) => {
    const isBatched = metadata?.batched;
    const sentImmediately = metadata?.sent_immediately;

    if (sentImmediately) {
      return <Badge variant="destructive" className="text-xs">Immediate</Badge>;
    }
    
    if (isBatched) {
      return <Badge variant="secondary" className="text-xs">Batched</Badge>;
    }

    return (
      <Badge 
        variant={priority === 'urgent' ? 'destructive' : 'default'} 
        className="text-xs"
      >
        {priority}
      </Badge>
    );
  };

  return (
    <FollowerErrorBoundary onError={onError}>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 border rounded animate-pulse">
                    <div className="h-4 w-4 bg-muted rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Send className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications sent yet</p>
                <p className="text-sm">Your notification activity will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded hover:bg-muted/50 transition-colors">
                    <div className="mt-0.5">
                      {getPriorityIcon(activity.priority)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {activity.title}
                        </h4>
                        <div className="flex items-center gap-2 ml-2">
                          {getPriorityBadge(activity.priority, activity.metadata)}
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {activity.recipient_count}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {activity.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </span>
                        {activity.metadata?.notification_type && (
                          <span className="capitalize">
                            {activity.metadata.notification_type.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </FollowerErrorBoundary>
  );
};

export default FollowerNotificationActivityLog;
