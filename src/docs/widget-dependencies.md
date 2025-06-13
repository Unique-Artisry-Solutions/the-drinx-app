
# Explore Page Structure Documentation

## Explore Page Components

This document outlines the current structure of the Explore page after removing the personalized widget system.

### Current Structure

The Explore page now uses a CategoryTabs-based layout with the following sections:

1. **CategoryTabs Component** - Main navigation for different content types
   - Path: `@/components/CategoryTabs`
   - Categories: popular, trending, new, personalized, swig-circuits, promoters

2. **Section Components** - Content display based on selected category
   - `FeaturedEstablishmentsSection` - Shows establishments
   - `CocktailsSection` - Displays cocktails with filtering
   - `EventsSection` - Shows upcoming events
   - `BarCrawlSection` - Displays swig circuits overview
   - `SwigCircuitsSection` - Full swig circuits listing
   - `PromoterSection` - Promoter discovery

### Layout Structure

```
Explore Page
├── Header Section (Title + ViewModeToggle)
├── CategoryTabs Navigation
└── Dynamic Content Based on Selected Category
    ├── Popular: Establishments + Cocktails + Events
    ├── Trending: Featured content
    ├── New: Recently added content
    ├── Personalized: User-specific (auth required)
    ├── Swig Circuits: Bar crawls + Circuits
    └── Promoters: Promoter discovery + Events
```

### Data Integration

- Uses `useEstablishments` hook for establishment data
- Uses `useAuth` hook for authentication state
- Mock data for cocktails and bar crawls (to be replaced with proper hooks)
- Each section manages its own loading states

### Removed Components

The following personalized widget components have been removed:
- QuickStatsWidget
- QuickActionCards  
- UpcomingEventsWidget
- RewardsHighlightWidget
- StreakMotivationWidget
- ActivityFeedWidget
- NearbyEstablishmentsWidget

### Notes

- Layout is now consistent with the intended CategoryTabs design
- No complex grid layouts or personalized widget positioning
- Responsive design maintained through section-level components
- View mode toggle integrated at page level
