
import React from 'react';
import { NavigationType } from '../NavigationTypes';

export interface NavItem {
  icon: React.FC<any>;
  label: string;
  path: string;
}

export interface MobileNavigationProps {
  type: NavigationType;
  userType?: 'individual' | 'establishment';
}
