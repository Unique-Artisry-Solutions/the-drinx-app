
import { useState, useEffect } from 'react';
import { UserRewardProfile } from '@/lib/rewards/types';
import { toast } from 'sonner';

export const useRewards = () => {
  const [rewardProfile, setRewardProfile] = useState<UserRewardProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock implementation for testing
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        // In a real implementation, this would call an API
        setRewardProfile({
          id: '1',
          points: 150,
          lifetimePoints: 500,
          lifetime_points: 500,
          currentTier: {
            id: 'tier-1',
            name: 'Silver',
            minimumPoints: 100,
            points_required: 100,
            benefits: ['Free drink on birthday', '10% off weekday purchases'],
            description: 'Silver tier rewards',
            color: '#C0C0C0',
            icon: 'award',
            is_active: true
          },
          availableRewards: [
            {
              id: 'reward-1',
              name: 'Free Mocktail',
              description: 'Redeem for any mocktail of your choice',
              pointCost: 100,
              pointsRequired: 100,
              points_required: 100,
              availableQuantity: 50,
              quantity_available: 50,
              expiration_days: 30,
              is_active: true,
              image_url: '/images/mocktail.jpg'
            }
          ],
          transactionHistory: [
            {
              id: 'trans-1',
              userId: '1',
              user_id: '1',
              pointsAmount: 50,
              points: 50,
              type: 'EARN',
              transaction_type: 'EARN',
              timestamp: new Date().toISOString(),
              description: 'Check-in reward',
              date: new Date().toISOString(),
              source: 'check-in'
            }
          ],
          redemptionHistory: []
        } as any);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch rewards'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRewards();
  }, []);

  // Add the redeemReward method to fix the build error
  const redeemReward = async (rewardId: string) => {
    try {
      setIsLoading(true);
      // Mock implementation - in a real app this would call an API
      console.log(`Redeeming reward with ID: ${rewardId}`);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock success
      toast.success("Reward redeemed successfully!");
      
      // Update the reward profile to reflect the redemption
      if (rewardProfile) {
        const rewardToRedeem = rewardProfile.availableRewards.find(r => r.id === rewardId);
        if (rewardToRedeem) {
          const mockUpdatedProfile = {
            ...rewardProfile,
            points: Math.max(0, rewardProfile.points - (rewardToRedeem.pointCost || 100))
          };
          setRewardProfile(mockUpdatedProfile as any);
        }
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to redeem reward'));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rewardProfile,
    isLoading,
    error,
    redeemReward
  };
};
