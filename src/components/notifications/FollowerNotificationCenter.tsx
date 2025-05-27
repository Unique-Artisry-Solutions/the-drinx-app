
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FollowerNotificationCenterProps } from '@/types/FollowerComponentTypes';
import { usePromoterNotificationTriggers } from '@/hooks/notifications/usePromoterNotificationTriggers';
import { Calendar, Send, Users, Clock } from 'lucide-react';

const FollowerNotificationCenter: React.FC<FollowerNotificationCenterProps> = ({
  promoterId,
  followerCount = 0,
  defaultMessage = '',
  allowScheduling = false,
  onError,
  onSuccess,
  className = ''
}) => {
  const [message, setMessage] = useState(defaultMessage);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [useScheduling, setUseScheduling] = useState(false);
  const [notificationType, setNotificationType] = useState<'general_update' | 'promotion' | 'event_update'>('general_update');

  const { toast } = useToast();
  const { triggerGeneralUpdate, triggerPromotion } = usePromoterNotificationTriggers();

  // Update message when defaultMessage prop changes
  useEffect(() => {
    if (defaultMessage) {
      setMessage(defaultMessage);
    }
  }, [defaultMessage]);

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide both title and message',
        variant: 'destructive'
      });
      return;
    }

    try {
      const notificationData = {
        title: title.trim(),
        content: message.trim(),
        priority
      };

      let result;
      if (notificationType === 'promotion') {
        result = await triggerPromotion.mutateAsync({
          promoterId,
          promotionData: {
            id: `promo-${Date.now()}`,
            title: title.trim(),
            discountCode: undefined
          }
        });
      } else {
        result = await triggerGeneralUpdate.mutateAsync({
          promoterId,
          updateData: notificationData
        });
      }

      if (result.success) {
        setTitle('');
        setMessage('');
        setUseScheduling(false);
        setScheduleDate('');
        setScheduleTime('');
        
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  };

  const isLoading = triggerGeneralUpdate.isPending || triggerPromotion.isPending;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Notify Followers
          {followerCount > 0 && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {followerCount} followers
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notification-type">Notification Type</Label>
          <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general_update">General Update</SelectItem>
              <SelectItem value="promotion">Promotion</SelectItem>
              <SelectItem value="event_update">Event Update</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message to followers"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
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
                id="schedule-notification"
                checked={useScheduling}
                onCheckedChange={setUseScheduling}
              />
              <Label htmlFor="schedule-notification" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule for later
              </Label>
            </div>

            {useScheduling && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-date">Date</Label>
                  <Input
                    id="schedule-date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule-time">Time</Label>
                  <Input
                    id="schedule-time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={handleSendNotification}
          disabled={isLoading || !title.trim() || !message.trim()}
          className="w-full"
        >
          {isLoading ? 'Sending...' : useScheduling ? 'Schedule Notification' : 'Send Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationCenter;
