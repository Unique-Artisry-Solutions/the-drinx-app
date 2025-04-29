
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { UserRewardDashboard } from '@/components/rewards/UserRewardDashboard';
import { useRewards } from '@/hooks/rewards/useRewards';
import { useAchievements } from '@/hooks/rewards/useAchievements';

// Mock the hooks
vi.mock('@/hooks/rewards/useRewards');
vi.mock('@/hooks/rewards/useAchievements');
vi.mock('@/lib/rewards/tracking/eventTracking', () => ({
  trackRewardEvent: vi.fn().mockResolvedValue('mock-tracking-id'),
  RewardEventType: {
    REWARDS_PAGE_VIEW: 'rewards_page_view'
  }
}));

// Sample data
const mockRewardProfile = {
  points: 1000,
  lifetimePoints: 1500,
  currentTier: {
    id: 'tier-1',
    name: 'Tier 1',
    description: 'Basic tier',
    points_required: 0,
    benefits: []
  },
  availableRewards: [
    {
      id: 'reward-1',
      name: 'Free Mocktail',
      description: 'Get a free mocktail',
      points_required: 500,
      establishment_id: 'est-1',
      category: 'drinks'
    }
  ],
  transactionHistory: [
    {
      id: 'tx-1',
      points: 100,
      created_at: '2025-01-01',
      transaction_type: 'earn',
      source: 'purchase'
    }
  ],
  redemptionHistory: []
};

const mockAchievements = [
  {
    id: 'ach-1',
    name: 'First Visit',
    description: 'Visit for the first time',
    category: 'visits',
    isCompleted: true,
    progress: 1,
    threshold: 1,
    pointsReward: 50
  }
];

describe('UserRewardDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useRewards hook
    (useRewards as any).mockReturnValue({
      isEnabled: true,
      isLoading: false,
      rewardProfile: mockRewardProfile,
      addPoints: vi.fn(),
      redeemReward: vi.fn(),
      // Add missing functions
      viewRewardsCatalog: vi.fn(),
      viewRewardDetail: vi.fn(),
      confirmRedemption: vi.fn()
    });
    
    // Mock useAchievements hook
    (useAchievements as any).mockReturnValue({
      achievements: mockAchievements,
      achievementsByCategory: {
        visits: mockAchievements
      },
      isLoading: false,
      error: null,
      trackAchievementView: vi.fn(),
      updateProgress: vi.fn(),
      claimReward: vi.fn()
    });
  });
  
  it('renders the dashboard with points overview', () => {
    render(<UserRewardDashboard />);
    
    expect(screen.getByText('Points Overview')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument(); // Current points
    expect(screen.getByText('1500')).toBeInTheDocument(); // Lifetime points
  });
  
  it('shows loading state when data is loading', () => {
    (useRewards as any).mockReturnValue({
      isEnabled: true,
      isLoading: true,
      rewardProfile: null,
      addPoints: vi.fn(),
      redeemReward: vi.fn(),
      // Add missing functions
      viewRewardsCatalog: vi.fn(),
      viewRewardDetail: vi.fn(),
      confirmRedemption: vi.fn()
    });
    
    render(<UserRewardDashboard />);
    
    // Check that loading state is shown
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });
  
  it('shows achievements on the achievements tab', () => {
    render(<UserRewardDashboard />);
    
    // Switch to achievements tab
    fireEvent.click(screen.getByRole('tab', { name: /achievements/i }));
    
    // Should show achievement
    expect(screen.getByText('First Visit')).toBeInTheDocument();
  });
  
  it('allows switching between tabs', () => {
    render(<UserRewardDashboard />);
    
    // Initially on overview tab
    expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
    
    // Switch to history tab
    fireEvent.click(screen.getByRole('tab', { name: /history/i }));
    expect(screen.getByText(/Transaction history/i)).toBeInTheDocument();
    
    // Switch to achievements tab
    fireEvent.click(screen.getByRole('tab', { name: /achievements/i }));
    expect(screen.getByText(/All achievements/i)).toBeInTheDocument();
    
    // Switch back to overview
    fireEvent.click(screen.getByRole('tab', { name: /overview/i }));
    expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
  });
  
  it('tracks dashboard view on load', () => {
    render(<UserRewardDashboard />);
    
    // Check that view was tracked
    const trackEvent = vi.spyOn(require('@/lib/rewards/tracking/eventTracking'), 'trackRewardEvent');
    expect(trackEvent).toHaveBeenCalled();
  });
});
