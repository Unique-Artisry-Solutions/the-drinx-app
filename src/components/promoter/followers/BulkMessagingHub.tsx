
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useFollowers, FollowerData } from '@/hooks/useFollowers';
import { useToast } from '@/hooks/use-toast';

interface BulkMessagingHubProps {
  promoterId: string;
}

const BulkMessagingHub: React.FC<BulkMessagingHubProps> = ({ promoterId }) => {
  const { followers, sendNotification } = useFollowers(promoterId);
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFollowers(followers.map(f => f.subscriber_id));
    } else {
      setSelectedFollowers([]);
    }
  };

  const handleSelectFollower = (followerId: string, checked: boolean) => {
    if (checked) {
      setSelectedFollowers(prev => [...prev, followerId]);
    } else {
      setSelectedFollowers(prev => prev.filter(id => id !== followerId));
    }
  };

  const handleSendBulkMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive"
      });
      return;
    }

    if (selectedFollowers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one follower.",
        variant: "destructive"
      });
      return;
    }

    try {
      await sendNotification.mutateAsync({
        followerIds: selectedFollowers,
        message,
        title
      });
      setMessage('');
      setTitle('');
      setSelectedFollowers([]);
    } catch (error) {
      console.error('Error sending bulk message:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compose Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bulk-title">Subject (Optional)</Label>
            <Input
              id="bulk-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter message subject..."
            />
          </div>
          
          <div>
            <Label htmlFor="bulk-message">Message</Label>
            <Textarea
              id="bulk-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Recipients</CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedFollowers.length === followers.length && followers.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all">Select All ({followers.length})</Label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {followers.map((follower: FollowerData) => (
              <div key={follower.id} className="flex items-center space-x-2">
                <Checkbox
                  id={follower.id}
                  checked={selectedFollowers.includes(follower.subscriber_id)}
                  onCheckedChange={(checked) => 
                    handleSelectFollower(follower.subscriber_id, checked as boolean)
                  }
                />
                <Label htmlFor={follower.id} className="flex-1">
                  Follower {follower.subscriber_id.slice(0, 8)}...
                  {follower.profiles?.display_name && (
                    <span className="text-muted-foreground ml-2">
                      ({follower.profiles.display_name})
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-4">
              {selectedFollowers.length} of {followers.length} followers selected
            </div>
            
            <Button 
              onClick={handleSendBulkMessage}
              disabled={sendNotification.isPending}
              className="w-full"
            >
              {sendNotification.isPending ? 'Sending...' : 'Send to Selected Followers'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkMessagingHub;
