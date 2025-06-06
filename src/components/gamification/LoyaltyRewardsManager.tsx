
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Clock, Star, Crown, Coins, Calendar, Lock, Check } from 'lucide-react';
import type { GamificationReward, LoyaltyPoints } from '@/types/gamification';

interface LoyaltyRewardsManagerProps {
  rewards: GamificationReward[];
  loyaltyPoints: LoyaltyPoints | null;
  currentTierLevel: number;
  onRewardRedeem?: (rewardId: string) => void;
  redeemedRewards?: string[];
  isRedeeming?: boolean;
}

const RewardTypeIcons = {
  exclusive_content: Star,
  early_access: Clock,
  discount: Gift,
  merchandise: Crown,
  experience: Calendar,
  digital_perk: Coins
};

const RewardCard: React.FC<{
  reward: GamificationReward;
  canAfford: boolean;
  tierEligible: boolean;
  isRedeemed: boolean;
  onRedeem: () => void;
  isRedeeming: boolean;
}> = ({ reward, canAfford, tierEligible, isRedeemed, onRedeem, isRedeeming }) => {
  const IconComponent = RewardTypeIcons[reward.reward_type];
  const isAvailable = canAfford && tierEligible && !isRedeemed;

  return (
    <Card className={`relative overflow-hidden ${
      isRedeemed ? 'opacity-60' : isAvailable ? 'hover:shadow-lg transition-shadow' : 'opacity-80'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{reward.name}</h3>
              <p className="text-sm text-muted-foreground">{reward.description}</p>
            </div>
          </div>
          {isRedeemed && (
            <Check className="w-5 h-5 text-green-500" />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {reward.cost_points && (
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className={`text-sm font-medium ${canAfford ? 'text-green-600' : 'text-red-500'}`}>
                    {reward.cost_points} points
                  </span>
                </div>
              )}
              {reward.cost_tier_level && (
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-purple-500" />
                  <span className={`text-sm font-medium ${tierEligible ? 'text-green-600' : 'text-red-500'}`}>
                    Tier {reward.cost_tier_level}+
                  </span>
                </div>
              )}
            </div>
            <Badge variant={isAvailable ? 'default' : 'secondary'}>
              {reward.reward_type.replace('_', ' ')}
            </Badge>
          </div>

          {reward.max_redemptions && (
            <div className="text-xs text-muted-foreground">
              {reward.current_redemptions}/{reward.max_redemptions} redeemed
            </div>
          )}

          {reward.availability_end && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <Clock className="w-3 h-3" />
              Expires: {new Date(reward.availability_end).toLocaleDateString()}
            </div>
          )}

          <div className="pt-2">
            {isRedeemed ? (
              <Button variant="outline" disabled className="w-full">
                <Check className="w-4 h-4 mr-2" />
                Redeemed
              </Button>
            ) : !tierEligible ? (
              <Button variant="outline" disabled className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Tier {reward.cost_tier_level} Required
              </Button>
            ) : !canAfford ? (
              <Button variant="outline" disabled className="w-full">
                <Coins className="w-4 h-4 mr-2" />
                Insufficient Points
              </Button>
            ) : (
              <Button 
                onClick={onRedeem} 
                disabled={isRedeeming}
                className="w-full"
              >
                {isRedeeming ? 'Redeeming...' : 'Redeem'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LoyaltyRewardsManager: React.FC<LoyaltyRewardsManagerProps> = ({
  rewards,
  loyaltyPoints,
  currentTierLevel,
  onRewardRedeem,
  redeemedRewards = [],
  isRedeeming = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentPoints = loyaltyPoints?.current_points || 0;
  const redeemedSet = new Set(redeemedRewards);

  const getRewardsByType = (type?: string) => {
    return type && type !== 'all' 
      ? rewards.filter(r => r.reward_type === type)
      : rewards;
  };

  const canAffordReward = (reward: GamificationReward): boolean => {
    return !reward.cost_points || currentPoints >= reward.cost_points;
  };

  const isTierEligible = (reward: GamificationReward): boolean => {
    return !reward.cost_tier_level || currentTierLevel >= reward.cost_tier_level;
  };

  const rewardTypes = Array.from(new Set(rewards.map(r => r.reward_type)));

  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-500" />
            Loyalty Points Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{currentPoints}</div>
              <div className="text-sm text-yellow-700">Available Points</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{loyaltyPoints?.lifetime_points || 0}</div>
              <div className="text-sm text-blue-700">Lifetime Points</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{loyaltyPoints?.points_spent || 0}</div>
              <div className="text-sm text-purple-700">Points Spent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Catalog */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Rewards Catalog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all">All</TabsTrigger>
              {rewardTypes.map(type => (
                <TabsTrigger key={type} value={type}>
                  {type.replace('_', ' ')}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rewards.map(reward => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    canAfford={canAffordReward(reward)}
                    tierEligible={isTierEligible(reward)}
                    isRedeemed={redeemedSet.has(reward.id)}
                    onRedeem={() => onRewardRedeem?.(reward.id)}
                    isRedeeming={isRedeeming}
                  />
                ))}
              </div>
            </TabsContent>

            {rewardTypes.map(type => (
              <TabsContent key={type} value={type} className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getRewardsByType(type).map(reward => (
                    <RewardCard
                      key={reward.id}
                      reward={reward}
                      canAfford={canAffordReward(reward)}
                      tierEligible={isTierEligible(reward)}
                      isRedeemed={redeemedSet.has(reward.id)}
                      onRedeem={() => onRewardRedeem?.(reward.id)}
                      isRedeeming={isRedeeming}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {rewards.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No rewards available at this time.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyRewardsManager;
