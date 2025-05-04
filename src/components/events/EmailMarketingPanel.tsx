
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { Mail } from 'lucide-react';

interface EmailMarketingPanelProps {
  eventId: string;
  eventName: string;
  campaigns: EventMarketingCampaign[];
}

const EmailMarketingPanel: React.FC<EmailMarketingPanelProps> = ({ eventId, eventName, campaigns }) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  
  const emailCampaigns = campaigns.filter(campaign => 
    campaign.campaign_type === 'email' && campaign.status === 'active'
  );

  const handleSendTest = () => {
    if (!subject || !content) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to your address"
    });
  };
  
  const handleSendCampaign = () => {
    if (!subject || !content || !selectedCampaign) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields and select a campaign",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Email Campaign Scheduled",
      description: "Your email campaign has been scheduled for delivery"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Marketing</CardTitle>
        <CardDescription>
          Create and send emails to promote {eventName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="campaign">Campaign</Label>
            <Select value={selectedCampaign || undefined} onValueChange={setSelectedCampaign}>
              <SelectTrigger>
                <SelectValue placeholder="Select a campaign" />
              </SelectTrigger>
              <SelectContent>
                {emailCampaigns.length > 0 ? (
                  emailCampaigns.map(campaign => (
                    <SelectItem 
                      key={campaign.id} 
                      value={campaign.id || `campaign-${Math.random().toString(36).substring(2)}`}
                    >
                      {campaign.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-campaigns-available" disabled>No email campaigns available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject Line</Label>
            <Input 
              id="subject"
              placeholder="Enter email subject line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="content">Email Content</Label>
          <Textarea 
            id="content"
            placeholder="Write your email content here..."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-end">
          <Button onClick={handleSendTest} variant="outline">
            Send Test Email
          </Button>
          <Button onClick={handleSendCampaign} disabled={!selectedCampaign}>
            <Mail className="mr-2 h-4 w-4" />
            Send Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailMarketingPanel;
