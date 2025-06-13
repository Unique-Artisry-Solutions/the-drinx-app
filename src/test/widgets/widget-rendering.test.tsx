
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { QuickStatsWidget } from '@/components/explore/QuickStatsWidget';
import { RewardsHighlightWidget } from '@/components/explore/RewardsHighlightWidget';
import { ActivityFeedWidget } from '@/components/explore/personalized/ActivityFeedWidget';

// Mock the hooks
vi.mock('@/hooks/usePersonalizedData', () => ({
  usePersonalizedData: vi.fn(() => ({
    loading: false,
    isAuthenticated: true,
    userStats: {
      totalMocktailsTried: 12,
      totalPoints: 1250,
      currentStreak: 5
    },
    recentActivity: []
  }))
}));

describe('Explore Widget Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render QuickStatsWidget with correct props', () => {
    const { container } = render(
      <QuickStatsWidget 
        totalMocktailsTried={12}
        totalPoints={1250}
        currentStreak={5}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render RewardsHighlightWidget', () => {
    const { container } = render(
      <RewardsHighlightWidget 
        totalPoints={1250}
        currentTier="Silver"
        nextTier="Gold"
        progressToNextTier={83}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render ActivityFeedWidget with activities', () => {
    const mockActivities = [{
      id: '1',
      type: 'check-in' as const,
      title: 'Test Activity',
      description: 'Test Description',
      timestamp: new Date().toISOString(),
      user: { id: 'user1', name: 'Test User' },
      likes: 0,
      isLiked: false,
      metadata: {}
    }];

    const { container } = render(
      <ActivityFeedWidget activities={mockActivities} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should validate all required widgets exist', () => {
    // This test ensures imports are working correctly
    expect(QuickStatsWidget).toBeDefined();
    expect(RewardsHighlightWidget).toBeDefined();
    expect(ActivityFeedWidget).toBeDefined();
  });
});
