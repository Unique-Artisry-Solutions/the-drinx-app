// Enhanced Notifications Module - Phase 2: In-App Display System
// Consolidated exports for all enhanced notification components

// Core Provider and Context
export { InAppToastProvider, useInAppToast } from './InAppToastProvider';
export { AudioVisualProvider, useAudioVisual, useNotificationAnimation } from './AudioVisualSystem';

// Main Components
export { NotificationCenter } from './NotificationCenter';
export { EnhancedNotificationItem } from './EnhancedNotificationItem';

// Feature Components
export { NotificationFilters } from './NotificationFilters';
export { NotificationGrouping } from './NotificationGrouping';
export { InfiniteScrollList } from './InfiniteScrollList';

// Badge System
export { 
  NotificationBadge, 
  UnreadCounter, 
  PriorityIndicator, 
  NotificationDot 
} from './NotificationBadge';

// Settings and Controls
export { AudioVisualSettings } from './AudioVisualSystem';