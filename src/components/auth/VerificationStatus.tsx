
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface VerificationStatusProps {
  email: string | undefined;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ email }) => {
  return (
    <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border border-amber-200">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-amber-800 text-sm sm:text-base">Verification needed</h3>
          <p className="text-xs sm:text-sm text-amber-700 mt-1">
            We've sent a verification email to <strong>{email}</strong>. 
            Please check your inbox and click the verification link.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;
