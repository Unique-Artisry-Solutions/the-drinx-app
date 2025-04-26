
import { LucideIcon } from 'lucide-react';
import { NavigationType } from '../NavigationTypes';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  dropdown?: {
    items: Array<{
      label: string;
      path: string;
    }>;
  };
}

export interface MobileNavigationProps {
  type: NavigationType;
  userType: 'individual' | 'establishment' | 'promoter';
  forceGuestNavigation?: boolean;
}
