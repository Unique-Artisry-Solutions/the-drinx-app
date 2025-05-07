
import { LucideIcon } from 'lucide-react';
import { NavigationType } from '@/types/navigation/NavigationTypes';

// This file now inherits from the unified nav item type
import { UnifiedNavItem } from '@/types/navigation/NavigationTypes';

export type { UnifiedNavItem };

export interface MobileNavigationProps {
  type: NavigationType;
  userType: 'individual' | 'establishment' | 'promoter';
  forceGuestNavigation?: boolean;
}
