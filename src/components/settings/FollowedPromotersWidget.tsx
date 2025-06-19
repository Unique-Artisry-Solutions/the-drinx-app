
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Users, Search, UserMinus, Calendar, TrendingUp } from 'lucide-react';
import { useUserFollowing, FollowedPromoter } from '@/hooks/useUserFollowing';
import { formatDistanceToNow } from 'date-fns';

const FollowedPromotersWidget: React.FC = () => {
  const { followedPromoters, stats, isLoading, unfollowPromoter } = useUserFollowing();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForUnfollow, setSelectedForUnfollow] = useState<string[]>([]);

  const filteredPromoters = followedPromoters.filter(promoter => {
    const displayName = promoter.promoter_profile?.display_name || promoter.promoter_profile?.username || 'Unknown Promoter';
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleUnfollow = async (promoterId: string) => {
    await unfollowPromoter.mutateAsync(promoterId);
  };

  const toggleSelection = (promoterId: string) => {
    setSelectedForUnfollow(prev => 
      prev.includes(promoterId) 
        ? prev.filter(id => id !== promoterId)
        : [...prev, promoterId]
    );
  };

  const handleBulkUnfollow = async () => {
    for (const promoterId of selectedForUnfollow) {
      await unfollowPromoter.mutateAsync(promoterId);
    }
    setSelectedForUnfollow([]);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Followed Promoters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Followed Promoters
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>{stats.total_following} following</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{stats.recent_follows} new today</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search and Bulk Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search followed promoters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {selectedForUnfollow.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Unfollow Selected ({selectedForUnfollow.length})
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Unfollow Multiple Promoters</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to unfollow {selectedForUnfollow.length} promoters? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkUnfollow}>
                      Unfollow All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Promoters List */}
          {filteredPromoters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No promoters found matching your search.' : 'You are not following any promoters yet.'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPromoters.map((promoter) => (
                <div key={promoter.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedForUnfollow.includes(promoter.promoter_id)}
                      onChange={() => toggleSelection(promoter.promoter_id)}
                      className="rounded"
                    />
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={promoter.promoter_profile?.avatar_url} />
                      <AvatarFallback>
                        {(promoter.promoter_profile?.display_name || promoter.promoter_profile?.username || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        {promoter.promoter_profile?.display_name || promoter.promoter_profile?.username || 'Unknown Promoter'}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>
                          Followed {formatDistanceToNow(new Date(promoter.followed_at), { addSuffix: true })}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {promoter.follower_count} followers
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Unfollow Promoter</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to unfollow {promoter.promoter_profile?.display_name || 'this promoter'}? 
                          You won't receive their updates anymore.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleUnfollow(promoter.promoter_id)}>
                          Unfollow
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowedPromotersWidget;
