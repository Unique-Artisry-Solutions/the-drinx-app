
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePromoterFollowers } from '@/hooks/promoter/usePromoterFollowers';
import { Follower } from '@/types/SubscriptionTypes';
import { Search, SlidersHorizontal, Mail, MoreHorizontal, User2 } from 'lucide-react';

interface FollowersListProps {
  promoterId: string;
}

const FollowersList: React.FC<FollowersListProps> = ({ promoterId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { followedPromoters: followers, isLoading, error, unfollow } = usePromoterFollowers(promoterId);

  const filteredFollowers = followers.filter((follower) => 
    follower.promoter_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading followers...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8">
        <p className="text-red-500">Error loading followers: {error.message}</p>
      </div>
    );
  }

  if (!followers.length) {
    return (
      <div className="text-center p-8">
        <User2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium">No followers yet</p>
        <p className="text-muted-foreground">When users follow you, they'll appear here</p>
      </div>
    );
  }

  const handleUnfollow = (followerId: string) => {
    unfollow.mutate(followerId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search followers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFollowers.map((follower) => (
          <Card key={follower.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-medium">
                  {follower.promoter_name || 'Unknown User'}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Message</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Following since {new Date(follower.subscription_start).toLocaleDateString()}
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm">
                  {follower.notification_preferences?.events ? 'Events' : ''}
                  {follower.notification_preferences?.events && 
                    (follower.notification_preferences?.promotions || 
                     follower.notification_preferences?.announcements) ? ', ' : ''}
                  {follower.notification_preferences?.promotions ? 'Promotions' : ''}
                  {follower.notification_preferences?.promotions && 
                    follower.notification_preferences?.announcements ? ', ' : ''}
                  {follower.notification_preferences?.announcements ? 'Announcements' : ''}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleUnfollow(follower.id)}
                  disabled={unfollow.isPending}
                >
                  {unfollow.isPending ? 'Processing...' : 'Remove'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FollowersList;
