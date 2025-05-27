
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFollowerNotifications } from '@/hooks/notifications/useFollowerNotifications';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Users, 
  Mail, 
  Bell, 
  Gift,
  Calendar,
  Target
} from 'lucide-react';

export interface FollowerNotificationCenterProps {
  promoterId: string;
  followerCount: number;
}

const FollowerNotificationCenter: React.FC<FollowerNotificationCenterProps> = ({ 
  promoterId, 
  followerCount 
}) => {
  const { sendBulkNotification, scheduleNotification, isLoading } = useFollowerNotifications(promoterId);
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('instant');
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    targetType: 'all' as 'all' | 'tier' | 'specific',
    specificTiers: [] as string[],
    discountCode: '',
    includeEmail: true,
    includePush: true,
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });

  const handleSendNotification = async () => {
    if (!notification.title.trim() || !notification.message.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both title and message',
        variant: 'destructive'
      });
      return;
    }

    try {
      await sendBulkNotification({
        targetType: notification.targetType,
        specificTiers: notification.specificTiers,
        message: notification.message,
        discountCode: notification.discountCode,
        includeEmail: notification.includeEmail,
        includePush: notification.includePush,
        title: notification.title,
        priority: notification.priority
      });

      // Reset form
      setNotification({
        title: '',
        message: '',
        targetType: 'all',
        specificTiers: [],
        discountCode: '',
        includeEmail: true,
        includePush: true,
        priority: 'medium'
      });

      toast({
        title: 'Success',
        description: 'Notification sent successfully to your followers!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send notification. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Follower Notification Center
          <Badge variant="secondary" className="ml-auto">
            <Users className="h-3 w-3 mr-1" />
            {followerCount.toLocaleString()} followers
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="instant">
              <Send className="h-4 w-4 mr-2" />
              Instant
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <Calendar className="h-4 w-4 mr-2" />
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Target className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instant" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Notification Title</Label>
                <Input
                  id="title"
                  value={notification.title}
                  onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter notification title..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={notification.message}
                  onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Write your message to followers..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="discountCode">Discount Code (Optional)</Label>
                <Input
                  id="discountCode"
                  value={notification.discountCode}
                  onChange={(e) => setNotification(prev => ({ ...prev, discountCode: e.target.value }))}
                  placeholder="Enter discount code..."
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includeEmail"
                    checked={notification.includeEmail}
                    onChange={(e) => setNotification(prev => ({ ...prev, includeEmail: e.target.checked }))}
                  />
                  <Label htmlFor="includeEmail" className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="includePush"
                    checked={notification.includePush}
                    onChange={(e) => setNotification(prev => ({ ...prev, includePush: e.target.checked }))}
                  />
                  <Label htmlFor="includePush" className="flex items-center gap-1">
                    <Bell className="h-4 w-4" />
                    Push
                  </Label>
                </div>
              </div>

              <Button 
                onClick={handleSendNotification}
                disabled={isLoading || !notification.title.trim() || !notification.message.trim()}
                className="w-full"
              >
                {isLoading ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Scheduled notifications coming soon!</p>
              <p className="text-sm">Plan your follower communications in advance.</p>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Message templates coming soon!</p>
              <p className="text-sm">Save time with pre-made message templates.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationCenter;
