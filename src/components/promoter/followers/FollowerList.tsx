
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useFollowers, FollowerData } from '@/hooks/useFollowers';
import { Badge } from '@/components/ui/badge';

interface FollowerListProps {
  promoterId: string;
  onSelectionChange?: (selectedIds: string[]) => void;
}

const FollowerList: React.FC<FollowerListProps> = ({ 
  promoterId, 
  onSelectionChange 
}) => {
  const { followers, removeFollower, sendNotification } = useFollowers(promoterId);
  const [selectedFollowers, setSelectedFollowers] = useState<string[]>([]);

  const handleSelectFollower = (followerId: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedFollowers, followerId]
      : selectedFollowers.filter(id => id !== followerId);
    
    setSelectedFollowers(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleQuickMessage = async (followerId: string) => {
    try {
      await sendNotification.mutateAsync({
        followerIds: [followerId],
        message: "Thank you for following! We appreciate your support.",
        title: "Welcome!"
      });
    } catch (error) {
      console.error('Error sending quick message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Followers ({followers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {followers.map((follower: FollowerData) => (
            <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedFollowers.includes(follower.subscriber_id)}
                  onCheckedChange={(checked) => 
                    handleSelectFollower(follower.subscriber_id, checked as boolean)
                  }
                />
                
                <div>
                  <div className="font-medium">
                    {follower.profiles?.display_name || 
                     follower.profiles?.username || 
                     `Follower ${follower.subscriber_id.slice(0, 8)}...`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Joined: {formatDate(follower.created_at)}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={follower.follow_status === 'active' ? 'default' : 'secondary'}>
                      {follower.follow_status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickMessage(follower.subscriber_id)}
                  disabled={sendNotification.isPending}
                >
                  Quick Message
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeFollower.mutate(follower.subscriber_id)}
                  disabled={removeFollower.isPending}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          
          {followers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No followers found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowerList;
