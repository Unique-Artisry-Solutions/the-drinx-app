
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import UserFilter from './UserFilter';
import UserRewardsList from './UserRewardsList';

interface RewardUser {
  id: string;
  user_id: string;
  username: string;
  points: number;
  lifetime_points: number;
  tier_name?: string;
  last_activity: string;
  establishment_id?: string;
}

interface UserManagementTabProps {
  establishmentId?: string;
}

export const UserManagementTab: React.FC<UserManagementTabProps> = ({ establishmentId }) => {
  const _establishmentId = establishmentId; // Keep variable to avoid TS6133 error
  const [users, setUsers] = useState<RewardUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RewardUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          id,
          user_id,
          points,
          lifetime_points,
          created_at,
          profiles!inner(username),
          reward_tiers(name)
        `)
        .order('lifetime_points', { ascending: false });

      if (error) throw error;

      if (data) {
        // Transform the data to match RewardUser interface with proper null handling
        const transformedUsers: RewardUser[] = data.map(user => ({
          id: user.id,
          user_id: user.user_id,
          username: (user.profiles as any)?.username || 'Unknown User',
          points: user.points || 0,
          lifetime_points: user.lifetime_points || 0,
          tier_name: (user.reward_tiers as any)?.name || undefined, // Convert null to undefined
          last_activity: user.created_at,
          establishment_id: null
        }));

        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (selectedTier !== 'all') {
      filtered = filtered.filter(user => user.tier_name === selectedTier);
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [users, selectedTier, searchTerm]);

  const uniqueTiers = Array.from(new Set(users.map(user => user.tier_name).filter(Boolean)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="flex gap-2">
            <Button onClick={fetchUsers} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <UserFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
              tiers={uniqueTiers}
            />

            <div className="flex gap-2 flex-wrap">
              <Badge 
                variant={selectedTier === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTier('all')}
              >
                All Tiers ({users.length})
              </Badge>
              {uniqueTiers.map((tier) => {
                const count = users.filter(user => user.tier_name === tier).length;
                return (
                  <Badge
                    key={tier}
                    variant={selectedTier === tier ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedTier(tier || '')}
                  >
                    {tier} ({count})
                  </Badge>
                );
              })}
            </div>

            <UserRewardsList users={filteredUsers} isLoading={isLoading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTab;
