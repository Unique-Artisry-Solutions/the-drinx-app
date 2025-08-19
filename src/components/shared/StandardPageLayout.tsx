
// Standardized page layout component

import React from 'react';
import { StandardLayoutProps } from './types';
import { mergeClassNames, maxWidthClasses, StandardLoadingSpinner, StandardErrorDisplay } from './utils';
import StandardPageHeader from './StandardPageHeader';
import StandardPageContent from './StandardPageContent';
import StandardPageActions from './StandardPageActions';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

const StandardPageLayout: React.FC<StandardLayoutProps> = ({
  config,
  actions = [],
  children,
  isLoading = false,
  error = null,
  className = ''
}) => {
  const maxWidthClass = maxWidthClasses[config.maxWidth || 'xl'];

  if (error) {
    return <StandardErrorDisplay error={error} />;
  }

  return (
    <div className={mergeClassNames("min-h-screen bg-gray-50", className)}>
      <div className={mergeClassNames("container mx-auto px-4 pt-4 pb-6", maxWidthClass)}>
        {config.showBreadcrumbs && (
          <div className="mb-4">
            <Breadcrumbs />
          </div>
        )}
        
        <StandardPageHeader
          title={config.title}
          description={config.description}
        />
        
        {actions.length > 0 && (
          <div className="mb-6">
            <StandardPageActions actions={actions} />
          </div>
        )}
        
        <StandardPageContent 
          isLoading={isLoading}
          padding={config.padding}
        >
          {children}
        </StandardPageContent>
      </div>
    </div>
  );
};

export default StandardPageLayout;
