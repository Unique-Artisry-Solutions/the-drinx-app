
import { NavigationType } from '../NavigationTypes';

export interface MobileNavigationProps {
  type: NavigationType;
  userType: 'individual' | 'establishment';
  forceGuestNavigation?: boolean;
}

export interface NavItemType {
  icon: React.ElementType;
  label: string;
  path: string;
}

export interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
}
