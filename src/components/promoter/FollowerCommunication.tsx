
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFollowers } from '@/hooks/useFollowers';
import { useToast } from '@/hooks/use-toast';

interface FollowerCommunicationProps {
  promoterId: string;
  selectedFollowerIds?: string[];
}

const FollowerCommunication: React.FC<FollowerCommunicationProps> = ({ 
  promoterId, 
  selectedFollowerIds = [] 
}) => {
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const { sendNotification } = useFollowers(promoterId);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive"
      });
      return;
    }

    if (selectedFollowerIds.length === 0) {
      toast({
        title: "Error", 
        description: "Please select followers to message.",
        variant: "destructive"
      });
      return;
    }

    try {
      await sendNotification.mutateAsync({
        followerIds: selectedFollowerIds,
        message,
        title
      });
      setMessage('');
      setTitle('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Message to Followers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Subject (Optional)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter message subject..."
          />
        </div>
        
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
            rows={4}
          />
        </div>
        
        <div className="text-sm text-muted-foreground">
          {selectedFollowerIds.length} follower(s) selected
        </div>
        
        <Button 
          onClick={handleSendMessage}
          disabled={sendNotification.isPending}
          className="w-full"
        >
          {sendNotification.isPending ? 'Sending...' : 'Send Message'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FollowerCommunication;
