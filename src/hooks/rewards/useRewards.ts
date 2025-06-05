
import { useState, useEffect } from 'react';
import { UserRewardProfile, transformRewardOffering, transformRewardTransaction } from '@/types/rewards';
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
        const mockProfile: UserRewardProfile = {
          id: '1',
          user_id: '1',
          points: 150,
          lifetime_points: 500,
          lifetimePoints: 500,
          currentTier: {
            id: 'tier-1',
            establishment_id: 'est-1',
            name: 'Silver',
            points_required: 100,
            pointsRequired: 100,
            minimumPoints: 100,
            benefits: ['Free drink on birthday', '10% off weekday purchases'],
            description: 'Silver tier rewards',
            color: '#C0C0C0',
            icon: 'award',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          availableRewards: [
            transformRewardOffering({
              id: 'reward-1',
              establishment_id: 'est-1',
              name: 'Free Mocktail',
              description: 'Redeem for any mocktail of your choice',
              points_required: 100,
              quantity_available: 50,
              expiration_days: 30,
              is_active: true,
              image_url: '/images/mocktail.jpg',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          ],
          transactionHistory: [
            transformRewardTransaction({
              id: 'trans-1',
              user_id: '1',
              points: 50,
              transaction_type: 'earn',
              description: 'Check-in reward',
              source: 'check-in',
              created_at: new Date().toISOString()
            })
          ],
          redemptionHistory: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setRewardProfile(mockProfile);
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
            points: Math.max(0, rewardProfile.points - rewardToRedeem.points_required)
          };
          setRewardProfile(mockUpdatedProfile);
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
