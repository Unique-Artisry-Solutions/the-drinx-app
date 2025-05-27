
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Instagram, Camera, Upload, Eye } from 'lucide-react';

interface InstagramStoriesIntegrationProps {
  eventId: string;
  eventName: string;
}

const InstagramStoriesIntegration: React.FC<InstagramStoriesIntegrationProps> = ({
  eventId,
  eventName
}) => {
  const { toast } = useToast();
  const [storyText, setStoryText] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleAddHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
      setHashtags([...hashtags, newHashtag.trim()]);
      setNewHashtag('');
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(h => h !== tag));
  };

  const handleConnectInstagram = () => {
    // Placeholder for Instagram API connection
    setIsConnected(true);
    toast({
      title: "Instagram Connected",
      description: "Your Instagram account has been connected successfully"
    });
  };

  const handleCreateStory = () => {
    if (!storyText.trim()) {
      toast({
        title: "Missing Content",
        description: "Please add text content for your story",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Story Created",
      description: "Your Instagram story has been scheduled for posting"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Instagram className="h-5 w-5 text-pink-500" />
          Instagram Stories
        </CardTitle>
        <CardDescription>
          Create and schedule Instagram Stories for your event
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center py-6 space-y-4">
            <Instagram className="h-12 w-12 mx-auto text-gray-400" />
            <p className="text-muted-foreground">Connect your Instagram account to create stories</p>
            <Button onClick={handleConnectInstagram}>
              Connect Instagram
            </Button>
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="story-text">Story Text</Label>
              <Textarea
                id="story-text"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Write your story text..."
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label>Hashtags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newHashtag}
                  onChange={(e) => setNewHashtag(e.target.value)}
                  placeholder="Add hashtag"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHashtag()}
                />
                <Button onClick={handleAddHashtag} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveHashtag(tag)}>
                    #{tag} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Add Photo
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Media
              </Button>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handleCreateStory}>
                Create Story
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InstagramStoriesIntegration;
