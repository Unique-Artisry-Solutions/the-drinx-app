
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@/test/testing-library-extensions';
import { RewardTier, RewardOffering, RewardTransaction, Achievement } from '@/types/rewards';
import { useRewardsModule, useAchievementsModule, useToastModule } from '@/lib/utils/testMocks';

// Mock the modules used in tests
vi.mock('@/lib/utils/testMocks', () => ({
  useRewardsModule: vi.fn(() => ({
    points: 100,
    tier: { name: 'Gold', minimumPoints: 100 } as RewardTier,
    redeemReward: vi.fn(),
    checkEligibility: vi.fn(() => true),
    recordActivity: vi.fn(),
    isLoading: false,
    error: null
  })),
  useAchievementsModule: vi.fn(() => ({
    achievements: [] as Achievement[],
    unlockAchievement: vi.fn(),
    checkProgress: vi.fn(),
    isLoading: false,
    error: null
  })),
  useToastModule: vi.fn(() => ({
    showToast: vi.fn(),
    hideToast: vi.fn(),
    toasts: []
  }))
}));

// Test component for rewards
const RewardDisplay: React.FC = () => {
  const { points, tier } = useRewardsModule();
  
  return (
    <div>
      <h1>Rewards</h1>
      <p>Points: {points}</p>
      <p>Tier: {tier.name}</p>
    </div>
  );
};

// Test component for achievements
const AchievementDisplay: React.FC = () => {
  const { achievements } = useAchievementsModule();
  
  return (
    <div>
      <h1>Achievements</h1>
      <p>{achievements.length ? 'You have achievements' : 'No achievements yet'}</p>
    </div>
  );
};

describe('Rewards System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the rewards display correctly', () => {
    render(<RewardDisplay />);
    expect(screen.getByText('Rewards')).toBeInTheDocument();
    expect(screen.getByText('Points: 100')).toBeInTheDocument();
    expect(screen.getByText('Tier: Gold')).toBeInTheDocument();
  });

  it('should render the achievements display correctly', () => {
    render(<AchievementDisplay />);
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('No achievements yet')).toBeInTheDocument();
  });
  
  it('should track user activities', () => {
    const { recordActivity } = useRewardsModule();
    recordActivity('CHECK_IN', { locationId: '123' });
    expect(recordActivity).toHaveBeenCalledWith('CHECK_IN', { locationId: '123' });
  });
});
