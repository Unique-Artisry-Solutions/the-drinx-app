
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useFollowerNotifications } from '@/hooks/notifications/useFollowerNotifications';
import { FollowerNotificationRequest } from '@/types/FollowerNotificationTypes';
import { Send, Users, Bell } from 'lucide-react';

interface FollowerNotificationCenterProps {
  promoterId: string;
  followerCount?: number; // Make it optional with default
}

const FollowerNotificationCenter: React.FC<FollowerNotificationCenterProps> = ({ 
  promoterId, 
  followerCount = 0 // Default to 0 if not provided
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [includeEmail, setIncludeEmail] = useState(true);
  const [includePush, setIncludePush] = useState(false);
  
  const { 
    segments, 
    isLoading, 
    sendBulkNotification 
  } = useFollowerNotifications(promoterId);

  // Use actual follower count from segments if available
  const actualFollowerCount = segments.find(s => s.id === 'all')?.count ?? followerCount;

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      return;
    }

    const request: FollowerNotificationRequest = {
      targetType: 'all',
      title: title.trim(),
      message: message.trim(),
      discountCode: discountCode.trim() || undefined,
      includeEmail,
      includePush,
      priority: 'medium'
    };

    try {
      await sendBulkNotification.mutateAsync(request);
      setTitle('');
      setMessage('');
      setDiscountCode('');
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
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
    <Card>
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
          disabled={!title.trim() || !message.trim() || sendBulkNotification.isPending}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {sendBulkNotification.isPending ? 'Sending...' : 'Send Notification'}
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
  );
};

export default FollowerNotificationCenter;
