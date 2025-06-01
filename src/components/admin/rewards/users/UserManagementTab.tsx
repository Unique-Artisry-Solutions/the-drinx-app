
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRewardProfile } from './UserRewardProfile';
import { UserRewardsList } from './UserRewardsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserFilter } from './UserFilter';
import { Skeleton } from '@/components/ui/skeleton';

export type RewardUser = {
  id: string;
  user_id: string;
  username?: string;
  points: number;
  lifetime_points: number;
  tier_name?: string;
  last_activity?: string;
  establishment_id?: string;
};

export const UserManagementTab = () => {
  const [users, setUsers] = useState<RewardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    searchTerm: '',
    tierFilter: '',
    sortBy: 'points',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRewardUsers();
  }, [filter]);

  const fetchRewardUsers = async () => {
    setIsLoading(true);
    try {
      // Modified query to fix the relationship issue by using explicit joins
      const { data: userRewardsData, error: userRewardsError } = await supabase
        .from('user_rewards')
        .select(`
          id,
          user_id,
          points,
          lifetime_points,
          current_tier_id,
          updated_at,
          establishment_id
        `)
        .order(filter.sortBy, { ascending: filter.sortOrder === 'asc' });
      
      if (userRewardsError) throw userRewardsError;
      
      // Get additional data with separate queries if needed
      const formattedUsers = await Promise.all(userRewardsData.map(async (item) => {
        // Fetch username from profiles
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', item.user_id)
          .single();
        
        // Fetch tier name if available
        let tierName = null;
        if (item.current_tier_id) {
          const { data: tierData } = await supabase
            .from('reward_tiers')
            .select('name')
            .eq('id', item.current_tier_id)
            .single();
          
          tierName = tierData?.name;
        }
        
        return {
          id: item.id,
          user_id: item.user_id,
          username: profileData?.username || `User ${item.user_id.substring(0, 6)}`,
          points: item.points,
          lifetime_points: item.lifetime_points,
          tier_name: tierName,
          last_activity: item.updated_at,
          establishment_id: item.establishment_id,
        };
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching reward users:', error);
      toast({
        title: 'Failed to load users',
        description: 'There was an error loading the reward users.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleUserUpdate = async (userId: string, points: number) => {
    try {
      const { error } = await supabase.rpc('update_user_points', {
        p_user_id: userId,
        p_points: points
      });
      
      if (error) throw error;
      
      toast({
        title: 'User points updated',
        description: `User points have been successfully updated.`,
      });
      
      // Refresh the user list
      fetchRewardUsers();
    } catch (error) {
      console.error('Error updating user points:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update user points.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Reward Management</CardTitle>
          <CardDescription>
            View and manage user rewards, points, and tiers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-1">
              <UserFilter 
                filter={filter}
                onFilterChange={setFilter}
                onRefresh={fetchRewardUsers}
              />
              
              {isLoading ? (
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <UserRewardsList 
                  users={users}
                  selectedUserId={selectedUserId}
                  onUserSelect={handleUserSelect}
                />
              )}
            </div>
            
            <div className="md:col-span-1 lg:col-span-2">
              {selectedUserId ? (
                <UserRewardProfile
                  userId={selectedUserId}
                  onUpdate={handleUserUpdate}
                />
              ) : (
                <div className="flex items-center justify-center h-64 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">Select a user to view their reward profile</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
