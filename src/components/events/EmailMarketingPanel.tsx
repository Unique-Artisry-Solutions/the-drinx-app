import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Send, Users, TrendingUp } from 'lucide-react';

interface EmailCampaign {
  id: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipients: number;
  openRate?: number;
  clickRate?: number;
}

interface EmailMarketingPanelProps {
  eventId: string;
  campaigns?: EmailCampaign[];
  onCreateCampaign?: () => void;
}

const defaultCampaigns: EmailCampaign[] = [
  {
    id: '1',
    subject: 'Event Reminder: Don\'t Miss Out!',
    status: 'sent',
    recipients: 150,
    openRate: 68,
    clickRate: 12
  },
  {
    id: '2',
    subject: 'Last Chance: Limited Tickets Available',
    status: 'scheduled',
    recipients: 200
  }
];

const EmailMarketingPanel: React.FC<EmailMarketingPanelProps> = ({
  eventId,
  campaigns = defaultCampaigns,
  onCreateCampaign
}) => {
  const handleCreateCampaign = () => {
    console.log('Creating email campaign for event:', eventId);
    if (onCreateCampaign) {
      onCreateCampaign();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Email Marketing</h3>
          <p className="text-sm text-gray-600">Create and manage email campaigns for your event</p>
        </div>
        <Button onClick={handleCreateCampaign}>
          <Mail className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Quick Campaign Creator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Email Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject Line</Label>
            <Input 
              id="subject" 
              placeholder="Enter email subject..." 
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="content">Message</Label>
            <Textarea 
              id="content"
              placeholder="Write your email content..." 
              rows={4}
              className="mt-1"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Will be sent to all event subscribers
            </div>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Send Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Campaigns */}
      <div className="space-y-4">
        <h4 className="font-medium">Previous Campaigns</h4>
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium">{campaign.subject}</h5>
                    <Badge variant={
                      campaign.status === 'sent' ? 'default' : 
                      campaign.status === 'scheduled' ? 'secondary' : 'outline'
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {campaign.recipients} recipients
                    </div>
                    {campaign.openRate && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {campaign.openRate}% opened
                      </div>
                    )}
                    {campaign.clickRate && (
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {campaign.clickRate}% clicked
                      </div>
                    )}
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium mb-2">No email campaigns yet</h4>
            <p className="mb-4">Start engaging your audience with targeted email marketing.</p>
            <Button onClick={handleCreateCampaign}>Create First Campaign</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailMarketingPanel;
