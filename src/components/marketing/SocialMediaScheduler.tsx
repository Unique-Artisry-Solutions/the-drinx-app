
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Instagram, Facebook, Twitter, Plus, Trash2 } from 'lucide-react';

interface ScheduledPost {
  id: string;
  platform: string;
  content: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
}

interface SocialMediaSchedulerProps {
  eventId: string;
}

const SocialMediaScheduler: React.FC<SocialMediaSchedulerProps> = ({ eventId }) => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [newPost, setNewPost] = useState({
    platform: 'instagram',
    content: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' }
  ];

  const handleSchedulePost = () => {
    if (!newPost.content.trim() || !newPost.scheduledDate || !newPost.scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const scheduledPost: ScheduledPost = {
      id: Date.now().toString(),
      platform: newPost.platform,
      content: newPost.content,
      scheduledTime: `${newPost.scheduledDate} ${newPost.scheduledTime}`,
      status: 'scheduled'
    };

    setPosts([...posts, scheduledPost]);
    setNewPost({
      platform: 'instagram',
      content: '',
      scheduledDate: '',
      scheduledTime: ''
    });

    toast({
      title: "Post Scheduled",
      description: "Your social media post has been scheduled successfully"
    });
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast({
      title: "Post Deleted",
      description: "Scheduled post has been removed"
    });
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.value === platform);
    if (!platformData) return null;
    const Icon = platformData.icon;
    return <Icon className={`h-4 w-4 ${platformData.color}`} />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Social Media Scheduler
          </CardTitle>
          <CardDescription>
            Schedule posts across multiple social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={newPost.platform} onValueChange={(value) => setNewPost({...newPost, platform: value})}>
              <SelectTrigger id="platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(platform => (
                  <SelectItem key={platform.value} value={platform.value}>
                    <div className="flex items-center gap-2">
                      <platform.icon className={`h-4 w-4 ${platform.color}`} />
                      {platform.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">Post Content</Label>
            <Textarea
              id="content"
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              placeholder="Write your post content..."
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Schedule Date</Label>
              <Input
                id="date"
                type="date"
                value={newPost.scheduledDate}
                onChange={(e) => setNewPost({...newPost, scheduledDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="time">Schedule Time</Label>
              <Input
                id="time"
                type="time"
                value={newPost.scheduledTime}
                onChange={(e) => setNewPost({...newPost, scheduledTime: e.target.value})}
              />
            </div>
          </div>

          <Button onClick={handleSchedulePost} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </CardContent>
      </Card>

      {posts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(post.platform)}
                      <span className="font-medium capitalize">{post.platform}</span>
                      <Badge variant={post.status === 'scheduled' ? 'default' : post.status === 'published' ? 'secondary' : 'destructive'}>
                        {post.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700">{post.content}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {post.scheduledTime}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialMediaScheduler;
