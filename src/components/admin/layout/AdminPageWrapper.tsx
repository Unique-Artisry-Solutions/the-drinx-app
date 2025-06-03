
import React, { useEffect } from 'react';
import { useAdminLayout } from './AdminLayoutProvider';
import { StandardPageLayout } from '@/components/shared';
import { StandardLayoutProps } from '@/components/shared/types';

// Legacy interface for backward compatibility
export interface AdminPageConfig {
  title: string;
  description?: string;
  showBreadcrumbs?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  autoSetPageInfo?: boolean;
}

export interface AdminPageAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
  loading?: boolean;
}

interface AdminPageWrapperProps {
  config: AdminPageConfig;
  actions?: AdminPageAction[];
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({
  config,
  actions = [],
  children,
  isLoading = false,
  error = null,
  className = ''
}) => {
  const { setPageInfo, setPageActions } = useAdminLayout();

  // Auto-set page info if enabled
  useEffect(() => {
    if (config.autoSetPageInfo !== false) {
      setPageInfo({
        title: config.title,
        description: config.description
      });
    }
  }, [config.title, config.description, config.autoSetPageInfo, setPageInfo]);

  // Set page actions
  useEffect(() => {
    setPageActions(actions);
    return () => setPageActions([]);
  }, [actions, setPageActions]);

  // Convert legacy config to standard config
  const standardConfig = {
    title: config.title,
    description: config.description,
    showBreadcrumbs: config.showBreadcrumbs,
    maxWidth: config.maxWidth || 'xl' as const,
    padding: config.padding || 'md' as const
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

export default AdminPageWrapper;
