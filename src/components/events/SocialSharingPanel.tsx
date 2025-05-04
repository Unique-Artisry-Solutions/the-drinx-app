
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { Facebook, Twitter, Instagram, Link2, Copy, Share2 } from 'lucide-react';

interface SocialSharingPanelProps {
  eventId: string;
  eventName: string;
  campaigns: EventMarketingCampaign[];
}

const SocialSharingPanel: React.FC<SocialSharingPanelProps> = ({ eventId, eventName, campaigns }) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string>("facebook");
  
  const socialCampaigns = campaigns.filter(campaign => 
    campaign.campaign_type === 'social_media' && campaign.status === 'active'
  );

  const handleCopyLink = () => {
    const eventUrl = window.location.origin + `/events/${eventId}`;
    navigator.clipboard.writeText(eventUrl);
    
    toast({
      title: "Link Copied",
      description: "Event link has been copied to clipboard"
    });
  };
  
  const handleShare = () => {
    if (!message) {
      toast({
        title: "Missing Content",
        description: "Please write a message to share",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Content Shared",
      description: `Your message has been shared to ${platform === 'facebook' ? 'Facebook' : platform === 'twitter' ? 'Twitter' : 'Instagram'}`
    });
  };

  const getPlatformIcon = () => {
    switch(platform) {
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'instagram': return <Instagram className="h-5 w-5" />;
      default: return <Share2 className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Sharing</CardTitle>
        <CardDescription>
          Share your event on social media platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="campaign">Campaign (Optional)</Label>
            <Select value={selectedCampaign || undefined} onValueChange={setSelectedCampaign}>
              <SelectTrigger>
                <SelectValue placeholder="Select a campaign" />
              </SelectTrigger>
              <SelectContent>
                {socialCampaigns.length > 0 ? (
                  socialCampaigns.map(campaign => (
                    <SelectItem 
                      key={campaign.id} 
                      value={campaign.id || `campaign-${Math.random().toString(36).substring(2)}`}
                    >
                      {campaign.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-social-campaigns" disabled>No social campaigns available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea 
            id="message"
            placeholder="Write your social media post..."
            className="min-h-[150px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleCopyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Event Link
          </Button>
          <Button onClick={handleShare}>
            {getPlatformIcon()}
            <span className="ml-2">Share on {platform === 'facebook' ? 'Facebook' : platform === 'twitter' ? 'Twitter' : 'Instagram'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialSharingPanel;
