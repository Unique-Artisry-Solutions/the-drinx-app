
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFollowerNotifications } from '@/hooks/notifications/useFollowerNotifications';
import { FollowerNotificationRequest } from '@/types/FollowerNotificationTypes';
import { FollowerNotificationProps } from '@/types/FollowerComponentTypes';
import { Send, Users, Bell, Clock } from 'lucide-react';
import FollowerErrorBoundary from './FollowerErrorBoundary';

const FollowerNotificationCenter: React.FC<FollowerNotificationProps> = ({ 
  promoterId, 
  followerCount = 0,
  defaultMessage = '',
  allowScheduling = false,
  className = '',
  onError,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(defaultMessage);
  const [discountCode, setDiscountCode] = useState('');
  const [includeEmail, setIncludeEmail] = useState(true);
  const [includePush, setIncludePush] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  
  const { 
    segments, 
    isLoading, 
    sendBulkNotification,
    scheduleNotification 
  } = useFollowerNotifications(promoterId);

  // Use actual follower count from segments if available
  const actualFollowerCount = segments.find(s => s.id === 'all')?.count ?? followerCount;

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      const error = new Error('Title and message are required');
      onError?.(error);
      return;
    }

    try {
      const request: FollowerNotificationRequest = {
        targetType: 'all',
        title: title.trim(),
        message: message.trim(),
        discountCode: discountCode.trim() || undefined,
        includeEmail,
        includePush,
        priority: 'medium'
      };

      if (isScheduled && allowScheduling && scheduledDate) {
        await scheduleNotification.mutateAsync({
          ...request,
          scheduledFor: new Date(scheduledDate)
        });
      } else {
        const result = await sendBulkNotification.mutateAsync(request);
        onSuccess?.(result);
      }

      // Reset form
      setTitle('');
      setMessage(defaultMessage);
      setDiscountCode('');
      setScheduledDate('');
      setIsScheduled(false);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to send notification'));
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <FollowerErrorBoundary onRetry={() => window.location.reload()}>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notify Followers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Send messages to your {actualFollowerCount.toLocaleString()} followers
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title..."
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message to followers..."
              rows={4}
              maxLength={500}
            />
          </div>

          <div>
            <Label htmlFor="discount">Discount Code (Optional)</Label>
            <Input
              id="discount"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="SAVE20"
              maxLength={20}
            />
          </div>

          {allowScheduling && (
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                />
                <span className="text-sm flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Schedule for later
                </span>
              </label>
              {isScheduled && (
                <Input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeEmail}
                onChange={(e) => setIncludeEmail(e.target.checked)}
              />
              <span className="text-sm">Email</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includePush}
                onChange={(e) => setIncludePush(e.target.checked)}
              />
              <span className="text-sm">Push</span>
            </label>
          </div>

          <Button
            onClick={handleSendNotification}
            disabled={!title.trim() || !message.trim() || sendBulkNotification.isPending || scheduleNotification.isPending}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {sendBulkNotification.isPending || scheduleNotification.isPending 
              ? 'Sending...' 
              : isScheduled 
                ? 'Schedule Notification' 
                : 'Send Notification'
            }
          </Button>

          {segments.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Target Segments:</h4>
              <div className="space-y-1">
                {segments.map((segment) => (
                  <div key={segment.id} className="flex items-center gap-2 text-sm">
                    <Users className="h-3 w-3" />
                    <span>{segment.name}: {segment.count} followers</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </FollowerErrorBoundary>
  );
};

export default FollowerNotificationCenter;
