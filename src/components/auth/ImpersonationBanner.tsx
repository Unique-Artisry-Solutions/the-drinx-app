import React from 'react';
import { Button } from '@/components/ui/button';
import { restoreImpersonation } from '@/utils/impersonation';
import { useImpersonationState } from '@/hooks/useImpersonationState';

export const ImpersonationBanner: React.FC = () => {
  const { isImpersonating, isLoading, currentUser, adminUserId } = useImpersonationState();

  // Don't render anything while loading or if not impersonating
  if (isLoading || !isImpersonating) return null;

  const handleReturnToAdmin = async () => {
    try {
      await restoreImpersonation();
    } catch (error) {
      console.error('Failed to restore impersonation:', error);
      // Fallback: redirect to admin panel
      window.location.href = '/admin/users';
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <div className="bg-warning/10 text-warning-foreground border-b border-warning/20">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <span className="text-sm">
            You are impersonating as <strong>{currentUser?.email ?? 'user'}</strong>
            {adminUserId && (
              <span className="text-xs ml-2 opacity-75">
                (Admin: {adminUserId.slice(0, 8)}...)
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReturnToAdmin}
              className="border-warning/20 hover:bg-warning/20"
            >
              Return to admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
