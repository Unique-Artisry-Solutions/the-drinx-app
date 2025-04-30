
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Save, UserIcon, History, Award, RefreshCw } from 'lucide-react';
import { RewardTransaction } from '@/lib/rewards/types';

interface UserRewardProfileProps {
  userId: string;
  onUpdate: (userId: string, points: number) => Promise<void>;
}

export const UserRewardProfile = ({ userId, onUpdate }: UserRewardProfileProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [pointsAdjustment, setPointsAdjustment] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
    fetchTransactions();
  }, [userId]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      // Get user reward data
      const { data: rewardData, error: rewardError } = await supabase
        .from('user_rewards')
        .select(`
          *,
          reward_tiers:current_tier_id(id, name, points_required, benefits, icon, color)
        `)
        .eq('user_id', userId)
        .single();
        
      if (rewardError) throw rewardError;
      
      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is okay if the user doesn't have a profile
        throw profileError;
      }
      
      setProfile({
        ...rewardData,
        profile: profileData || { username: 'Unknown User' }
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Failed to load profile',
        description: 'There was a problem loading the user reward profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Failed to load transactions',
        description: 'There was a problem loading the reward transactions.',
        variant: 'destructive',
      });
    }
  };

  const handleSavePointsAdjustment = async () => {
    if (!pointsAdjustment) return;
    
    setIsSaving(true);
    try {
      await onUpdate(userId, pointsAdjustment);
      setIsEditingPoints(false);
      setPointsAdjustment(0);
      fetchUserProfile();
      fetchTransactions();
    } catch (error) {
      console.error('Error updating points:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Not Found</CardTitle>
          <CardDescription>
            This user doesn't have a reward profile yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => fetchUserProfile()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {profile.profile?.username || `User ${userId.substring(0, 8)}`}
            </CardTitle>
            <CardDescription>
              User ID: {userId}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => fetchUserProfile()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">Current Points</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{profile.points}</span>
              {isEditingPoints ? (
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    className="w-20 h-8"
                    value={pointsAdjustment}
                    onChange={(e) => setPointsAdjustment(parseInt(e.target.value) || 0)}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleSavePointsAdjustment}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsEditingPoints(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Lifetime Points</div>
            <div className="text-3xl font-bold">{profile.lifetime_points}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Current Tier</div>
            <div className="flex items-center gap-2">
              {profile.reward_tiers ? (
                <Badge className="text-lg py-1 px-3" style={{
                  backgroundColor: profile.reward_tiers.color || '#4f46e5',
                  color: '#ffffff'
                }}>
                  {profile.reward_tiers.name}
                </Badge>
              ) : (
                <span className="text-muted-foreground">No tier assigned</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="transactions">
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">
                <History className="h-4 w-4 mr-2" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="profile">
                <UserIcon className="h-4 w-4 mr-2" />
                User Details
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map(tx => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            {new Date(tx.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={tx.transaction_type === 'earn' ? 'default' : 'destructive'}>
                              {tx.transaction_type === 'earn' ? 'EARNED' : 'SPENT'}
                            </Badge>
                          </TableCell>
                          <TableCell className={tx.transaction_type === 'earn' ? 'text-green-600' : 'text-red-600'}>
                            {tx.transaction_type === 'earn' ? '+' : '-'}{tx.points}
                          </TableCell>
                          <TableCell>{tx.source}</TableCell>
                          <TableCell>{tx.description || '-'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardContent className="pt-6">
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Username</dt>
                      <dd className="text-lg">{profile.profile?.username || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Display Name</dt>
                      <dd className="text-lg">{profile.profile?.display_name || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">User Type</dt>
                      <dd className="text-lg">{profile.profile?.user_type || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Joined</dt>
                      <dd className="text-lg">
                        {profile.profile?.created_at ? new Date(profile.profile.created_at).toLocaleDateString() : 'N/A'}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements">
              <div className="flex items-center justify-center h-40 border rounded-md bg-muted/20">
                <p className="text-muted-foreground">No achievements data available yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-between">
        <div className="text-xs text-muted-foreground">
          Last updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Unknown'}
        </div>
        <Button variant="outline" onClick={() => fetchTransactions()}>
          Refresh Transactions
        </Button>
      </CardFooter>
    </Card>
  );
};

// Import the Table components needed in this file
const { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } = require("@/components/ui/table");
