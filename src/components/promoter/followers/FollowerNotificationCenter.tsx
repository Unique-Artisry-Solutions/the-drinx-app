
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Send, 
  Bell, 
  Mail, 
  MessageSquare,
  Calendar,
  Gift,
  Megaphone
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useToast } from '@/hooks/use-toast';

interface FollowerNotificationCenterProps {
  promoterId: string;
}

const FollowerNotificationCenter: React.FC<FollowerNotificationCenterProps> = ({ promoterId }) => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [includeEmail, setIncludeEmail] = useState(true);
  const [includePush, setIncludePush] = useState(true);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  
  const { followers, sendNotification } = useSubscriptions(promoterId);
  const { toast } = useToast();

  const handleSendNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and message',
        variant: 'destructive'
      });
      return;
    }

    try {
      await sendNotification.mutateAsync({
        promoterId,
        notification: {
          title: notificationTitle,
          message: notificationMessage,
          includeEmail,
          includePush,
          priority,
          targetType: 'all'
        }
      });

      // Reset form
      setNotificationTitle('');
      setNotificationMessage('');
      
      toast({
        title: 'Notification Sent!',
        description: `Your message has been sent to ${followers.length} followers`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send notification',
        variant: 'destructive'
      });
    }
  };

  const notificationTemplates = [
    {
      title: "New Event Announcement",
      icon: Calendar,
      template: {
        title: "🎉 New Event: [Event Name]",
        message: "We're excited to announce our upcoming event! Join us for an amazing experience. Check out all the details and get your tickets now."
      }
    },
    {
      title: "Weekly Update",
      icon: Megaphone,
      template: {
        title: "Weekly Update from [Your Name]",
        message: "Here's what's happening this week! We have some exciting updates to share with you..."
      }
    },
    {
      title: "Special Promotion",
      icon: Gift,
      template: {
        title: "🎁 Special Offer Just for You!",
        message: "As one of our valued followers, you get exclusive access to this special promotion. Use code FOLLOWER20 for 20% off!"
      }
    }
  ];

  const activeFollowers = followers.filter(f => f.notification_preferences?.events).length;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{activeFollowers}</div>
                <div className="text-sm text-muted-foreground">Active Subscribers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm text-muted-foreground">Email Open Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-muted-foreground">Push Open Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Notification Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                placeholder="Enter notification title..."
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Write your message here..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-3">
              <Label>Delivery Options</Label>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-toggle" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Label>
                <Switch
                  id="email-toggle"
                  checked={includeEmail}
                  onCheckedChange={setIncludeEmail}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-toggle" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Send Push Notification
                </Label>
                <Switch
                  id="push-toggle"
                  checked={includePush}
                  onCheckedChange={setIncludePush}
                />
              </div>
            </div>

            <div>
              <Label>Priority Level</Label>
              <div className="flex gap-2 mt-2">
                {(['low', 'medium', 'high', 'urgent'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={priority === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPriority(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSendNotification}
              disabled={sendNotification.isPending || !notificationTitle.trim() || !notificationMessage.trim()}
              className="w-full"
            >
              {sendNotification.isPending ? 'Sending...' : `Send to ${activeFollowers} Followers`}
            </Button>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notificationTemplates.map((template) => (
                <div
                  key={template.title}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setNotificationTitle(template.template.title);
                    setNotificationMessage(template.template.message);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <template.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{template.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Click to use this template
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FollowerNotificationCenter;
