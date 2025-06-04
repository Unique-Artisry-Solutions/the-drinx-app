
// Enhanced Standard Components - Phase 9E
// Type-safe, validated standard components

import React from 'react';
import { StrictBaseProps, StrictLoadingState, StrictErrorState, StrictAction } from '@/types/shared/StandardTypes';
import { Button } from '@/components/ui/button';
import { validateString, devValidate, StringValidator } from '@/utils/typeValidation';
import { cn } from '@/lib/utils';

// Enhanced Loading Spinner with strict typing
export interface EnhancedLoadingSpinnerProps extends StrictBaseProps, StrictLoadingState {
  readonly size?: 'sm' | 'md' | 'lg';
}

export const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({
  className,
  loadingText = 'Loading...',
  size = 'md',
  'data-testid': testId
}) => {
  // Runtime validation in development
  const validatedText = devValidate(
    new StringValidator({ maxLength: 100 }),
    loadingText,
    'EnhancedLoadingSpinner.loadingText'
  );

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn("flex items-center justify-center p-4", className)} data-testid={testId}>
      <div className={cn("animate-spin border-2 border-gray-300 border-t-primary rounded-full", sizeClasses[size])} />
      {validatedText && (
        <span className="ml-2 text-sm text-muted-foreground">{validatedText}</span>
      )}
    </div>
  );
};

// Enhanced Error Display with strict typing
export interface EnhancedErrorDisplayProps extends StrictBaseProps, StrictErrorState {
  readonly variant?: 'default' | 'minimal' | 'detailed';
}

export const EnhancedErrorDisplay: React.FC<EnhancedErrorDisplayProps> = ({
  error,
  onRetry,
  variant = 'default',
  className,
  'data-testid': testId
}) => {
  // Runtime validation
  const validatedError = devValidate(
    new StringValidator({ required: true, maxLength: 500 }),
    error,
    'EnhancedErrorDisplay.error'
  );

  if (!validatedError) return null;

  const variantClasses = {
    default: 'p-4 border rounded-lg bg-destructive/10 border-destructive/20',
    minimal: 'p-2 text-sm',
    detailed: 'p-6 border rounded-lg bg-destructive/10 border-destructive/20'
  };

  return (
    <div className={cn(variantClasses[variant], className)} data-testid={testId}>
      <div className="flex items-center justify-between">
        <p className="text-destructive font-medium">
          {variant === 'minimal' ? 'Error' : 'Something went wrong'}
        </p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
      {variant !== 'minimal' && (
        <p className="text-sm text-muted-foreground mt-2">{validatedError}</p>
      )}
    </div>
  );
};

// Enhanced Actions Bar with strict typing
export interface EnhancedActionsBarProps extends StrictBaseProps {
  readonly actions: readonly StrictAction[];
  readonly orientation?: 'horizontal' | 'vertical';
}

export const EnhancedActionsBar: React.FC<EnhancedActionsBarProps> = ({
  actions,
  orientation = 'horizontal',
  className,
  'data-testid': testId
}) => {
  if (actions.length === 0) return null;

  const orientationClasses = {
    horizontal: 'flex flex-row gap-2 flex-wrap',
    vertical: 'flex flex-col gap-2'
  };

  return (
    <div className={cn(orientationClasses[orientation], className)} data-testid={testId}>
      {actions.map((action) => {
        // Runtime validation for each action
        const validatedLabel = devValidate(
          new StringValidator({ required: true, maxLength: 50 }),
          action.label,
          `EnhancedActionsBar.action[${action.id}].label`
        );

        if (!validatedLabel) return null;

        return (
          <Button
            key={action.id}
            variant={action.variant || 'default'}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            className="flex items-center gap-2"
            title={action.tooltip}
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {validatedLabel}
          </Button>
        );
      })}
    </div>
  );
};

// Enhanced Container with strict typing
export interface EnhancedContainerProps extends StrictBaseProps {
  readonly maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg';
  readonly centered?: boolean;
}

export const EnhancedContainer: React.FC<EnhancedContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = 'md',
  centered = true,
  className,
  'data-testid': testId
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div
      className={cn(
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        centered && 'mx-auto',
        className
      )}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
