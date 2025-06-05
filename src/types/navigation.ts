
// Navigation types - Standalone to avoid circular dependencies
export type UserType = 'individual' | 'establishment' | 'promoter' | 'admin';

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  userTypes?: UserType[];
  exact?: boolean;
}

export interface NavigationConfig {
  items: NavigationItem[];
  userType: UserType | null;
  isAuthenticated: boolean;
}

export interface TabOption {
  value: string;
  label: string;
  icon?: any;
  disabled?: boolean;
}

export interface NavigationState {
  activeTab?: string;
  tabOptions?: TabOption[];
  handleTabChange?: (value: string) => void;
}
