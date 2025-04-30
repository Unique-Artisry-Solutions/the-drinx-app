
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
      // Query user rewards joined with profiles to get usernames
      let query = supabase
        .from('user_rewards')
        .select(`
          id,
          user_id,
          points,
          lifetime_points,
          current_tier_id,
          updated_at,
          establishment_id,
          profiles:user_id(username),
          reward_tiers:current_tier_id(name)
        `);

      // Apply filters
      if (filter.searchTerm) {
        // This would be more efficient with a proper full-text search
        query = query.textSearch('profiles.username', filter.searchTerm);
      }

      if (filter.tierFilter) {
        query = query.eq('current_tier_id', filter.tierFilter);
      }

      // Apply sorting
      if (filter.sortBy && filter.sortOrder) {
        query = query.order(filter.sortBy, { ascending: filter.sortOrder === 'asc' });
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match RewardUser type
      const formattedUsers = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        username: item.profiles?.username,
        points: item.points,
        lifetime_points: item.lifetime_points,
        tier_name: item.reward_tiers?.name,
        last_activity: item.updated_at,
        establishment_id: item.establishment_id,
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
