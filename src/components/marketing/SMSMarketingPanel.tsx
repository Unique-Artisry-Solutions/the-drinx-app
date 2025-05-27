
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SMSCampaign {
  id: string;
  name: string;
  message: string;
  targetAudience: string;
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  metrics: {
    sent: number;
    delivered: number;
    clicked: number;
    replies: number;
  };
}

interface SMSMarketingPanelProps {
  campaignId: string;
  onSMSCampaignCreate: (campaign: Omit<SMSCampaign, 'id' | 'metrics'>) => void;
}

export default function SMSMarketingPanel({ campaignId, onSMSCampaignCreate }: SMSMarketingPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [smsData, setSmsData] = useState({
    name: '',
    message: '',
    targetAudience: '',
    scheduledFor: '',
    sendNow: true
  });

  const [campaigns] = useState<SMSCampaign[]>([
    {
      id: '1',
      name: 'Event Reminder',
      message: 'Don\'t forget! Your event starts in 2 hours. See you there! 🎉',
      targetAudience: 'ticket_holders',
      status: 'sent',
      metrics: { sent: 150, delivered: 148, clicked: 23, replies: 5 }
    },
    {
      id: '2',
      name: 'Last Chance Tickets',
      message: 'Only 10 tickets left for tonight\'s event! Grab yours now: [link]',
      targetAudience: 'interested_users',
      status: 'scheduled',
      scheduledFor: '2024-01-15T18:00:00',
      metrics: { sent: 0, delivered: 0, clicked: 0, replies: 0 }
    }
  ]);

  const characterCount = smsData.message.length;
  const smsCount = Math.ceil(characterCount / 160);

  const handleCreateSMS = () => {
    if (!smsData.name || !smsData.message || !smsData.targetAudience) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    onSMSCampaignCreate({
      name: smsData.name,
      message: smsData.message,
      targetAudience: smsData.targetAudience,
      scheduledFor: smsData.sendNow ? undefined : smsData.scheduledFor,
      status: smsData.sendNow ? 'sent' : 'scheduled'
    });

    toast({
      title: 'SMS Campaign Created',
      description: smsData.sendNow ? 'SMS messages are being sent' : 'SMS campaign scheduled successfully'
    });

    setSmsData({
      name: '',
      message: '',
      targetAudience: '',
      scheduledFor: '',
      sendNow: true
    });
  };

  const getStatusColor = (status: SMSCampaign['status']) => {
    switch (status) {
      case 'sent': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          SMS Marketing
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create SMS Campaign</TabsTrigger>
          <TabsTrigger value="campaigns">SMS Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create SMS Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sms-name">Campaign Name</Label>
                <Input
                  id="sms-name"
                  value={smsData.name}
                  onChange={(e) => setSmsData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                />
              </div>

              <div>
                <Label htmlFor="sms-message">SMS Message</Label>
                <Textarea
                  id="sms-message"
                  value={smsData.message}
                  onChange={(e) => setSmsData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter your SMS message..."
                  rows={4}
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                  <span>{characterCount}/160 characters</span>
                  <span>{smsCount} SMS{smsCount > 1 ? ' messages' : ' message'}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="sms-audience">Target Audience</Label>
                <Select 
                  value={smsData.targetAudience} 
                  onValueChange={(value) => setSmsData(prev => ({ ...prev, targetAudience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_subscribers">All SMS Subscribers</SelectItem>
                    <SelectItem value="ticket_holders">Ticket Holders</SelectItem>
                    <SelectItem value="interested_users">Interested Users</SelectItem>
                    <SelectItem value="vip_members">VIP Members</SelectItem>
                    <SelectItem value="recent_attendees">Recent Attendees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="send-now"
                    name="send-timing"
                    checked={smsData.sendNow}
                    onChange={() => setSmsData(prev => ({ ...prev, sendNow: true }))}
                  />
                  <Label htmlFor="send-now">Send Now</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="schedule-later"
                    name="send-timing"
                    checked={!smsData.sendNow}
                    onChange={() => setSmsData(prev => ({ ...prev, sendNow: false }))}
                  />
                  <Label htmlFor="schedule-later">Schedule for Later</Label>
                </div>
              </div>

              {!smsData.sendNow && (
                <div>
                  <Label htmlFor="schedule-time">Schedule Time</Label>
                  <Input
                    id="schedule-time"
                    type="datetime-local"
                    value={smsData.scheduledFor}
                    onChange={(e) => setSmsData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  />
                </div>
              )}

              <Button onClick={handleCreateSMS} className="w-full">
                {smsData.sendNow ? 'Send SMS Campaign' : 'Schedule SMS Campaign'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(campaign.status)}>
                        {campaign.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {campaign.message}
                    </p>
                  </div>
                  
                  {campaign.status === 'sent' && (
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-blue-600">{campaign.metrics.sent}</div>
                        <div className="text-xs text-gray-600">Sent</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">{campaign.metrics.delivered}</div>
                        <div className="text-xs text-gray-600">Delivered</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">{campaign.metrics.clicked}</div>
                        <div className="text-xs text-gray-600">Clicked</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-orange-600">{campaign.metrics.replies}</div>
                        <div className="text-xs text-gray-600">Replies</div>
                      </div>
                    </div>
                  )}

                  {campaign.status === 'scheduled' && campaign.scheduledFor && (
                    <div className="text-sm text-gray-600">
                      Scheduled for: {new Date(campaign.scheduledFor).toLocaleString()}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">Edit</Button>
                    {campaign.status === 'scheduled' && (
                      <Button variant="outline" size="sm">Cancel</Button>
                    )}
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
