
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bell, 
  Users, 
  Calendar,
  MessageSquare,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FollowerNotificationProps } from '@/types/FollowerComponentTypes';
import { FollowerNotificationRequest } from '@/types/FollowerNotificationTypes';
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
  const [notification, setNotification] = useState<FollowerNotificationRequest>({
    targetType: 'all',
    message: defaultMessage,
    title: '',
    includeEmail: true,
    includePush: true,
    priority: 'medium'
  });
  
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const { toast } = useToast();

  const handleSendNotification = async () => {
    if (!notification.title.trim() || !notification.message.trim()) {
      const error = new Error('Title and message are required');
      onError?.(error);
      toast({
        title: 'Validation Error',
        description: 'Please provide both a title and message',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = {
        success: true,
        sentCount: getTargetCount(),
        scheduledFor: isScheduled ? `${scheduledDate} ${scheduledTime}` : undefined
      };

      onSuccess?.(result);
      
      toast({
        title: isScheduled ? 'Notification Scheduled' : 'Notification Sent',
        description: `Successfully ${isScheduled ? 'scheduled' : 'sent'} to ${result.sentCount} followers`,
      });

      // Reset form
      setNotification({
        targetType: 'all',
        message: '',
        title: '',
        includeEmail: true,
        includePush: true,
        priority: 'medium'
      });
      setIsScheduled(false);
      setScheduledDate('');
      setScheduledTime('');
      
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Failed to send notification');
      onError?.(errorObj);
      toast({
        title: 'Error',
        description: errorObj.message,
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const getTargetCount = () => {
    switch (notification.targetType) {
      case 'all':
        return followerCount;
      case 'tier':
        return Math.floor(followerCount * 0.6); // Mock: 60% of followers
      case 'specific':
        return notification.specificTiers?.length || 0;
      default:
        return 0;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Notification Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Target Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Target Audience
          </Label>
          <Select 
            value={notification.targetType} 
            onValueChange={(value: 'all' | 'tier' | 'specific') => 
              setNotification(prev => ({ ...prev, targetType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Followers ({followerCount})</SelectItem>
              <SelectItem value="tier">By Tier</SelectItem>
              <SelectItem value="specific">Specific Groups</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Will reach approximately {getTargetCount().toLocaleString()} followers
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Notification Title</Label>
            <Input
              id="title"
              placeholder="Enter notification title..."
              value={notification.title}
              onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message to followers..."
              rows={4}
              value={notification.message}
              onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount Code (Optional)</Label>
            <Input
              id="discount"
              placeholder="e.g., SAVE20"
              value={notification.discountCode || ''}
              onChange={(e) => setNotification(prev => ({ ...prev, discountCode: e.target.value }))}
            />
          </div>
        </div>

        {/* Priority and Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Priority Level</Label>
            <Select 
              value={notification.priority} 
              onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                setNotification(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Badge className={getPriorityColor(notification.priority)}>
              {notification.priority.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-3">
            <Label>Delivery Channels</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email"
                  checked={notification.includeEmail}
                  onCheckedChange={(checked) => 
                    setNotification(prev => ({ ...prev, includeEmail: checked }))
                  }
                />
                <Label htmlFor="email" className="text-sm">Email notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="push"
                  checked={notification.includePush}
                  onCheckedChange={(checked) => 
                    setNotification(prev => ({ ...prev, includePush: checked }))
                  }
                />
                <Label htmlFor="push" className="text-sm">Push notifications</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduling (if allowed) */}
        {allowScheduling && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="schedule"
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
              />
              <Label htmlFor="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule for later
              </Label>
            </div>
            
            {isScheduled && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date" className="text-sm">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-sm">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Send Button */}
        <Button 
          onClick={handleSendNotification}
          disabled={isSending || !notification.title.trim() || !notification.message.trim()}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSending 
            ? 'Sending...' 
            : isScheduled 
              ? 'Schedule Notification' 
              : 'Send Notification'
          }
        </Button>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationCenter;
