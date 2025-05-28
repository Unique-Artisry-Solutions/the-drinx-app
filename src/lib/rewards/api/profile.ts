
import { supabase } from '@/lib/supabase';
import { UserRewardProfile, transformUserRewardProfile, transformRewardOffering } from '@/types/rewards';
import { RewardsCache } from '../system/RewardsCache';

export async function getUserRewardProfile(userId: string): Promise<UserRewardProfile | null> {
  const cacheKey = `user_reward_profile_${userId}`;
  const cacheStatus = await RewardsCache.getCacheStatus(cacheKey);
  
  if (cacheStatus && !cacheStatus.is_invalidated) {
    console.log('Cache hit for user reward profile:', userId);
    const cachedData = cacheStatus.metadata?.cached_data;
    if (cachedData) {
      return transformUserRewardProfile(JSON.parse(cachedData));
    }
  }

  try {
    // For now, return mock data until the database schema is complete
    const mockProfile = {
      id: userId,
      points: 150,
      lifetime_points: 500,
      lifetimePoints: 500,
      currentTier: {
        id: 'tier-1',
        name: 'Silver',
        points_required: 100,
        pointsRequired: 100,
        minimumPoints: 100,
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
          points_required: 100,
          pointsRequired: 100,
          pointCost: 100,
          pointValue: 100,
          quantity_available: 50,
          availableQuantity: 50,
          expiration_days: 30,
          is_active: true,
          image_url: '/images/mocktail.jpg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ].map(transformRewardOffering),
      transactionHistory: [
        {
          id: 'trans-1',
          user_id: userId,
          userId: userId,
          points: 50,
          pointsAmount: 50,
          transaction_type: 'EARN',
          type: 'EARN',
          description: 'Check-in reward',
          source: 'check-in',
          created_at: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          date: new Date().toISOString()
        }
      ],
      redemptionHistory: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const transformedProfile = transformUserRewardProfile(mockProfile);
    
    // Cache the result for 5 minutes
    await RewardsCache.updateCache(cacheKey, 300, transformedProfile);
    
    return transformedProfile;
  } catch (error) {
    console.error('Unexpected error in getUserRewardProfile:', error);
    return null;
  }
}

// Re-export from redemption module
export { redeemReward } from './redemption';
