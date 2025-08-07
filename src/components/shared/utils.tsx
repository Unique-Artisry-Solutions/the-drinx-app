import React from 'react';
import { cn } from '@/lib/utils';

// Standard utility functions for shared components

export const mergeClassNames = (baseClasses: string, additionalClasses?: string) => {
  return cn(baseClasses, additionalClasses);
};

export const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full'
};

export const paddingClasses = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6'
};

export const StandardLoadingSpinner: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  </div>
);

export const StandardErrorDisplay: React.FC<{ error: string; onRetry?: () => void }> = ({ 
  error, 
  onRetry 
}) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center max-w-md">
      <div className="text-destructive text-lg font-medium mb-2">Error</div>
      <p className="text-sm text-muted-foreground mb-4">{error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-primary hover:underline text-sm"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);