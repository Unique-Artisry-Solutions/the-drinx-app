
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send, Users, MessageSquare, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useToast } from '@/hooks/use-toast';

interface BulkMessagingHubProps {
  promoterId: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

interface FollowerSegment {
  id: string;
  name: string;
  criteria: string;
  count: number;
  followers: any[];
}

const BulkMessagingHub: React.FC<BulkMessagingHubProps> = ({ promoterId }) => {
  const { followers, sendNotification } = useSubscriptions(promoterId);
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('compose');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [previewMode, setPreviewMode] = useState(false);

  // Mock data for demonstration
  const messageTemplates: MessageTemplate[] = [
    {
      id: 'welcome',
      name: 'Welcome Message',
      subject: 'Welcome to our community, {{firstName}}!',
      content: 'Hi {{firstName}},\n\nWelcome to our exclusive community! We\'re excited to have you on board.',
      variables: ['firstName']
    },
    {
      id: 'event-announcement',
      name: 'Event Announcement',
      subject: 'Don\'t miss our upcoming event!',
      content: 'We have an exciting event coming up on {{eventDate}}. Join us for {{eventName}}!',
      variables: ['eventDate', 'eventName']
    },
    {
      id: 'promotion',
      name: 'Promotion Alert',
      subject: 'Special offer just for you!',
      content: 'Exclusive {{discountPercent}}% discount available until {{expiryDate}}.',
      variables: ['discountPercent', 'expiryDate']
    }
  ];

  const followerSegments: FollowerSegment[] = [
    {
      id: 'all',
      name: 'All Followers',
      criteria: 'All active followers',
      count: followers?.length || 0,
      followers: followers || []
    },
    {
      id: 'premium',
      name: 'Premium Followers',
      criteria: 'Followers with premium tiers',
      count: followers?.filter(f => f.tier_id)?.length || 0,
      followers: followers?.filter(f => f.tier_id) || []
    },
    {
      id: 'recent',
      name: 'Recent Followers',
      criteria: 'Joined in last 30 days',
      count: followers?.filter(f => {
        const joinDate = new Date(f.subscription_start);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate >= thirtyDaysAgo;
      })?.length || 0,
      followers: followers?.filter(f => {
        const joinDate = new Date(f.subscription_start);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate >= thirtyDaysAgo;
      }) || []
    },
    {
      id: 'engaged',
      name: 'Highly Engaged',
      criteria: 'High engagement score',
      count: Math.floor((followers?.length || 0) * 0.3),
      followers: followers?.slice(0, Math.floor((followers?.length || 0) * 0.3)) || []
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setMessageSubject(template.subject);
      setMessageContent(template.content);
    }
  };

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const getSelectedFollowersCount = () => {
    const selectedSegmentData = followerSegments.filter(s => selectedSegments.includes(s.id));
    const uniqueFollowers = new Set();
    selectedSegmentData.forEach(segment => {
      segment.followers.forEach(follower => uniqueFollowers.add(follower.id));
    });
    return uniqueFollowers.size;
  };

  const handleSendMessage = async () => {
    if (!messageSubject || !messageContent || selectedSegments.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one segment.",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedFollowersCount = getSelectedFollowersCount();
      
      // For demo purposes, we'll send to the first follower from each segment
      const selectedSegmentData = followerSegments.filter(s => selectedSegments.includes(s.id));
      const firstFollowers = selectedSegmentData
        .map(segment => segment.followers[0])
        .filter(Boolean);

      for (const follower of firstFollowers) {
        await sendNotification.mutateAsync({
          followerId: follower.id,
          message: messageContent,
          subject: messageSubject
        });
      }

      toast({
        title: "Messages Sent",
        description: `Successfully sent message to ${selectedFollowersCount} followers.`
      });

      // Reset form
      setMessageSubject('');
      setMessageContent('');
      setSelectedSegments([]);
      setSelectedTemplate('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send messages. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleMessage = () => {
    if (!scheduleDate) {
      toast({
        title: "Validation Error",
        description: "Please select a schedule date.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Scheduled",
      description: `Message scheduled for ${format(scheduleDate, 'PPP')} at ${format(scheduleDate, 'p')}.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Bulk Messaging Hub
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Audience Segments</label>
                  <div className="space-y-2">
                    {followerSegments.map(segment => (
                      <div key={segment.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={segment.id}
                          checked={selectedSegments.includes(segment.id)}
                          onCheckedChange={() => handleSegmentToggle(segment.id)}
                        />
                        <div className="flex-1">
                          <label htmlFor={segment.id} className="font-medium cursor-pointer">
                            {segment.name}
                          </label>
                          <p className="text-sm text-muted-foreground">{segment.criteria}</p>
                        </div>
                        <Badge variant="secondary">{segment.count}</Badge>
                      </div>
                    ))}
                  </div>
                  
                  {selectedSegments.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Selected: {getSelectedFollowersCount()} followers
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quick Template</label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {messageTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject Line</label>
                  <Input
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Enter message subject..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message Content</label>
                  <Textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter your message..."
                    rows={8}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSendMessage} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </Button>
                  <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4">
              {messageTemplates.map(template => (
                <Card key={template.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{template.subject}</p>
                        <p className="text-sm mt-2">{template.content.substring(0, 100)}...</p>
                        {template.variables.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">Variables: </span>
                            {template.variables.map(variable => (
                              <Badge key={variable} variant="outline" className="text-xs mr-1">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Schedule Date & Time</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleDate ? format(scheduleDate, 'PPP p') : 'Pick a date and time'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-4">
                <Button onClick={handleScheduleMessage} className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Message
                </Button>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Scheduled Messages</h4>
                  <p className="text-sm text-muted-foreground">No messages currently scheduled.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BulkMessagingHub;
