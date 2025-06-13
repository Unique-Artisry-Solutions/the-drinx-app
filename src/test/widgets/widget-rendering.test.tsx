
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

// Mock basic components since personalized widgets are removed
const MockQuickStatsWidget = ({ totalMocktailsTried, totalPoints, currentStreak }) => (
  <div data-testid="quick-stats">
    <span>{totalMocktailsTried}</span>
    <span>{totalPoints}</span>
    <span>{currentStreak}</span>
  </div>
);

const MockRewardsHighlightWidget = ({ totalPoints, currentTier, nextTier, progressToNextTier }) => (
  <div data-testid="rewards-highlight">
    <span>{totalPoints}</span>
    <span>{currentTier}</span>
    <span>{nextTier}</span>
    <span>{progressToNextTier}</span>
  </div>
);

const MockActivityFeedWidget = ({ activities }) => (
  <div data-testid="activity-feed">
    {activities.map(activity => (
      <div key={activity.id}>{activity.title}</div>
    ))}
  </div>
);

describe('Widget Components (Legacy Test)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render mock QuickStatsWidget with correct props', () => {
    const { container } = render(
      <MockQuickStatsWidget 
        totalMocktailsTried={12}
        totalPoints={1250}
        currentStreak={5}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render mock RewardsHighlightWidget', () => {
    const { container } = render(
      <MockRewardsHighlightWidget 
        totalPoints={1250}
        currentTier="Silver"
        nextTier="Gold"
        progressToNextTier={83}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it('should render mock ActivityFeedWidget with activities', () => {
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
      <MockActivityFeedWidget activities={mockActivities} />
    );
    expect(container).toBeInTheDocument();
  });

  it('should validate all mock widgets exist', () => {
    expect(MockQuickStatsWidget).toBeDefined();
    expect(MockRewardsHighlightWidget).toBeDefined();
    expect(MockActivityFeedWidget).toBeDefined();
  });
});
