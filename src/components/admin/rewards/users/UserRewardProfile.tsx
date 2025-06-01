
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, History, Award, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserRewardProfileProps {
  userId: string;
  onClose?: () => void;
}

interface RewardTransaction {
  id: string;
  points: number;
  transaction_type: string;
  source: string;
  description?: string;
  created_at: string;
}

interface UserRewardData {
  id: string;
  user_id: string;
  points: number;
  lifetime_points: number;
  tier_id?: string;
  tier_name?: string;
  created_at: string;
  updated_at: string;
}

export const UserRewardProfile: React.FC<UserRewardProfileProps> = ({ userId, onClose }) => {
  const { toast } = useToast();
  const [userRewards, setUserRewards] = useState<UserRewardData | null>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adjustmentPoints, setAdjustmentPoints] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const fetchUserRewards = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - would fetch from Supabase in real implementation
      const mockUserData: UserRewardData = {
        id: '1',
        user_id: userId,
        points: 1250,
        lifetime_points: 3500,
        tier_id: 'tier-2',
        tier_name: 'Silver',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockTransactions: RewardTransaction[] = [
        {
          id: '1',
          points: 50,
          transaction_type: 'earned',
          source: 'check_in',
          description: 'Daily check-in bonus',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          points: -100,
          transaction_type: 'redeemed',
          source: 'reward_redemption',
          description: 'Free drink redemption',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      setUserRewards(mockUserData);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching user rewards:', error);
      toast({
        title: "Error",
        description: "Failed to load user reward data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePointsAdjustment = async (isPositive: boolean) => {
    if (!adjustmentPoints || !adjustmentReason.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both points amount and reason",
        variant: "destructive"
      });
      return;
    }

    setIsAdjusting(true);
    try {
      const points = isPositive ? adjustmentPoints : -adjustmentPoints;
      
      // In real implementation, this would update the database
      setUserRewards(prev => {
        if (!prev) return prev;
        const newPoints = Math.max(0, prev.points + points);
        const newLifetimePoints = isPositive ? prev.lifetime_points + adjustmentPoints : prev.lifetime_points;
        
        return {
          ...prev,
          points: newPoints,
          lifetime_points: newLifetimePoints,
          updated_at: new Date().toISOString()
        };
      });

      // Add transaction record
      const newTransaction: RewardTransaction = {
        id: Date.now().toString(),
        points,
        transaction_type: isPositive ? 'manual_add' : 'manual_deduct',
        source: 'admin_adjustment',
        description: adjustmentReason,
        created_at: new Date().toISOString()
      };

      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: "Points Adjusted",
        description: `${isPositive ? 'Added' : 'Deducted'} ${adjustmentPoints} points`,
      });

      setAdjustmentPoints(0);
      setAdjustmentReason('');
    } catch (error) {
      console.error('Error adjusting points:', error);
      toast({
        title: "Error",
        description: "Failed to adjust points",
        variant: "destructive"
      });
    } finally {
      setIsAdjusting(false);
    }
  };

  useEffect(() => {
    fetchUserRewards();
  }, [userId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading User Profile...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userRewards) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to load user reward data.</p>
          {onClose && (
            <Button onClick={onClose} className="mt-4">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            User Reward Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userRewards.points}</div>
              <div className="text-sm text-muted-foreground">Current Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userRewards.lifetime_points}</div>
              <div className="text-sm text-muted-foreground">Lifetime Points</div>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-lg py-1 px-3">
                {userRewards.tier_name || 'No Tier'}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Current Tier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points Adjustment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Adjust Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adjustment-points">Points Amount</Label>
                <Input
                  id="adjustment-points"
                  type="number"
                  value={adjustmentPoints}
                  onChange={(e) => setAdjustmentPoints(Number(e.target.value))}
                  min="0"
                  placeholder="Enter points amount"
                />
              </div>
              <div>
                <Label htmlFor="adjustment-reason">Reason</Label>
                <Textarea
                  id="adjustment-reason"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Reason for adjustment"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handlePointsAdjustment(true)}
                disabled={isAdjusting || !adjustmentPoints || !adjustmentReason.trim()}
                className="flex-1"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Points
              </Button>
              <Button
                onClick={() => handlePointsAdjustment(false)}
                disabled={isAdjusting || !adjustmentPoints || !adjustmentReason.trim()}
                variant="destructive"
                className="flex-1"
              >
                <Minus className="mr-2 h-4 w-4" />
                Deduct Points
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No transactions found</p>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={transaction.points > 0 ? 'default' : 'destructive'}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </Badge>
                      <span className="font-medium capitalize">
                        {transaction.transaction_type.replace('_', ' ')}
                      </span>
                    </div>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.source.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {onClose && (
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserRewardProfile;
