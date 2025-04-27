
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Gift, Star, Trophy } from 'lucide-react';
import { RewardTier, UserRewardProfile } from '@/lib/rewards/types';
import { TierStatusIndicator } from './TierStatusIndicator';
import { RewardHistory } from './RewardHistory';
import { useRewards } from '@/hooks/rewards/useRewards';

export function UserRewardDashboard() {
  const { rewardProfile, isLoading } = useRewards();
  // Extract the current tier from rewardProfile instead of directly from useRewards
  const currentTier = rewardProfile?.currentTier?.id ? 
    parseInt(rewardProfile.currentTier.name.split(' ')[1]) || 1 : 1;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-48 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Points Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Points Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{rewardProfile?.points || 0}</div>
              <div className="text-sm text-muted-foreground">Current Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{rewardProfile?.lifetimePoints || 0}</div>
              <div className="text-sm text-muted-foreground">Lifetime Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {currentTier}
              </div>
              <div className="text-sm text-muted-foreground">Current Tier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tier Status */}
      <TierStatusIndicator currentTier={currentTier} points={rewardProfile?.points || 0} />

      {/* Reward History */}
      <RewardHistory transactions={rewardProfile?.transactionHistory || []} />
    </div>
  );
}
