
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { Copy, Facebook, Twitter, Instagram, Linkedin, Mail, Share2, LinkIcon, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SocialMediaSharingProps {
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  eventUrl?: string;
  eventImage?: string;
}

const SocialMediaSharing: React.FC<SocialMediaSharingProps> = ({
  eventId = "event-123",
  eventName = "Summer Music Festival",
  eventDate = "August 15, 2025",
  eventUrl = "https://youreventapp.com/events/summer-festival-2025",
  eventImage = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3"
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("facebook");
  const [shareMessage, setShareMessage] = useState<string>(
    `Join me at ${eventName} on ${eventDate}! Get your tickets now. #event #music #festival`
  );
  const [useHashtags, setUseHashtags] = useState<boolean>(true);
  const [trackingId, setTrackingId] = useState<string>(`${eventId}-social-${Date.now()}`);
  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  // Predefined hashtags for different event types
  const eventHashtags = {
    music: ["music", "festival", "livemusic", "concert"],
    conference: ["conference", "networking", "business", "professional"],
    workshop: ["workshop", "learning", "skills", "education"],
    social: ["party", "social", "meetup", "community"],
    sports: ["sports", "fitness", "competition", "athletes"]
  };
  
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(eventHashtags.music);
  
  // Message templates for different platforms
  const messageTemplates = {
    facebook: `Join me at ${eventName} on ${eventDate}! It's going to be amazing. Get your tickets now.`,
    twitter: `I'm excited for ${eventName} on ${eventDate}! Join me? #event #music`,
    instagram: `Can't wait for ${eventName} 🎉 Join me on ${eventDate}!`,
    linkedin: `I'm attending ${eventName} on ${eventDate}. This is a great opportunity to network and enjoy.`
  };
  
  // Handle platform change
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    // Set a platform-specific message template
    setShareMessage(messageTemplates[platform as keyof typeof messageTemplates] || messageTemplates.facebook);
  };
  
  const constructSharingUrl = (platform: string) => {
    // Add UTM parameters for tracking
    const trackingUrl = `${eventUrl}?utm_source=${platform}&utm_medium=social&utm_campaign=event_share&utm_id=${trackingId}`;
    
    // Construct platform-specific sharing URLs
    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trackingUrl)}&quote=${encodeURIComponent(shareMessage)}`;
      case 'twitter':
        const twitterText = useHashtags 
          ? `${shareMessage} ${selectedHashtags.map(tag => `#${tag}`).join(' ')}`
          : shareMessage;
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(trackingUrl)}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(trackingUrl)}&summary=${encodeURIComponent(shareMessage)}`;
      case 'email':
        const subject = `Join me at ${eventName}`;
        const body = `${shareMessage}\n\nGet your tickets here: ${trackingUrl}`;
        return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      default:
        return trackingUrl;
    }
  };
  
  const handleShare = () => {
    const url = constructSharingUrl(selectedPlatform);
    
    if (selectedPlatform === 'copy') {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Link copied to clipboard");
      });
    } else {
      // Open sharing dialog in a new window
      window.open(url, '_blank', 'width=600,height=400');
      
      // Track this share action
      toast.success(`Shared on ${selectedPlatform}`);
    }
  };
  
  const handleToggleHashtag = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter(t => t !== tag));
    } else {
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };
  
  const addCustomHashtag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const input = event.currentTarget;
      const value = input.value.trim().replace(/^#/, '').toLowerCase();
      
      if (!value) return;
      
      if (!selectedHashtags.includes(value)) {
        setSelectedHashtags([...selectedHashtags, value]);
        input.value = '';
      } else {
        toast.error("This hashtag is already added");
      }
    }
  };

  const getPlatformIcon = () => {
    switch (selectedPlatform) {
      case 'facebook': return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'twitter': return <Twitter className="h-5 w-5 text-sky-500" />;
      case 'instagram': return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'linkedin': return <Linkedin className="h-5 w-5 text-blue-700" />;
      case 'email': return <Mail className="h-5 w-5 text-gray-600" />;
      case 'copy': return copied ? <Check className="h-5 w-5 text-green-600" /> : <LinkIcon className="h-5 w-5" />;
      default: return <Share2 className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Share2 className="mr-2 h-5 w-5" />
          Social Media Sharing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList className="mb-4">
            <TabsTrigger value="create">Create Post</TabsTrigger>
            <TabsTrigger value="analytics">Share Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
                    <SelectTrigger id="platform" className="flex items-center">
                      <SelectValue placeholder="Select Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">
                        <div className="flex items-center">
                          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                          Facebook
                        </div>
                      </SelectItem>
                      <SelectItem value="twitter">
                        <div className="flex items-center">
                          <Twitter className="h-4 w-4 mr-2 text-sky-500" />
                          Twitter
                        </div>
                      </SelectItem>
                      <SelectItem value="instagram">
                        <div className="flex items-center">
                          <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                          Instagram
                        </div>
                      </SelectItem>
                      <SelectItem value="linkedin">
                        <div className="flex items-center">
                          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                          LinkedIn
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-600" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="copy">
                        <div className="flex items-center">
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Copy Link
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="tracking-id">Tracking ID</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setTrackingId(`${eventId}-social-${Date.now()}`)}
                      className="h-6 text-xs"
                    >
                      Generate New
                    </Button>
                  </div>
                  <Input
                    id="tracking-id"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Tracking ID for analytics"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Write your message here"
                  rows={4}
                />
              </div>
              
              {selectedPlatform !== 'copy' && selectedPlatform !== 'email' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hashtags" className="text-sm font-medium">Hashtags</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{selectedHashtags.length} selected</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUseHashtags(!useHashtags)}
                        className={useHashtags ? 'bg-primary/10' : ''}
                      >
                        {useHashtags ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </div>
                  
                  {useHashtags && (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(eventHashtags).map(([category, tags]) => (
                          <div key={category} className="flex items-center">
                            <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-l-md">
                              {category}
                            </span>
                            <div className="flex flex-wrap">
                              {tags.map(tag => (
                                <Button
                                  key={tag}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleHashtag(tag)}
                                  className={`
                                    text-xs rounded-none
                                    ${selectedHashtags.includes(tag) 
                                      ? 'bg-primary/10' 
                                      : 'bg-transparent'}
                                  `}
                                >
                                  #{tag}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom hashtag (press Enter)"
                          onKeyDown={addCustomHashtag}
                          className="flex-1"
                        />
                      </div>
                      
                      {selectedHashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 bg-muted/30 p-2 rounded">
                          {selectedHashtags.map(tag => (
                            <div 
                              key={tag}
                              className="flex items-center text-sm bg-background border px-2 py-1 rounded"
                            >
                              #{tag}
                              <button
                                onClick={() => handleToggleHashtag(tag)}
                                className="ml-2 text-muted-foreground hover:text-foreground"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
                <Button onClick={handleShare} className="flex items-center">
                  {getPlatformIcon()}
                  <span className="ml-2">
                    {selectedPlatform === 'copy' 
                      ? (copied ? 'Copied!' : 'Copy Link') 
                      : `Share on ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}`}
                  </span>
                </Button>
              </div>
              
              {showPreview && (
                <div className="mt-4 border rounded-md p-4 bg-muted/20">
                  <h4 className="font-semibold mb-2">Preview</h4>
                  <div className="space-y-3">
                    <p className="text-sm whitespace-pre-wrap">{shareMessage}</p>
                    {useHashtags && selectedPlatform !== 'copy' && selectedPlatform !== 'email' && (
                      <div className="flex flex-wrap gap-1">
                        {selectedHashtags.map(tag => (
                          <span key={tag} className="text-sm text-blue-600">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground truncate">
                      {eventUrl}
                      <span className="text-gray-400">{`?utm_source=${selectedPlatform}&utm_medium=social...`}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
              <h3 className="text-lg font-medium mb-2">Share Analytics</h3>
              <p className="text-muted-foreground mb-4">Track how your social media sharing performs</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <div className="bg-background p-3 rounded-lg border text-center">
                  <p className="text-2xl font-bold">48</p>
                  <p className="text-xs text-muted-foreground">Total Shares</p>
                </div>
                <div className="bg-background p-3 rounded-lg border text-center">
                  <p className="text-2xl font-bold">124</p>
                  <p className="text-xs text-muted-foreground">Link Clicks</p>
                </div>
                <div className="bg-background p-3 rounded-lg border text-center">
                  <p className="text-2xl font-bold">17</p>
                  <p className="text-xs text-muted-foreground">Ticket Sales</p>
                </div>
                <div className="bg-background p-3 rounded-lg border text-center">
                  <p className="text-2xl font-bold">13.7%</p>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSharing;
