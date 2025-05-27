
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { usePromoterNotificationTriggers } from '@/hooks/notifications/usePromoterNotificationTriggers';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { FollowerComponentProps } from '@/types/FollowerComponentTypes';
import FollowerErrorBoundary from './FollowerErrorBoundary';

interface FollowerNotificationCenterProps extends FollowerComponentProps {
  showRateLimit?: boolean;
}

const FollowerNotificationCenter: React.FC<FollowerNotificationCenterProps> = ({
  promoterId,
  showRateLimit = true,
  className = '',
  onError,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  
  const { followers, isLoading } = useSubscriptions(promoterId);
  const { triggerGeneralUpdate } = usePromoterNotificationTriggers();

  const handleSendNotification = async () => {
    if (!title.trim() || !content.trim()) {
      onError?.(new Error('Title and content are required'));
      return;
    }

    try {
      const result = await triggerGeneralUpdate.mutateAsync({
        promoterId,
        updateData: {
          title: title.trim(),
          content: content.trim(),
          priority
        }
      });

      if (result.success) {
        onSuccess?.(result);
        setTitle('');
        setContent('');
        setPriority('medium');
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const activeFollowers = followers?.filter(f => f.follow_status === 'active') || [];
  const isUrgent = priority === 'urgent';
  const isBatched = priority !== 'urgent';

  return (
    <FollowerErrorBoundary onError={onError}>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Notification Center
            </span>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {activeFollowers.length} followers
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rate Limit Warning */}
          {showRateLimit && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                You can send up to 10 notifications per hour. Non-urgent notifications are batched every 5 minutes to prevent spam.
              </AlertDescription>
            </Alert>
          )}

          {/* Notification Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="notification-title">Title</Label>
              <Input
                id="notification-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title..."
                maxLength={100}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {title.length}/100 characters
              </div>
            </div>

            <div>
              <Label htmlFor="notification-content">Message</Label>
              <Textarea
                id="notification-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your message to followers..."
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {content.length}/500 characters
              </div>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Send with next batch</SelectItem>
                  <SelectItem value="medium">Medium - Normal batching</SelectItem>
                  <SelectItem value="high">High - Priority batching</SelectItem>
                  <SelectItem value="urgent">Urgent - Send immediately</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Info */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                {isUrgent ? (
                  <>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Immediate Delivery</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Batched Delivery</span>
                  </>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isUrgent
                  ? `Will be sent immediately to ${activeFollowers.length} followers`
                  : `Will be batched and sent within 5 minutes to ${activeFollowers.length} followers`
                }
              </div>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendNotification}
            disabled={
              !title.trim() || 
              !content.trim() || 
              triggerGeneralUpdate.isPending ||
              isLoading ||
              activeFollowers.length === 0
            }
            className="w-full"
          >
            {triggerGeneralUpdate.isPending ? (
              'Sending...'
            ) : isUrgent ? (
              'Send Immediately'
            ) : (
              'Add to Batch Queue'
            )}
          </Button>

          {/* No Followers Warning */}
          {!isLoading && activeFollowers.length === 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have no active followers to notify. Grow your follower base first!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </FollowerErrorBoundary>
  );
};

export default FollowerNotificationCenter;
