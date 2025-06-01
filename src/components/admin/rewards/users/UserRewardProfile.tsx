
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { MockDataService } from '@/services/MockDataService';
import { useMockDatabase } from '@/hooks/useMockDatabase';

interface UserRewardProfileProps {
  userId: string;
  onUpdate: (userId: string, points: number) => void;
}

export const UserRewardProfile: React.FC<UserRewardProfileProps> = ({ 
  userId, 
  onUpdate 
}) => {
  const [profile, setProfile] = useState<any>(null);
  const [rewards, setRewards] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pointsToAdd, setPointsToAdd] = useState('');
  const { toast } = useToast();
  const { supabase, isMockMode } = useMockDatabase();

  useEffect(() => {
    fetchUserProfile();
  }, [userId, isMockMode]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      if (isMockMode) {
        // Use mock data
        const mockProfile = MockDataService.getProfile(userId);
        const mockRewards = {
          points: 150,
          lifetime_points: 450,
          current_tier: { name: 'Silver', points_required: 100 },
          recent_transactions: [
            {
              id: 'txn-001',
              points: 25,
              description: 'Visit check-in',
              created_at: new Date().toISOString()
            },
            {
              id: 'txn-002', 
              points: -50,
              description: 'Reward redemption',
              created_at: new Date(Date.now() - 86400000).toISOString()
            }
          ]
        };
        
        setProfile(mockProfile);
        setRewards(mockRewards);
        console.log('[MockDB] Loaded mock user profile:', mockProfile);
      } else {
        // Use real Supabase queries
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        const { data: rewardsData, error: rewardsError } = await supabase
          .from('user_rewards')
          .select(`
            points,
            lifetime_points,
            reward_tiers (*)
          `)
          .eq('user_id', userId)
          .maybeSingle();

        if (rewardsError) throw rewardsError;

        setProfile(profileData);
        setRewards(rewardsData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Failed to load profile',
        description: 'There was an error loading the user profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePointsUpdate = async () => {
    const points = parseInt(pointsToAdd);
    if (isNaN(points)) {
      toast({
        title: 'Invalid input',
        description: 'Please enter a valid number of points.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isMockMode) {
        // Simulate points update in mock mode
        setRewards(prev => ({
          ...prev,
          points: prev.points + points,
          lifetime_points: points > 0 ? prev.lifetime_points + points : prev.lifetime_points
        }));
        
        toast({
          title: 'Points updated (Mock Mode)',
          description: `Successfully ${points > 0 ? 'added' : 'deducted'} ${Math.abs(points)} points.`,
        });
      } else {
        await onUpdate(userId, points);
      }
      
      setPointsToAdd('');
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No user selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {isMockMode && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
          <p className="text-sm text-orange-800">
            <strong>Mock Mode Active:</strong> This data is simulated for testing purposes.
          </p>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>{profile.display_name}</CardTitle>
          <CardDescription>@{profile.username} • {profile.user_type}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Current Points</Label>
              <p className="text-2xl font-bold text-green-600">
                {rewards?.points || 0}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Lifetime Points</Label>
              <p className="text-2xl font-bold text-blue-600">
                {rewards?.lifetime_points || 0}
              </p>
            </div>
          </div>
          
          {rewards?.current_tier && (
            <div className="mt-4">
              <Label className="text-sm font-medium">Current Tier</Label>
              <Badge variant="secondary" className="ml-2">
                {rewards.current_tier.name}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adjust Points</CardTitle>
          <CardDescription>
            Add or remove points from this user's account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Points to add/remove"
              value={pointsToAdd}
              onChange={(e) => setPointsToAdd(e.target.value)}
            />
            <Button onClick={handlePointsUpdate}>
              Update Points
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Use negative numbers to remove points
          </p>
        </CardContent>
      </Card>

      {rewards?.recent_transactions && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rewards.recent_transactions.map((txn: any) => (
                <div key={txn.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(txn.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={txn.points > 0 ? 'default' : 'destructive'}>
                    {txn.points > 0 ? '+' : ''}{txn.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
