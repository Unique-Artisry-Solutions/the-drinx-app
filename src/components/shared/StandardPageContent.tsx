
import React from 'react';
import { StandardContentProps } from './types';
import { mergeClassNames, paddingClasses, StandardLoadingSpinner, StandardErrorDisplay } from './utils';

export const StandardPageContent: React.FC<StandardContentProps> = ({
  children,
  isLoading = false,
  error,
  onRetry,
  padding = 'md',
  className = '',
  loadingText,
  loadingComponent,
  errorComponent
}) => {
  const paddingClass = paddingClasses[padding];

  if (isLoading) {
    return loadingComponent || <StandardLoadingSpinner text={loadingText} />;
  }

  if (error) {
    return errorComponent || <StandardErrorDisplay error={error} onRetry={onRetry} />;
  }

  return (
    <div className={mergeClassNames(
      "bg-white rounded-lg shadow-sm border",
      paddingClass,
      className
    )}>
      {children}
    </div>
  );
};
