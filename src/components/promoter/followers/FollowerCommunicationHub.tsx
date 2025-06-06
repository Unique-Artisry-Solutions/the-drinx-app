
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Clock, 
  Users, 
  Zap,
  Calendar,
  History,
  Template,
  Plus
} from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { FollowerComponentProps } from '@/types/FollowerComponentTypes';

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'event' | 'promotion' | 'general';
}

const FollowerCommunicationHub: React.FC<FollowerComponentProps> = ({
  promoterId,
  className = '',
  onError,
  onSuccess
}) => {
  const { followers, sendNotification } = useSubscriptions(promoterId);
  const [activeTab, setActiveTab] = useState('compose');
  
  // Message composition state
  const [messageTitle, setMessageTitle] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [priority, setPriority] = useState('medium');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  // Templates state
  const [templates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Event Reminder',
      subject: 'Don\'t Miss Tonight\'s Event!',
      content: 'Hey there! Just a quick reminder about tonight\'s amazing event. We can\'t wait to see you there!',
      category: 'event'
    },
    {
      id: '2',
      name: 'Happy Hour Promotion',
      subject: 'Special Happy Hour Just for You!',
      content: 'Join us for an exclusive happy hour with 50% off all drinks from 5-7 PM today!',
      category: 'promotion'
    },
    {
      id: '3',
      name: 'Weekly Update',
      subject: 'This Week\'s Highlights',
      content: 'Here\'s what\'s happening this week at our venues. Check out these exciting events and promotions!',
      category: 'general'
    }
  ]);

  const [messageHistory] = useState([
    {
      id: '1',
      title: 'Summer Circuit Launch',
      sentAt: '2024-01-15T10:30:00Z',
      recipients: 156,
      openRate: 78,
      clickRate: 12
    },
    {
      id: '2',
      title: 'Happy Hour Special',
      sentAt: '2024-01-14T16:00:00Z',
      recipients: 142,
      openRate: 85,
      clickRate: 18
    },
    {
      id: '3',
      title: 'Weekend Event Alert',
      sentAt: '2024-01-13T14:20:00Z',
      recipients: 134,
      openRate: 72,
      clickRate: 8
    }
  ]);

  const totalFollowers = followers?.length || 0;
  const activeFollowers = followers?.filter(f => f.follow_status === 'active').length || 0;
  const notificationEnabled = followers?.filter(f => 
    f.notification_preferences?.events !== false
  ).length || 0;

  const getAudienceSize = () => {
    switch (selectedAudience) {
      case 'all': return totalFollowers;
      case 'active': return activeFollowers;
      case 'notifications': return notificationEnabled;
      case 'premium': return followers?.filter(f => f.tier_id).length || 0;
      case 'free': return followers?.filter(f => !f.tier_id).length || 0;
      default: return 0;
    }
  };

  const handleSendMessage = async () => {
    if (!messageTitle || !messageContent) return;

    try {
      if (scheduleDate && scheduleTime) {
        // Handle scheduled message
        console.log('Scheduling message for:', scheduleDate, scheduleTime);
      } else {
        // Send immediate message
        await sendNotification.mutateAsync({
          message: messageContent,
          title: messageTitle,
          priority
        });
        
        // Clear form
        setMessageTitle('');
        setMessageContent('');
        setSelectedAudience('all');
        setPriority('medium');
        
        if (onSuccess) {
          onSuccess({ sent: true, recipients: getAudienceSize() });
        }
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setMessageTitle(template.subject);
    setMessageContent(template.content);
    setActiveTab('compose');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFollowers}</div>
            <p className="text-xs text-muted-foreground">Available followers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications On</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationEnabled}</div>
            <p className="text-xs text-muted-foreground">
              {totalFollowers > 0 ? ((notificationEnabled / totalFollowers) * 100).toFixed(0) : 0}% opt-in rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Communication Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Audience Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Audience</label>
                  <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Followers ({totalFollowers})</SelectItem>
                      <SelectItem value="active">Active Followers ({activeFollowers})</SelectItem>
                      <SelectItem value="notifications">Notifications Enabled ({notificationEnabled})</SelectItem>
                      <SelectItem value="premium">Premium ({followers?.filter(f => f.tier_id).length || 0})</SelectItem>
                      <SelectItem value="free">Free ({followers?.filter(f => !f.tier_id).length || 0})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select value={priority} onValueChange={setPriority}>
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
              </div>

              {/* Message Content */}
              <div>
                <label className="text-sm font-medium mb-2 block">Message Title</label>
                <Input
                  placeholder="Enter message title..."
                  value={messageTitle}
                  onChange={(e) => setMessageTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Message Content</label>
                <Textarea
                  placeholder="Enter your message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Schedule Date (Optional)</label>
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Schedule Time (Optional)</label>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Send Button */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Will reach {getAudienceSize()} followers
                </div>
                
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageTitle || !messageContent || sendNotification.isPending}
                >
                  {scheduleDate && scheduleTime ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Message
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Message Templates</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{template.name}</CardTitle>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">{template.subject}</div>
                    <div className="text-xs text-muted-foreground line-clamp-3">
                      {template.content}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <Template className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled messages</p>
                <p className="text-sm">Messages you schedule will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messageHistory.map((message) => (
                  <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{message.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Sent {new Date(message.sentAt).toLocaleDateString()} to {message.recipients} followers
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-4 text-sm">
                        <span>{message.openRate}% opened</span>
                        <span>{message.clickRate}% clicked</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FollowerCommunicationHub;
