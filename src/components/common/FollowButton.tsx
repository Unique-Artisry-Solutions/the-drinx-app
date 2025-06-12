
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Heart, UserPlus, UserMinus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface FollowButtonProps {
  promoterId: string;
  promoterName?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'compact';
  size?: 'sm' | 'default' | 'lg';
  showFollowerCount?: boolean;
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  promoterId,
  promoterName = 'promoter',
  variant = 'default',
  size = 'default',
  showFollowerCount = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if currently following
  const { data: isFollowing = false } = useQuery({
    queryKey: ['is-following', promoterId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data } = await supabase
        .from('promoter_followers')
        .select('id')
        .eq('promoter_id', promoterId)
        .eq('subscriber_id', user.id)
        .eq('follow_status', 'active')
        .maybeSingle();
      
      return !!data;
    },
    enabled: !!user && !!promoterId
  });

  // Get follower count
  const { data: followerCount = 0 } = useQuery({
    queryKey: ['follower-count', promoterId],
    queryFn: async () => {
      const { count } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', promoterId)
        .eq('follow_status', 'active');
      
      return count || 0;
    },
    enabled: !!promoterId && showFollowerCount
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User must be logged in');
      
      const { error } = await supabase
        .from('promoter_followers')
        .insert({
          promoter_id: promoterId,
          subscriber_id: user.id,
          follow_status: 'active'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following'] });
      queryClient.invalidateQueries({ queryKey: ['follower-count'] });
      toast({
        title: 'Following!',
        description: `You are now following ${promoterName}`,
      });
    },
    onError: (error) => {
      console.error('Error following:', error);
      toast({
        title: 'Error',
        description: `Failed to follow ${promoterName}`,
        variant: 'destructive'
      });
    }
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User must be logged in');
      
      const { error } = await supabase
        .from('promoter_followers')
        .delete()
        .eq('promoter_id', promoterId)
        .eq('subscriber_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following'] });
      queryClient.invalidateQueries({ queryKey: ['follower-count'] });
      toast({
        title: 'Unfollowed',
        description: `You have unfollowed ${promoterName}`,
      });
    },
    onError: (error) => {
      console.error('Error unfollowing:', error);
      toast({
        title: 'Error',
        description: `Failed to unfollow ${promoterName}`,
        variant: 'destructive'
      });
    }
  });

  const handleToggleFollow = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to follow promoters',
        variant: 'destructive'
      });
      return;
    }

    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const getButtonContent = () => {
    if (variant === 'compact') {
      return isFollowing ? (
        <Heart className={`h-4 w-4 ${isHovered ? 'text-red-500' : 'text-red-500 fill-current'}`} />
      ) : (
        <UserPlus className="h-4 w-4" />
      );
    }

    if (isFollowing) {
      return (
        <>
          {isHovered ? (
            <>
              <UserMinus className="h-4 w-4" />
              Unfollow
            </>
          ) : (
            <>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              Following
            </>
          )}
        </>
      );
    }

    return (
      <>
        <UserPlus className="h-4 w-4" />
        Follow
      </>
    );
  };

  const getButtonVariant = () => {
    if (variant === 'compact') {
      return isFollowing ? 'ghost' : 'outline';
    }
    
    if (isFollowing && isHovered) {
      return 'destructive';
    }
    
    return isFollowing ? 'outline' : variant;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={getButtonVariant()}
        size={size}
        onClick={handleToggleFollow}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={followMutation.isPending || unfollowMutation.isPending}
        className={variant === 'compact' ? 'px-3' : ''}
      >
        {getButtonContent()}
      </Button>

      {showFollowerCount && followerCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          {followerCount.toLocaleString()} followers
        </Badge>
      )}
    </div>
  );
};

export default FollowButton;
