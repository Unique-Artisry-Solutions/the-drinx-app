import React, { useMemo } from 'react';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { getImpersonationBackup, restoreImpersonation } from '@/utils/impersonation';
import { Button } from '@/components/ui/button';

export const ImpersonationBanner: React.FC = () => {
  const { user } = useAuthenticatedUser();

  const backup = useMemo(() => getImpersonationBackup(), []);
  const isImpersonating = Boolean(backup && user && backup.user_id !== user.id);

  if (!isImpersonating) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <div className="bg-card text-card-foreground border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <span className="text-sm">
            You are impersonating as <strong>{user?.email ?? 'user'}</strong>.
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => restoreImpersonation()}>
              Return to admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpersonationBanner;
