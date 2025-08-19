
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Clock, TrendingUp, Phone, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSMSCampaigns } from '@/hooks/sms/useSMSCampaigns';
import { useSMSNotifications } from '@/hooks/sms/useSMSNotifications';

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
  const { campaigns, createCampaign, campaignStats, isLoading } = useSMSCampaigns();
  const { testSMS } = useSMSNotifications();
  
  const [activeTab, setActiveTab] = useState('create');
  const [smsData, setSmsData] = useState({
    name: '',
    message: '',
    targetAudience: '',
    scheduledFor: '',
    sendNow: true
  });
  
  const [testPhoneNumber, setTestPhoneNumber] = useState('');

  const characterCount = smsData.message.length;
  const smsCount = Math.ceil(characterCount / 160);

  const handleCreateSMS = async () => {
    if (!smsData.name || !smsData.message || !smsData.targetAudience) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      await createCampaign.mutateAsync({
        name: smsData.name,
        message: smsData.message,
        targetAudience: smsData.targetAudience,
        scheduledFor: smsData.sendNow ? undefined : smsData.scheduledFor,
        sendNow: smsData.sendNow
      });

      // Call the original callback for backward compatibility
      if (onSMSCampaignCreate) {
        onSMSCampaignCreate({
          name: smsData.name,
          message: smsData.message,
          targetAudience: smsData.targetAudience,
          scheduledFor: smsData.sendNow ? undefined : smsData.scheduledFor,
          status: smsData.sendNow ? 'sent' : 'scheduled'
        });
      }

      setSmsData({
        name: '',
        message: '',
        targetAudience: '',
        scheduledFor: '',
        sendNow: true
      });
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  const handleTestSMS = async () => {
    if (!testPhoneNumber) {
      toast({
        title: 'Phone Number Required',
        description: 'Please enter a phone number for testing',
        variant: 'destructive'
      });
      return;
    }

    try {
      await testSMS.mutateAsync(testPhoneNumber);
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  const getStatusColor = (status: string) => {
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create SMS Campaign</TabsTrigger>
          <TabsTrigger value="campaigns">SMS Campaigns</TabsTrigger>
          <TabsTrigger value="test">Test SMS</TabsTrigger>
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

              <Button 
                onClick={handleCreateSMS} 
                className="w-full"
                disabled={createCampaign.isPending}
              >
                {createCampaign.isPending ? 'Creating...' : 
                 smsData.sendNow ? 'Send SMS Campaign' : 'Schedule SMS Campaign'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">Loading campaigns...</div>
          ) : (
            <div className="grid gap-4">
              {campaigns.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No SMS campaigns yet. Create your first campaign above.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                campaigns.map((campaign) => (
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
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                          {campaign.message_body}
                        </p>
                      </div>
                      
                      {campaign.status === 'sent' && (
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="text-xl font-bold text-blue-600">{campaign.messages_sent}</div>
                            <div className="text-xs text-muted-foreground">Sent</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-green-600">{campaign.messages_delivered}</div>
                            <div className="text-xs text-muted-foreground">Delivered</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-orange-600">{campaign.messages_failed}</div>
                            <div className="text-xs text-muted-foreground">Failed</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-purple-600">${campaign.campaign_cost.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">Cost</div>
                          </div>
                        </div>
                      )}

                      {campaign.status === 'scheduled' && campaign.scheduled_for && (
                        <div className="text-sm text-muted-foreground">
                          Scheduled for: {new Date(campaign.scheduled_for).toLocaleString()}
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
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Test SMS Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-phone">Test Phone Number</Label>
                <Input
                  id="test-phone"
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <Button 
                onClick={handleTestSMS} 
                className="w-full"
                disabled={testSMS.isPending}
              >
                {testSMS.isPending ? 'Sending Test...' : 'Send Test SMS'}
              </Button>
              
              <div className="text-sm text-muted-foreground">
                This will send a test message to verify SMS functionality.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
