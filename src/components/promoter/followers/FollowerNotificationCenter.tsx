
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { usePromoterNotificationTriggers } from '@/hooks/notifications/usePromoterNotificationTriggers';
import { FollowerNotificationCenterProps } from '@/types/FollowerComponentTypes';
import { Bell, Clock, Send, Users } from 'lucide-react';

const FollowerNotificationCenter: React.FC<FollowerNotificationCenterProps> = ({
  promoterId,
  followerCount = 0,
  defaultMessage = '',
  allowScheduling = true,
  className = '',
  onError,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(defaultMessage);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { triggerGeneralUpdate } = usePromoterNotificationTriggers();

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide both title and message',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await triggerGeneralUpdate.mutateAsync({
        promoterId,
        updateData: {
          title: title.trim(),
          content: message.trim(),
          priority
        }
      });

      // Reset form
      setTitle('');
      setMessage(defaultMessage);
      setPriority('medium');
      setIsScheduled(false);
      setScheduledTime('');

      if (onSuccess) {
        onSuccess({ followerCount, title, message });
      }

      toast({
        title: 'Notification Sent',
        description: `Successfully notified ${followerCount} followers`,
      });
    } catch (error: any) {
      console.error('Error sending notification:', error);
      
      if (onError) {
        onError(error);
      }

      toast({
        title: 'Error',
        description: error.message || 'Failed to send notification',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Center
          <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {followerCount} followers
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Notification title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Write your message to followers..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {allowScheduling && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="schedule"
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
                disabled={isLoading}
              />
              <Label htmlFor="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule for later
              </Label>
            </div>

            {isScheduled && (
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  disabled={isLoading}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSendNotification}
            disabled={isLoading || !title.trim() || !message.trim()}
            className="flex-1"
          >
            <Send className="h-4 w-4 mr-2" />
            {isScheduled ? 'Schedule Notification' : 'Send Now'}
          </Button>
        </div>

        {followerCount > 0 && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            This notification will be sent to {followerCount} active followers.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationCenter;
