
import { describe, it, expect, beforeEach, vi, afterAll } from 'vitest';
import { supabase } from '@/lib/supabase';
import { rewardsApi } from '@/lib/rewards/api';
import { createMockQueryBuilder } from '../utils/supabaseTestUtils';
import { 
  RewardTier, 
  UserRewardProfile, 
  RewardTransaction, 
  RewardOffering,
  BatchRewardOperationResponse 
} from '@/lib/rewards/types';

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
    const pointsToAdd: Array<{amount: number; source: string; metadata: Record<string, any>}> = [
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
      ) as BatchRewardOperationResponse;
      
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
  
  // New test for achievement system
  it('should track and award achievements correctly', async () => {
    // Setup user for testing
    let userProfile = await rewardsApi.getUserRewardProfile(testUser.id);
    if (!userProfile) {
      console.log('No user profile available for achievement testing');
      return;
    }
    
    // Get initial achievements
    const initialAchievements = await rewardsApi.getUserAchievements(testUser.id);
    const initialCompletedCount = initialAchievements.filter(a => a.isCompleted).length;
    
    // Record activities that should trigger achievements
    const activities = [
      { type: 'visit', metadata: { establishmentId: 'est-123', isFirstVisit: true } },
      { type: 'mocktail', metadata: { mocktailId: 'mock-123', isNewTry: true } },
      { type: 'circuit', metadata: { circuitId: 'circ-123', completed: true } }
    ];
    
    // Record each activity
    let totalPointsAwarded = 0;
    for (const activity of activities) {
      const result = await rewardsApi.recordActivity(
        testUser.id, 
        activity.type as 'visit' | 'mocktail' | 'review' | 'share' | 'recipe' | 'circuit',
        activity.metadata
      );
      
      if (result.completedAchievements.length > 0) {
        // Sum up awarded points
        totalPointsAwarded += result.completedAchievements.reduce(
          (sum, achievement) => sum + achievement.pointsReward, 0
        );
      }
    }
    
    // Verify achievements were awarded
    const updatedAchievements = await rewardsApi.getUserAchievements(testUser.id);
    const newCompletedCount = updatedAchievements.filter(a => a.isCompleted).length;
    
    expect(newCompletedCount).toBeGreaterThanOrEqual(initialCompletedCount);
    
    // Verify points were awarded for achievements
    if (totalPointsAwarded > 0) {
      const updatedProfile = await rewardsApi.getUserRewardProfile(testUser.id);
      expect(updatedProfile?.points).toBeGreaterThanOrEqual(userProfile.points + totalPointsAwarded);
    }
  });

  // New test for reward redemption edge cases
  it('should handle reward redemption edge cases', async () => {
    // Get user profile
    const userProfile = await rewardsApi.getUserRewardProfile(testUser.id);
    if (!userProfile) {
      console.log('No user profile available for redemption testing');
      return;
    }
    
    // Test case: Attempt to redeem when user doesn't have enough points
    if (userProfile.availableRewards.length > 0) {
      // Find a reward that requires more points than the user has
      const expensiveReward = userProfile.availableRewards.find(
        reward => reward.points_required > userProfile.points
      );
      
      if (expensiveReward) {
        // Attempt redemption
        const result = await rewardsApi.redeemReward(testUser.id, expensiveReward.id);
        
        // Should fail due to insufficient points
        expect(result.success).toBe(false);
        expect(result.error).toContain('insufficient points');
      }
    }
    
    // Test case: Redeem a reward that has limited quantity
    if (userProfile.availableRewards.length > 0) {
      // Find a reward with limited quantity
      const limitedReward = userProfile.availableRewards.find(
        reward => reward.quantity_available !== null && reward.quantity_available > 0 && reward.quantity_available < 5
      );
      
      if (limitedReward && userProfile.points >= limitedReward.points_required) {
        // Get initial quantity
        const initialQuantity = limitedReward.quantity_available;
        
        // Redeem the reward
        const result = await rewardsApi.redeemReward(testUser.id, limitedReward.id);
        expect(result.success).toBe(true);
        
        // Verify quantity decreased
        const updatedProfile = await rewardsApi.getUserRewardProfile(testUser.id);
        const updatedReward = updatedProfile?.availableRewards.find(r => r.id === limitedReward.id);
        
        if (updatedReward && initialQuantity) {
          expect(updatedReward.quantity_available).toBe(initialQuantity - 1);
        }
      }
    }
  });
  
  // New test for user preferences
  it('should manage user reward preferences correctly', async () => {
    // Test preference data
    const testPreference = {
      preference_key: 'notification_settings',
      preference_value: {
        points_earned: true,
        tier_upgrades: true,
        special_offers: false
      }
    };
    
    // Save preference
    await rewardsApi.saveUserPreference(
      testUser.id,
      testPreference.preference_key,
      testPreference.preference_value
    );
    
    // Retrieve preference
    const savedPreference = await rewardsApi.getUserPreference(
      testUser.id,
      testPreference.preference_key
    );
    
    // Verify preference was saved correctly
    expect(savedPreference).toBeDefined();
    expect(savedPreference?.preference_value).toEqual(testPreference.preference_value);
    
    // Update preference
    const updatedValue = {
      ...testPreference.preference_value,
      special_offers: true
    };
    
    await rewardsApi.saveUserPreference(
      testUser.id,
      testPreference.preference_key,
      updatedValue
    );
    
    // Verify update
    const updatedPreference = await rewardsApi.getUserPreference(
      testUser.id,
      testPreference.preference_key
    );
    
    expect(updatedPreference?.preference_value).toEqual(updatedValue);
    
    // Add test preference to cleanup list
    createdResources.push({
      type: 'user_preference',
      id: updatedPreference?.id || ''
    });
  });
});
