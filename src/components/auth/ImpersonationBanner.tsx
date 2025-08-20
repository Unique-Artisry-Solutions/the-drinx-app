import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { restoreImpersonation } from '@/utils/impersonationSimplified';
import { useImpersonationState } from '@/hooks/useImpersonationState';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ImpersonationBanner: React.FC = () => {
  const { isImpersonating, isLoading, currentUser, adminUserId, targetEmail, isStable } = useImpersonationState();
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  // Don't render anything while loading or if not impersonating
  if (!isStable || isLoading || !isImpersonating) return null;

  const handleReturnToAdmin = async () => {
    try {
      setIsRestoring(true);
      setRestoreError(null);
      
      await restoreImpersonation();
      
    } catch (error: any) {
      console.error('Failed to restore impersonation:', error);
      setRestoreError(error.message || 'Failed to restore session');
      
      // Auto-retry after showing error briefly
      setTimeout(() => {
        setRestoreError(null);
        window.location.href = '/admin/users';
      }, 3000);
      
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <div className={`border-b transition-colors duration-300 ${
        restoreError 
          ? 'bg-destructive/10 text-destructive-foreground border-destructive/20' 
          : 'bg-warning/10 text-warning-foreground border-warning/20'
      }`}>
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {restoreError && <AlertCircle className="h-4 w-4" />}
            <span className="text-sm">
              {restoreError ? (
                <>Error: {restoreError}</>
              ) : (
                <>
                  You are impersonating as <strong>{targetEmail || currentUser?.email || 'user'}</strong>
                  {adminUserId && (
                    <span className="text-xs ml-2 opacity-75">
                      (Admin: {adminUserId.slice(0, 8)}...)
                    </span>
                  )}
                </>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReturnToAdmin}
              disabled={isRestoring}
              className={
                restoreError 
                  ? "border-destructive/20 hover:bg-destructive/20" 
                  : "border-warning/20 hover:bg-warning/20"
              }
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                'Return to admin'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
