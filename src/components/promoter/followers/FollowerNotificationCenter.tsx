
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  Send, 
  Users, 
  MessageSquare,
  Gift,
  Calendar,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { promoterNotificationService } from '@/services/PromoterNotificationService';

interface FollowerNotificationCenterProps {
  promoterId: string;
  followerCount: number;
}

const FollowerNotificationCenter: React.FC<FollowerNotificationCenterProps> = ({
  promoterId,
  followerCount
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [includeEmail, setIncludeEmail] = useState(true);
  const [includePush, setIncludePush] = useState(true);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [targetType, setTargetType] = useState<'all' | 'tier'>('all');
  
  const { toast } = useToast();

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both title and message',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await promoterNotificationService.notifyFollowers(promoterId, {
        targetType,
        message: message.trim(),
        title: title.trim(),
        discountCode: discountCode.trim() || undefined,
        includeEmail,
        includePush,
        priority
      });

      if (result.success) {
        toast({
          title: 'Notifications Sent',
          description: `Successfully sent to ${result.sentCount} followers`,
        });
        
        // Reset form
        setMessage('');
        setTitle('');
        setDiscountCode('');
      } else {
        toast({
          title: 'Partial Success',
          description: `Sent to ${result.sentCount} followers. Some notifications failed.`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send notifications',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickMessageTemplates = [
    {
      icon: Calendar,
      title: 'New Event Announcement',
      template: 'Exciting news! We have a new event coming up that you won\'t want to miss.'
    },
    {
      icon: Gift,
      title: 'Special Discount',
      template: 'Exclusive offer just for our followers! Use the discount code below for special savings.'
    },
    {
      icon: Star,
      title: 'General Update',
      template: 'We wanted to share some exciting updates with our amazing followers!'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Follower Notification Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compose">Compose Message</TabsTrigger>
              <TabsTrigger value="templates">Quick Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="compose" className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Sending to {followerCount.toLocaleString()} followers
                  </span>
                </div>
                <Badge variant="outline">{targetType === 'all' ? 'All Followers' : 'Tier Based'}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Notification Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter notification title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Code (Optional)</Label>
                  <Input
                    id="discount"
                    placeholder="SAVE20"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your message to followers..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <Switch
                    checked={includeEmail}
                    onCheckedChange={setIncludeEmail}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Push</span>
                  </div>
                  <Switch
                    checked={includePush}
                    onCheckedChange={setIncludePush}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as typeof priority)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={handleSendNotification}
                disabled={isLoading || !title.trim() || !message.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Sending...' : 'Send Notification'}
              </Button>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4">
                {quickMessageTemplates.map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => {
                          setTitle(template.title);
                          setMessage(template.template);
                        }}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <template.icon className="h-5 w-5 mt-0.5 text-primary" />
                        <div>
                          <h4 className="font-medium">{template.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.template}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowerNotificationCenter;
