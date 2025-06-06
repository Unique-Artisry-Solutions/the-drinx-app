
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Send, 
  Users, 
  Clock, 
  MessageSquare, 
  FileText, 
  Calendar,
  Target,
  History,
  Settings
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useToast } from '@/hooks/use-toast';

interface FollowerCommunicationHubProps {
  promoterId: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'announcement' | 'promotion' | 'event' | 'general';
}

const FollowerCommunicationHub: React.FC<FollowerCommunicationHubProps> = ({ promoterId }) => {
  const [activeTab, setActiveTab] = useState('compose');
  const [messageContent, setMessageContent] = useState('');
  const [messageTitle, setMessageTitle] = useState('');
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [includeEmail, setIncludeEmail] = useState(true);
  const [includePush, setIncludePush] = useState(true);
  const [scheduleMessage, setScheduleMessage] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  
  const { followers, sendNotification } = useSubscriptions(promoterId);
  const { toast } = useToast();

  // Mock templates - in real implementation, these would come from API
  const messageTemplates: MessageTemplate[] = [
    {
      id: '1',
      name: 'Event Announcement',
      subject: 'New Event Coming Soon!',
      content: 'We\'re excited to announce our upcoming event...',
      category: 'event'
    },
    {
      id: '2',
      name: 'Special Promotion',
      subject: 'Exclusive Discount Just for You!',
      content: 'As one of our valued followers, you get early access...',
      category: 'promotion'
    },
    {
      id: '3',
      name: 'General Update',
      subject: 'What\'s New This Week',
      content: 'Here\'s what we\'ve been up to...',
      category: 'general'
    }
  ];

  const activeFollowers = followers?.filter(f => f.follow_status === 'active') || [];
  const targetAudience = selectedTiers.length > 0 
    ? activeFollowers.filter(f => selectedTiers.includes(f.tier_id || 'free'))
    : activeFollowers;

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !messageTitle.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both title and message content.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const notification = {
        title: messageTitle,
        content: messageContent,
        priority,
        includeEmail,
        includePush,
        targetTiers: selectedTiers
      };

      await sendNotification.mutateAsync({
        promoterId,
        notification
      });

      // Reset form
      setMessageContent('');
      setMessageTitle('');
      setSelectedTiers([]);
      setPriority('medium');
      
      toast({
        title: 'Message Sent',
        description: `Successfully sent to ${targetAudience.length} followers`,
      });
    } catch (error) {
      toast({
        title: 'Failed to send message',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    }
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setMessageTitle(template.subject);
    setMessageContent(template.content);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Communication Hub</h3>
        <p className="text-sm text-muted-foreground">
          Send messages, announcements, and updates to your followers
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Compose Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Message Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="messageTitle">Message Title</Label>
                  <Input
                    id="messageTitle"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    placeholder="Enter message title..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
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
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <Label htmlFor="messageContent">Message Content</Label>
                <Textarea
                  id="messageContent"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Write your message here..."
                  rows={6}
                />
              </div>

              {/* Delivery Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeEmail"
                      checked={includeEmail}
                      onCheckedChange={setIncludeEmail}
                    />
                    <Label htmlFor="includeEmail">Send via Email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includePush"
                      checked={includePush}
                      onCheckedChange={setIncludePush}
                    />
                    <Label htmlFor="includePush">Send Push Notifications</Label>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="scheduleMessage"
                    checked={scheduleMessage}
                    onCheckedChange={setScheduleMessage}
                  />
                  <Label htmlFor="scheduleMessage">Schedule for later</Label>
                </div>
                
                {scheduleMessage && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Schedule Date & Time</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Target Audience Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">Target Audience</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This message will be sent to {targetAudience.length} active followers
                  {selectedTiers.length > 0 && ` (filtered by tier)`}
                </p>
              </div>

              {/* Send Button */}
              <Button 
                onClick={handleSendMessage} 
                className="w-full"
                disabled={!messageContent.trim() || !messageTitle.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {scheduleMessage ? 'Schedule Message' : 'Send Message'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Message Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {messageTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{template.subject}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Message History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No messages sent yet</p>
                  <p className="text-sm">Your sent messages will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Audience Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{activeFollowers.length}</p>
                    <p className="text-sm text-muted-foreground">Total Active Followers</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {followers?.filter(f => f.notification_preferences?.events).length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Push Notifications Enabled</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-muted-foreground">Messages Sent This Month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Audience Segmentation</h4>
                <p className="text-sm text-muted-foreground">
                  Select specific follower tiers to target your messages more effectively.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Badge 
                    variant={selectedTiers.includes('free') ? 'default' : 'outline'}
                    className="cursor-pointer justify-center"
                    onClick={() => {
                      setSelectedTiers(prev => 
                        prev.includes('free') 
                          ? prev.filter(t => t !== 'free')
                          : [...prev, 'free']
                      );
                    }}
                  >
                    Free Followers
                  </Badge>
                  <Badge 
                    variant={selectedTiers.includes('premium') ? 'default' : 'outline'}
                    className="cursor-pointer justify-center"
                    onClick={() => {
                      setSelectedTiers(prev => 
                        prev.includes('premium') 
                          ? prev.filter(t => t !== 'premium')
                          : [...prev, 'premium']
                      );
                    }}
                  >
                    Premium
                  </Badge>
                  <Badge 
                    variant={selectedTiers.includes('vip') ? 'default' : 'outline'}
                    className="cursor-pointer justify-center"
                    onClick={() => {
                      setSelectedTiers(prev => 
                        prev.includes('vip') 
                          ? prev.filter(t => t !== 'vip')
                          : [...prev, 'vip']
                      );
                    }}
                  >
                    VIP
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTiers([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowerCommunicationHub;
