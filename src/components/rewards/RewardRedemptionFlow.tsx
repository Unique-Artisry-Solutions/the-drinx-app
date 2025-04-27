
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import { useRewards } from '@/hooks/rewards/useRewards';
import { useToast } from '@/hooks/use-toast';

export function RewardRedemptionFlow() {
  const { rewardProfile, redeemReward } = useRewards();
  const { toast } = useToast();

  const handleRedeem = async (offeringId: string) => {
    try {
      await redeemReward(offeringId);
      toast({
        title: "Success",
        description: "Reward successfully redeemed!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Available Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {rewardProfile?.availableRewards.map((reward) => (
            <Card key={reward.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{reward.name}</h3>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
                <div className="text-sm font-medium">{reward.points_required} points</div>
              </div>
              <Button
                onClick={() => handleRedeem(reward.id)}
                disabled={!rewardProfile?.points || rewardProfile.points < reward.points_required}
                className="w-full mt-2"
              >
                Redeem Reward
              </Button>
            </Card>
          ))}
          {(!rewardProfile?.availableRewards || rewardProfile.availableRewards.length === 0) && (
            <p className="text-center text-muted-foreground col-span-2">No rewards available at the moment</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
