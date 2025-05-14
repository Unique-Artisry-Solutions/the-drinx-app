
import React, { useEffect, useState } from 'react';
import { validateSessionState, recoverFromStuckStateJsx } from '@/utils/sessionRecovery';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface SessionGuardProps {
  children: React.ReactNode;
}

const SessionGuard: React.FC<SessionGuardProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [sessionError, setSessionError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsChecking(true);
        const result = await validateSessionState();
        console.log('Session validation result:', result);
        
        if (!result.isValid || result.hasMismatch) {
          setSessionError(true);
          toast({
            title: "Session issue detected",
            description: "There appears to be an issue with your session. Try refreshing the page.",
            variant: "destructive",
            action: (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            )
          });
        }
      } catch (error) {
        console.error('Session validation error:', error);
        setSessionError(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [toast]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-3 text-muted-foreground">Validating session...</span>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="bg-destructive/10 p-4 rounded-lg flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <div>
            <h3 className="font-medium">Session Error</h3>
            <p className="text-sm text-muted-foreground">
              There appears to be an issue with your session.
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={() => window.location.reload()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
          <Button 
            variant="outline"
            onClick={() => recoverFromStuckStateJsx()}
          >
            Reset Session
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SessionGuard;
