
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { isPreviewEnvironment, enablePreviewBypass } from '@/utils/environment';

export interface PageSuspenseProps {
  children?: React.ReactNode;
  timeoutMs?: number;
}

const PageSuspense: React.FC<PageSuspenseProps> = ({ 
  children,
  timeoutMs = 5000 // Default 5 seconds
}) => {
  const [showBypass, setShowBypass] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const { continueAsGuest } = useAuth();
  const inPreviewMode = isPreviewEnvironment();
  
  // Show bypass button after timeout only in preview environments
  useEffect(() => {
    if (inPreviewMode) {
      const timer = setTimeout(() => {
        setShowBypass(true);
      }, timeoutMs);
      
      return () => clearTimeout(timer);
    }
  }, [timeoutMs, inPreviewMode]);
  
  // Countdown effect for auto-redirect
  useEffect(() => {
    if (inPreviewMode && showBypass && countdown > 0) {
      const countdownTimer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(countdownTimer);
    } else if (inPreviewMode && countdown === 0) {
      // Auto-redirect when countdown reaches 0
      continueAsGuest();
      window.location.href = '/landing';
    }
  }, [inPreviewMode, showBypass, countdown, continueAsGuest]);
  
  const handleBypassClick = () => {
    continueAsGuest();
    window.location.href = '/landing';
  };
  
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium">Loading...</p>
        {children}
        
        {inPreviewMode && showBypass && (
          <div className="flex flex-col items-center mt-8 space-y-4">
            <p className="text-amber-600">
              {countdown > 0 ? (
                `Redirecting to landing page in ${countdown} seconds...`
              ) : (
                'Redirecting...'
              )}
            </p>
            <Button 
              variant="secondary" 
              onClick={handleBypassClick} 
              className="mt-2"
            >
              Continue as Guest Now
            </Button>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/landing'}>
                Go to Landing
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
                Go to Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageSuspense;
