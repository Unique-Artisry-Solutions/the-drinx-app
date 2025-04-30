
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserRewardDashboard } from '@/components/rewards/UserRewardDashboard';
import { RewardRedemptionFlow } from '@/components/rewards/RewardRedemptionFlow';
import { RewardHistory } from '@/components/rewards/RewardHistory';
import * as useRewardsModule from '@/hooks/rewards/useRewards';
import * as useAchievementsModule from '@/hooks/rewards/useAchievements';
import * as useToastModule from '@/hooks/use-toast';
import { RewardOffering, RewardTransaction, RewardTier, Achievement } from '@/lib/rewards/types';

// Mock hooks
vi.mock('@/hooks/rewards/useRewards', () => ({
  useRewards: vi.fn(),
}));

vi.mock('@/hooks/rewards/useAchievements', () => ({
  useAchievements: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('Rewards Components Tests', () => {
  // Mock data
  const mockRewardProfile = {
    points: 150,
    lifetimePoints: 250,
    currentTier: {
      id: 'tier-1',
      name: 'Level 1',
      description: 'Starting tier',
      points_required: 0,
      benefits: [],
      icon: 'star',
      color: '#FFA500'
    } as RewardTier,
    availableRewards: [
      {
        id: 'reward-1',
        name: 'Free Mocktail',
        description: 'Get a free mocktail at any participating venue',
        points_required: 100,
        quantity_available: 10,
        is_active: true,
        image_url: '/mocktail.jpg',
        expiration_days: 30,
        category: 'drinks',
        expires_in: 5
      },
      {
        id: 'reward-2',
        name: 'VIP Access',
        description: 'Get VIP access to an exclusive event',
        points_required: 200,
        quantity_available: 5,
        is_active: true,
        image_url: '/vip.jpg',
        expiration_days: 60,
        category: 'events',
        expires_in: 10
      }
    ] as RewardOffering[],
    transactionHistory: [
      {
        id: 'trans-1',
        date: '2023-08-15T10:30:00',
        points: 50,
        type: 'earn',
        source: 'check-in',
        description: 'Check-in at Coolbar'
      },
      {
        id: 'trans-2',
        date: '2023-08-10T14:45:00',
        points: 100,
        type: 'earn',
        source: 'purchase',
        description: 'Bought a mocktail'
      },
      {
        id: 'trans-3',
        date: '2023-08-05T16:20:00',
        points: 75,
        type: 'redeem',
        source: 'reward',
        description: 'Redeemed for a discount'
      }
    ] as RewardTransaction[],
    redemptionHistory: []
  };

  const mockAchievements: Achievement[] = [
    {
      id: 'achv-1',
      name: 'First Visit',
      description: 'Visit your first venue',
      category: 'visits',
      icon: 'map-pin',
      pointsReward: 10,
      progress: 1,
      threshold: 1,
      isCompleted: true,
      completedAt: '2023-08-01T12:00:00'
    },
    {
      id: 'achv-2',
      name: 'Mocktail Maven',
      description: 'Try 5 different mocktails',
      category: 'mocktails',
      icon: 'glass-water',
      pointsReward: 25,
      progress: 3,
      threshold: 5,
      isCompleted: false
    }
  ];

  const mockAchievementsByCategory = {
    visits: [mockAchievements[0]],
    mocktails: [mockAchievements[1]]
  };
  
  // Create a properly structured mock toast object
  const mockToast = {
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: []
  };
  
  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
    
    // Setup default mock implementations
    vi.mocked(useRewardsModule.useRewards).mockReturnValue({
      isEnabled: true,
      isLoading: false,
      rewardProfile: mockRewardProfile,
      addPoints: vi.fn().mockResolvedValue({ success: true }),
      redeemReward: vi.fn().mockResolvedValue({ success: true })
    });
    
    vi.mocked(useAchievementsModule.useAchievements).mockReturnValue({
      achievements: mockAchievements,
      achievementsByCategory: mockAchievementsByCategory,
      isLoading: false,
      recordActivity: vi.fn().mockResolvedValue([])
    });
    
    vi.mocked(useToastModule.useToast).mockReturnValue(mockToast);
  });

  describe('UserRewardDashboard', () => {
    it('should render user points and tier information', () => {
      render(<UserRewardDashboard />);
      
      expect(screen.getByText('150')).toBeInTheDocument(); // Current points
      expect(screen.getByText('250')).toBeInTheDocument(); // Lifetime points
      expect(screen.getByText('1')).toBeInTheDocument(); // Current tier
    });
    
    it('should show loading state when data is loading', () => {
      vi.mocked(useRewardsModule.useRewards).mockReturnValue({
        isEnabled: true,
        isLoading: true,
        rewardProfile: null,
        addPoints: vi.fn(),
        redeemReward: vi.fn()
      });
      
      render(<UserRewardDashboard />);
      
      // Check for loading indicators
      const loadingElements = document.querySelectorAll('.animate-pulse');
      expect(loadingElements.length).toBeGreaterThan(0);
    });
    
    it('should display achievements', async () => {
      render(<UserRewardDashboard />);
      
      // Navigate to achievements tab
      const achievementsTab = screen.getByText('Achievements');
      fireEvent.click(achievementsTab);
      
      await waitFor(() => {
        expect(screen.getByText('First Visit')).toBeInTheDocument();
        expect(screen.getByText('Mocktail Maven')).toBeInTheDocument();
      });
    });
  });
  
  describe('RewardRedemptionFlow', () => {
    it('should display available rewards', () => {
      render(<RewardRedemptionFlow />);
      
      expect(screen.getByText('Free Mocktail')).toBeInTheDocument();
      expect(screen.getByText('VIP Access')).toBeInTheDocument();
    });
    
    it('should filter rewards by category', async () => {
      render(<RewardRedemptionFlow />);
      
      // Click on the drinks category
      const drinksTab = screen.getByText('Drinks');
      fireEvent.click(drinksTab);
      
      await waitFor(() => {
        expect(screen.getByText('Free Mocktail')).toBeInTheDocument();
        expect(screen.queryByText('VIP Access')).not.toBeInTheDocument();
      });
    });
    
    it('should redeem a reward successfully', async () => {
      const redeemRewardMock = vi.fn().mockResolvedValue({ success: true });
      
      vi.mocked(useRewardsModule.useRewards).mockReturnValue({
        isEnabled: true,
        isLoading: false,
        rewardProfile: mockRewardProfile,
        addPoints: vi.fn(),
        redeemReward: redeemRewardMock
      });
      
      render(<RewardRedemptionFlow />);
      
      // Click redeem button on first reward
      const redeemButtons = screen.getAllByText('Redeem');
      fireEvent.click(redeemButtons[0]);
      
      // Verify redemption was called
      await waitFor(() => {
        expect(redeemRewardMock).toHaveBeenCalledWith('reward-1');
        expect(mockToast.toast).toHaveBeenCalled();
      });
    });
  });
  
  describe('RewardHistory', () => {
    it('should display transaction history in sorted order', () => {
      render(<RewardHistory transactions={mockRewardProfile.transactionHistory} />);
      
      const transactions = screen.getAllByText(/Points (earned|redeemed)/);
      expect(transactions).toHaveLength(3);
      
      // Verify sorted by date (newest first)
      const dates = screen.getAllByText(/Check-in at|Bought a|Redeemed for/);
      expect(dates[0].textContent).toContain('Check-in at Coolbar');
      expect(dates[1].textContent).toContain('Bought a mocktail');
      expect(dates[2].textContent).toContain('Redeemed for a discount');
    });
    
    it('should show empty state when no transactions', () => {
      render(<RewardHistory transactions={[]} />);
      
      expect(screen.getByText('No transaction history yet')).toBeInTheDocument();
    });
  });
});
