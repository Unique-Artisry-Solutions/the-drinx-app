
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFollowers, FollowerData } from '@/hooks/useFollowers';
import { Bell, MessageCircle, Mail } from 'lucide-react';

interface FollowerNotificationIntegrationProps {
  promoterId: string;
}

const FollowerNotificationIntegration: React.FC<FollowerNotificationIntegrationProps> = ({ 
  promoterId 
}) => {
  const { followers, sendNotification } = useFollowers(promoterId);

  const handleSendWelcomeNotifications = async () => {
    const recentFollowers = followers
      .filter(f => {
        const followDate = new Date(f.created_at);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return followDate > dayAgo;
      })
      .map(f => f.subscriber_id);

    if (recentFollowers.length > 0) {
      await sendNotification.mutateAsync({
        followerIds: recentFollowers,
        message: "Welcome to our community! We're excited to have you here.",
        title: "Welcome!"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleSendWelcomeNotifications}
            disabled={sendNotification.isPending}
          >
            <MessageCircle className="h-4 w-4" />
            Welcome New Followers
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled
          >
            <Mail className="h-4 w-4" />
            Email Campaign
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled
          >
            <Bell className="h-4 w-4" />
            Push Notifications
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Total followers: {followers.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerNotificationIntegration;
