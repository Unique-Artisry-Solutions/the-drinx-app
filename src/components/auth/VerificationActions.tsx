
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerificationActionsProps {
  isResending: boolean;
  onResendVerification: () => Promise<void>;
  onCheckVerification: () => Promise<void>;
  isMobile: boolean;
}

const VerificationActions: React.FC<VerificationActionsProps> = ({
  isResending,
  onResendVerification,
  onCheckVerification,
  isMobile
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col space-y-3">
        <Button 
          variant="outline" 
          className="flex items-center justify-center space-x-2 text-sm"
          onClick={onResendVerification}
          disabled={isResending}
          size={isMobile ? "sm" : "default"}
        >
          <Mail className="h-4 w-4" />
          <span>{isResending ? 'Sending...' : 'Resend verification email'}</span>
        </Button>
        
        <Button
          variant="default"
          className="flex items-center justify-center space-x-2 bg-spiritless-pink hover:bg-spiritless-pink/90 text-sm"
          onClick={onCheckVerification}
          size={isMobile ? "sm" : "default"}
        >
          <CheckCircle className="h-4 w-4" />
          <span>I've verified my email</span>
        </Button>
      </div>
      
      <div className="text-center pt-3 sm:pt-4 border-t border-gray-200 mt-3 sm:mt-4">
        <Link to="/logout" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
          Sign out and use a different account
        </Link>
      </div>
    </div>
  );
};

export default VerificationActions;
