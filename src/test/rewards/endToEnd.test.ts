
import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest';
import { supabase } from '@/lib/supabase';
import { rewardsApi } from '@/lib/rewards/api';
import { createMockQueryBuilder } from '../utils/supabaseTestUtils';
import { RewardTier, UserRewardProfile } from '@/lib/rewards/types';

// This is intentionally marked as .skip as end-to-end tests typically
// would be run in a separate process with real database connections
describe.skip('Reward System End-to-End Tests', () => {
  // Test user data
  const testUser = {
    id: 'e2e-test-user',
    email: 'e2e-test@example.com'
  };

  // Track created resources for cleanup
  const createdResources: { type: string; id: string }[] = [];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  // Cleanup after all tests
  afterAll(async () => {
    // In a real E2E test, we'd clean up the test data here
    console.log('Cleaning up test resources:', createdResources);
  });

  it('should execute a complete reward lifecycle', async () => {
    // STEP 1: Ensure the feature flag is enabled
    const isEnabled = await rewardsApi.isRewardsEnabled();
    expect(isEnabled).toBe(true);
    
    // STEP 2: Create test user reward profile (or get existing)
    let userProfile = await rewardsApi.getUserRewardProfile(testUser.id);
    if (!userProfile) {
      // In real E2E test, we would create the profile here
      // For now, mock it
      userProfile = {
        points: 0,
        lifetimePoints: 0,
        currentTier: null,
        availableRewards: [],
        transactionHistory: [],
        redemptionHistory: []
      };
    }
    
    const initialPoints = userProfile.points;
    
    // STEP 3: Add points for various activities
    const pointsToAdd = [
      { amount: 100, source: 'purchase', metadata: { orderId: 'order-123' } },
      { amount: 50, source: 'referral', metadata: { referredId: 'friend-123' } },
      { amount: 25, source: 'check-in', metadata: { locationId: 'location-123' } }
    ];
    
    // Execute point additions
    for (const pointData of pointsToAdd) {
      const result = await rewardsApi.addPoints(
        testUser.id,
        pointData.amount,
        pointData.source,
        pointData.metadata
      );
      expect(result.success).toBe(true);
    }
    
    // STEP 4: Verify updated points
    userProfile = await rewardsApi.getUserRewardProfile(testUser.id);
    
    const totalAdded = pointsToAdd.reduce((sum, p) => sum + p.amount, 0);
    expect(userProfile?.points).toBe(initialPoints + totalAdded);
    
    // Verify transaction history contains the new transactions
    expect(userProfile?.transactionHistory.length).toBeGreaterThanOrEqual(pointsToAdd.length);
    
    // STEP 5: Check if user qualifies for a reward
    if (userProfile && userProfile.availableRewards.length > 0) {
      const reward = userProfile.availableRewards[0];
      
      // STEP 6: Redeem the reward
      const redemptionResult = await rewardsApi.redeemReward(testUser.id, reward.id);
      expect(redemptionResult.success).toBe(true);
      
      // STEP 7: Verify points were deducted
      const updatedProfile = await rewardsApi.getUserRewardProfile(testUser.id);
      expect(updatedProfile?.points).toBe(userProfile.points - reward.points_required);
      
      // STEP 8: Verify redemption is in history
      expect(updatedProfile?.redemptionHistory.length).toBeGreaterThan(
        userProfile.redemptionHistory.length
      );
      
      const latestRedemption = updatedProfile?.redemptionHistory[0];
      expect(latestRedemption?.offering_id).toBe(reward.id);
      expect(latestRedemption?.points_spent).toBe(reward.points_required);
    } else {
      console.log('No rewards available for redemption in this test run');
    }
    
    // STEP 9: Test tier progression
    // Assuming tiers exist at certain point thresholds
    if (userProfile) {
      const tierBefore = userProfile.currentTier;
      
      // Add enough points to potentially reach a new tier
      const largePointAmount = 1000;
      await rewardsApi.addPoints(testUser.id, largePointAmount, 'e2e-test');
      
      const profileAfterMorePoints = await rewardsApi.getUserRewardProfile(testUser.id);
      
      // Either the tier changed, or we were already at max tier
      if (tierBefore?.id !== profileAfterMorePoints?.currentTier?.id) {
        console.log(`Tier progressed from ${tierBefore?.name || 'none'} to ${profileAfterMorePoints?.currentTier?.name || 'none'}`);
      } else {
        console.log(`Tier remained at ${tierBefore?.name || 'none'}`);
      }
      
      expect(profileAfterMorePoints?.points).toBe((userProfile.points + largePointAmount) - (userProfile?.availableRewards[0]?.points_required || 0));
    }
  });
});
