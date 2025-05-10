
import { vi } from 'vitest';
import { RewardTier, Achievement } from '@/lib/rewards/types';

export const useRewardsModule = vi.fn(() => ({
  points: 100,
  tier: { name: 'Gold', minimumPoints: 100 } as RewardTier,
  redeemReward: vi.fn(),
  checkEligibility: vi.fn(() => true),
  recordActivity: vi.fn(),
  isLoading: false,
  error: null
}));

export const useAchievementsModule = vi.fn(() => ({
  achievements: [] as Achievement[],
  unlockAchievement: vi.fn(),
  checkProgress: vi.fn(),
  isLoading: false,
  error: null
}));

export const useToastModule = vi.fn(() => ({
  showToast: vi.fn(),
  hideToast: vi.fn(),
  toasts: []
}));
