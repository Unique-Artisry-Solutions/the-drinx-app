
import React from 'react';
import { StandardLayoutProps } from './types';
import { mergeClassNames, maxWidthClasses, paddingClasses } from './utils';
import { StandardPageHeader } from './StandardPageHeader';
import { StandardPageContent } from './StandardPageContent';
import { StandardPageActions } from './StandardPageActions';

export const StandardPageLayout: React.FC<StandardLayoutProps> = ({
  config,
  actions = [],
  isLoading = false,
  error,
  children,
  className = ''
}) => {
  const maxWidthClass = maxWidthClasses[config.maxWidth || 'xl'];
  const paddingClass = paddingClasses[config.padding || 'md'];

  return (
    <div className={mergeClassNames('min-h-screen bg-gray-50', className)}>
      <div className={mergeClassNames('mx-auto', maxWidthClass, paddingClass)}>
        <StandardPageHeader
          title={config.title}
          description={config.description}
          actions={actions}
        />
        
        <StandardPageContent
          isLoading={isLoading}
          error={error}
          padding="none"
        >
          {children}
        </StandardPageContent>
      </div>
    </div>
  );
};
