
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { Facebook, Twitter, Instagram, Link2, Copy, Linkedin, Globe, MessageCircle, Heart, Share } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface SocialSharingPanelProps {
  eventId: string;
  eventName: string;
  campaigns: EventMarketingCampaign[];
}

const SocialSharingPanel: React.FC<SocialSharingPanelProps> = ({ eventId, eventName, campaigns }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('facebook');
  const [shareUrl, setShareUrl] = useState(`https://youreventapp.com/events/${eventId}`);
  
  // Social copy texts with placeholders
  const [socialCopy, setSocialCopy] = useState({
    facebook: `Join us at ${eventName}! This event is going to be amazing. #events #${eventName.replace(/\s+/g, '')}`,
    twitter: `Excited to announce ${eventName}! Don't miss out on this great event. Get your tickets now! #events #${eventName.replace(/\s+/g, '')}`,
    instagram: `We're thrilled to announce ${eventName}!\n\nJoin us for an unforgettable experience.\n\n#events #${eventName.replace(/\s+/g, '')} #eventpromotion`,
    linkedin: `I'm pleased to share that tickets for ${eventName} are now available. This is a fantastic opportunity to network and learn. #ProfessionalEvents #${eventName.replace(/\s+/g, '')}`
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "Event link has been copied to clipboard!",
    });
  };

  const handleSocialShare = (platform: string) => {
    let shareUrlWithParams = '';
    
    switch (platform) {
      case 'facebook':
        shareUrlWithParams = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(socialCopy.facebook)}`;
        break;
      case 'twitter':
        shareUrlWithParams = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(socialCopy.twitter)}`;
        break;
      case 'linkedin':
        shareUrlWithParams = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(socialCopy.linkedin)}`;
        break;
      default:
        toast({
          title: "Coming Soon",
          description: `Direct ${platform} sharing will be available soon!`,
        });
        return;
    }
    
    // Open in a new window
    window.open(shareUrlWithParams, '_blank');
    
    toast({
      title: "Share Started",
      description: `Share dialog for ${platform} has been opened.`,
    });
  };

  const updateSocialCopy = (platform: string, text: string) => {
    setSocialCopy(prev => ({
      ...prev,
      [platform]: text
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Sharing</CardTitle>
        <CardDescription>
          Share and promote {eventName} on social media platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex gap-3">
            <Input
              value={shareUrl}
              onChange={(e) => setShareUrl(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>
          
          <div className="flex justify-center mt-6 gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-col gap-2 h-20 w-24"
              onClick={() => handleSocialShare('facebook')}
            >
              <Facebook size={24} className="text-blue-600" />
              <span>Facebook</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-col gap-2 h-20 w-24"
              onClick={() => handleSocialShare('twitter')}
            >
              <Twitter size={24} className="text-blue-400" />
              <span>Twitter</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-col gap-2 h-20 w-24"
              onClick={() => handleSocialShare('instagram')}
            >
              <Instagram size={24} className="text-pink-500" />
              <span>Instagram</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-col gap-2 h-20 w-24"
              onClick={() => handleSocialShare('linkedin')}
            >
              <Linkedin size={24} className="text-blue-700" />
              <span>LinkedIn</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-4">
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          </TabsList>
          
          <TabsContent value="facebook">
            <div className="space-y-4">
              <div>
                <Label htmlFor="facebookCopy">Post Copy</Label>
                <Textarea
                  id="facebookCopy"
                  value={socialCopy.facebook}
                  onChange={(e) => updateSocialCopy('facebook', e.target.value)}
                  className="h-32"
                />
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Post Preview</h3>
                <div className="bg-white border rounded-md p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-semibold text-sm">Your Page Name</p>
                      <p className="text-xs text-gray-500">Just now · Public</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{socialCopy.facebook}</p>
                  <div className="border rounded overflow-hidden">
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      Event Image Preview
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-500">youreventapp.com</p>
                      <p className="font-medium text-sm">{eventName}</p>
                      <p className="text-xs truncate">Join us for this amazing event!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="twitter">
            <div className="space-y-4">
              <div>
                <Label htmlFor="twitterCopy">Tweet Copy</Label>
                <Textarea
                  id="twitterCopy"
                  value={socialCopy.twitter}
                  onChange={(e) => updateSocialCopy('twitter', e.target.value)}
                  className="h-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {280 - socialCopy.twitter.length} characters remaining
                </p>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Tweet Preview</h3>
                <div className="bg-white border rounded-md p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-semibold text-sm">Your Account</p>
                      <p className="text-xs text-gray-500">@youraccount</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{socialCopy.twitter}</p>
                  <div className="border rounded overflow-hidden">
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      Event Image Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="instagram">
            <div className="space-y-4">
              <div>
                <Label htmlFor="instagramCopy">Caption</Label>
                <Textarea
                  id="instagramCopy"
                  value={socialCopy.instagram}
                  onChange={(e) => updateSocialCopy('instagram', e.target.value)}
                  className="h-32"
                />
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Instagram Preview</h3>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full max-w-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                      <p className="font-semibold text-sm">your_account</p>
                    </div>
                    <div className="aspect-square bg-gray-100 w-full flex items-center justify-center border">
                      Event Image Preview
                    </div>
                    <div className="p-2">
                      <div className="flex gap-4 mb-2">
                        <Heart className="h-6 w-6" />
                        <MessageCircle className="h-6 w-6" />
                        <Share className="h-6 w-6" />
                      </div>
                      <p className="font-semibold text-sm mb-1">0 likes</p>
                      <p className="text-sm">
                        <span className="font-semibold">your_account</span>{' '}
                        {socialCopy.instagram.split('\n')[0]}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="linkedin">
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkedinCopy">Post Copy</Label>
                <Textarea
                  id="linkedinCopy"
                  value={socialCopy.linkedin}
                  onChange={(e) => updateSocialCopy('linkedin', e.target.value)}
                  className="h-32"
                />
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">LinkedIn Preview</h3>
                <div className="bg-white border rounded-md p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-semibold">Your Name</p>
                      <p className="text-xs text-gray-500">Your Position • Just now</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{socialCopy.linkedin}</p>
                  <div className="border rounded overflow-hidden">
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      Event Image Preview
                    </div>
                    <div className="p-3">
                      <p className="font-medium">{eventName}</p>
                      <p className="text-xs text-gray-500">youreventapp.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => handleSocialShare(activeTab)}
          className="ml-auto"
        >
          Share to {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SocialSharingPanel;
