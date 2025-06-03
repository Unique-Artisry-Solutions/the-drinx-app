
import React from 'react';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import AdminPageHeader from './AdminPageHeader';
import AdminPageContent from './AdminPageContent';
import AdminPageActions from './AdminPageActions';

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
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-none'
  }[config.maxWidth || 'xl'];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className={`container mx-auto ${maxWidthClass} px-4 py-6`}>
        {config.showBreadcrumbs && (
          <div className="mb-4">
            <Breadcrumbs />
          </div>
        )}
        
        <AdminPageHeader
          title={config.title}
          description={config.description}
        />
        
        {actions.length > 0 && (
          <div className="mb-6">
            <AdminPageActions actions={actions} />
          </div>
        )}
        
        <AdminPageContent isLoading={isLoading}>
          {children}
        </AdminPageContent>
      </div>
    </div>
  );
};

export default AdminPageLayout;
