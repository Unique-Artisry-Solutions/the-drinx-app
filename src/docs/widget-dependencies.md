
# Widget Dependencies Documentation

## PersonalizedExplorePage Required Widgets

This document outlines the critical widgets that MUST be present on the PersonalizedExplorePage to maintain the intended user experience.

### Core Required Widgets

1. **QuickStatsWidget** - Displays user statistics
   - Path: `@/components/explore/personalized/QuickStatsWidget`
   - Props: `totalMocktailsTried`, `totalPoints`, `currentStreak`
   - Display: Mocktails Tried, Total Points, Current Streaks
   - Condition: Only shown when `isAuthenticated && userStats`

2. **RewardsHighlightWidget** - Shows user rewards information
   - Path: `@/components/explore/personalized/RewardsHighlightWidget`
   - Props: `totalPoints`, `currentTier`, `nextTier`, `progressToNextTier`
   - Display: Your Rewards section
   - Condition: Only shown when `isAuthenticated`

3. **StreakMotivationWidget** - Displays streak motivation
   - Path: `@/components/explore/personalized/StreakMotivationWidget`
   - Props: None (uses internal hook)
   - Display: Streak motivation section
   - Condition: Only shown when `isAuthenticated`

4. **ActivityFeedWidget** - Shows activity stream
   - Path: `@/components/explore/personalized/ActivityFeedWidget`
   - Props: `activities` (converted to RealtimeActivity format)
   - Display: Activity stream/feed
   - Condition: Only shown when `isAuthenticated`

### Layout Structure

```
PersonalizedExplorePage
├── Header Section
├── Quick Actions (always visible)
├── Main Grid (XL: 4 columns)
│   ├── Left Column (XL: 3 columns)
│   │   ├── QuickStatsWidget (top row)
│   │   ├── Rewards + Streak Row (2 columns)
│   │   │   ├── RewardsHighlightWidget
│   │   │   └── StreakMotivationWidget
│   │   ├── RecommendationsWidget
│   │   └── NearbyEstablishmentsWidget
│   └── Right Column (XL: 1 column)
│       ├── ActivityFeedWidget
│       └── UpcomingEventsWidget
```

### Validation System

The page includes automatic validation that:
- Checks for widget existence on mount
- Logs warnings in development mode for missing widgets
- Displays a debug panel in development showing widget status

### Critical Notes

⚠️ **DO NOT REMOVE ANY OF THESE WIDGETS WITHOUT EXPLICIT USER REQUEST**

- These widgets represent core functionality requested by the user
- Removing any widget will break the intended user experience
- Always maintain the activity stream alongside other widgets
- The layout is designed to be responsive across all screen sizes

### Type Dependencies

- `RealtimeActivity` from `@/types/explore` - Used for activity feed conversion
- User stats interface for QuickStatsWidget props
- Proper authentication state from `usePersonalizedData` hook
