
import React, { useState, useEffect } from 'react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, AlertTriangle } from 'lucide-react';

interface FollowerMigrationWrapperProps {
  children: React.ReactNode;
  legacyComponent?: React.ReactNode;
  featureFlag: string;
  migrationMessage?: string;
  onMigrationComplete?: () => void;
}

const FollowerMigrationWrapper: React.FC<FollowerMigrationWrapperProps> = ({
  children,
  legacyComponent,
  featureFlag,
  migrationMessage = 'This component is using the new follower system.',
  onMigrationComplete
}) => {
  const { flags } = useFeatureFlags();
  const [showMigrationNotice, setShowMigrationNotice] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  const useNewSystem = flags.useNewFollowerSystem;

  useEffect(() => {
    if (useNewSystem && !migrationError) {
      setShowMigrationNotice(true);
      onMigrationComplete?.();
    }
  }, [useNewSystem, migrationError, onMigrationComplete]);

  const handleDismissNotice = () => {
    setShowMigrationNotice(false);
  };

  // Error boundary for new system
  const handleNewSystemError = (error: Error) => {
    console.error('New follower system error:', error);
    setMigrationError(error.message);
  };

  // If there's an error with the new system and we have a legacy fallback, use it
  if (migrationError && legacyComponent) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            New system encountered an error. Falling back to legacy version.
            Error: {migrationError}
          </AlertDescription>
        </Alert>
        {legacyComponent}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showMigrationNotice && useNewSystem && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{migrationMessage}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismissNotice}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <React.Suspense fallback={<div>Loading...</div>}>
        {React.cloneElement(children as React.ReactElement, {
          onError: handleNewSystemError
        })}
      </React.Suspense>
    </div>
  );
};

export default FollowerMigrationWrapper;
