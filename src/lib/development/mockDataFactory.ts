
import { 
  RewardTier, 
  RewardOffering, 
  Achievement, 
  RewardTransaction, 
  UserRewardProfile,
  RewardAnalytics,
  TimeSeriesData
} from '@/types/rewards';
import { ComponentRewardCampaign, ComponentUserPreferences } from '@/types/components';

/**
 * Mock data factory with strict type compliance
 */

export const createMockRewardTier = (overrides: Partial<RewardTier> = {}): RewardTier => {
  return {
    id: 'tier-bronze',
    name: 'Bronze',
    points_required: 0,
    minimumPoints: 0,
    benefits: ['Welcome bonus', 'Basic rewards'],
    description: 'Entry level tier',
    color: '#CD7F32',
    icon: 'award',
    is_active: true,
    establishment_id: 'est-1',
    ...overrides
  };
};

export const createMockRewardOffering = (overrides: Partial<RewardOffering> = {}): RewardOffering => {
  return {
    id: 'offering-1',
    name: 'Free Mocktail',
    description: 'Redeem for any mocktail',
    pointCost: 100,
    availableQuantity: 50,
    points_required: 100,
    pointsRequired: 100,
    pointValue: 100,
    quantity_available: 50,
    expiration_days: 30,
    is_active: true,
    image_url: '/images/mocktail.jpg',
    establishment_id: 'est-1',
    category: 'drinks',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
};

export const createMockAchievement = (overrides: Partial<Achievement> = {}): Achievement => {
  return {
    id: 'achievement-1',
    name: 'First Visit',
    description: 'Complete your first establishment visit',
    points: 50,
    pointsReward: 50,
    icon: 'MapPin',
    category: 'visits',
    progress: 0,
    threshold: 1,
    isCompleted: false,
    ...overrides
  };
};

export const createMockRewardTransaction = (overrides: Partial<RewardTransaction> = {}): RewardTransaction => {
  const baseTransaction = {
    id: 'trans-1',
    userId: 'user-1',
    user_id: 'user-1',
    type: 'earned' as const,
    transaction_type: 'EARN' as const,
    points: 50,
    pointsAmount: 50,
    description: 'Check-in reward',
    source: 'check-in',
    timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
    date: new Date().toISOString(),
    ...overrides
  };

  // Ensure type consistency
  if (baseTransaction.type === 'earned') {
    baseTransaction.transaction_type = 'EARN';
  } else if (baseTransaction.type === 'redeemed') {
    baseTransaction.transaction_type = 'REDEEM';
  }

  return baseTransaction;
};

export const createMockUserRewardProfile = (overrides: Partial<UserRewardProfile> = {}): UserRewardProfile => {
  return {
    id: 'profile-1',
    userId: 'user-1',
    points: 150,
    totalPoints: 500,
    lifetime_points: 500,
    lifetimePoints: 500,
    currentTier: createMockRewardTier(),
    availableRewards: [createMockRewardOffering()],
    transactionHistory: [createMockRewardTransaction()],
    redemptionHistory: [],
    achievements: [createMockAchievement()],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  };
};

export const createMockTimeSeriesData = (overrides: Partial<TimeSeriesData> = {}): TimeSeriesData => {
  const earned = 100;
  const redeemed = 30;
  return {
    date: new Date().toISOString().split('T')[0],
    pointsEarned: earned,
    pointsRedeemed: redeemed,
    netPoints: earned - redeemed,
    earned: earned,
    redeemed: redeemed,
    ...overrides
  };
};

export const createMockRewardAnalytics = (overrides: Partial<RewardAnalytics> = {}): RewardAnalytics => {
  return {
    totalUsers: 150,
    totalPointsIssued: 25000,
    totalPointsRedeemed: 8500,
    totalPointsEarned: 25000,
    averagePointsPerUser: 166.67,
    pointsEconomyBalance: 16500,
    redemptionRate: 34.0,
    activeUsers: 120,
    transactionCount: 450,
    tierDistribution: [
      { tier: 'Bronze', userCount: 75 },
      { tier: 'Silver', userCount: 45 },
      { tier: 'Gold', userCount: 20 }
    ],
    sourcesBreakdown: {
      'check-in': 8500,
      'purchase': 12000,
      'review': 3000,
      'referral': 1500
    },
    topTiers: [
      { tier: 'Bronze', userCount: 75 },
      { tier: 'Silver', userCount: 45 },
      { tier: 'Gold', userCount: 20 }
    ],
    timeSeriesData: [
      createMockTimeSeriesData({ date: '2023-12-01', pointsEarned: 1200, pointsRedeemed: 400 }),
      createMockTimeSeriesData({ date: '2023-12-02', pointsEarned: 950, pointsRedeemed: 300 }),
      createMockTimeSeriesData({ date: '2023-12-03', pointsEarned: 1100, pointsRedeemed: 350 })
    ],
    ...overrides
  };
};

export const createMockCampaign = (overrides: Partial<ComponentRewardCampaign> = {}): ComponentRewardCampaign => {
  return {
    id: 'campaign-1',
    name: 'Welcome Campaign',
    description: 'Welcome new users with bonus points',
    status: 'active',
    isActive: true,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 1000,
    targetAudience: [],
    rewards: [],
    triggerConditions: [],
    performanceMetrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
};

export const createMockUserPreferences = (overrides: Partial<ComponentUserPreferences> = {}): ComponentUserPreferences => {
  return {
    notificationSettings: {
      pointChanges: true,
      tierUpdates: true,
      rewardAvailability: true
    },
    displaySettings: {
      pointsFormat: 'standard',
      showTierProgress: true
    },
    ...overrides
  };
};

/**
 * Batch data generation for testing
 */
export const generateMockDataSet = (count: number) => {
  return {
    tiers: Array.from({ length: Math.min(count, 5) }, (_, i) => 
      createMockRewardTier({ 
        id: `tier-${i}`,
        name: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'][i],
        points_required: i * 100,
        minimumPoints: i * 100
      })
    ),
    offerings: Array.from({ length: count }, (_, i) => 
      createMockRewardOffering({ 
        id: `offering-${i}`,
        name: `Reward ${i + 1}`,
        pointCost: (i + 1) * 50,
        points_required: (i + 1) * 50,
        pointsRequired: (i + 1) * 50,
        pointValue: (i + 1) * 50
      })
    ),
    achievements: Array.from({ length: count }, (_, i) => 
      createMockAchievement({ 
        id: `achievement-${i}`,
        name: `Achievement ${i + 1}`,
        threshold: (i + 1) * 5
      })
    ),
    transactions: Array.from({ length: count }, (_, i) => 
      createMockRewardTransaction({ 
        id: `trans-${i}`,
        points: Math.floor(Math.random() * 100) + 10,
        pointsAmount: Math.floor(Math.random() * 100) + 10
      })
    )
  };
};
