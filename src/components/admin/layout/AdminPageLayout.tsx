
import React from 'react';
import { StandardPageLayout } from '@/components/shared';
import { StandardLayoutProps } from '@/components/shared/types';

// Legacy interface for backward compatibility
export interface AdminPageConfig {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  requiredPermissions?: string[];
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export interface AdminPageAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  loading?: boolean;
}

interface AdminPageLayoutProps {
  config: AdminPageConfig;
  actions?: AdminPageAction[];
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  config,
  actions = [],
  children,
  isLoading = false,
  error = null,
  className = ''
}) => {
  // Convert legacy config to standard config
  const standardConfig = {
    title: config.title,
    description: config.description,
    showBreadcrumbs: config.showBreadcrumbs,
    maxWidth: config.maxWidth || 'xl' as const,
    padding: 'md' as const
  };

  // Convert legacy actions to standard actions
  const standardActions = actions.map(action => ({
    ...action,
    icon: action.icon as any // Type conversion for compatibility
  }));

  const standardProps: StandardLayoutProps = {
    config: standardConfig,
    actions: standardActions,
    children,
    isLoading,
    error,
    className
  };

  return <StandardPageLayout {...standardProps} />;
};

export default AdminPageLayout;
