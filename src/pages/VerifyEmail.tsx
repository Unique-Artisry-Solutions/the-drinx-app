
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import EmailVerificationContainer from '@/components/auth/EmailVerificationContainer';
import TestVerificationLink from '@/components/auth/TestVerificationLink';
import { Button } from '@/components/ui/button';

const VerifyEmail: React.FC = () => {
  const [showTestTool, setShowTestTool] = useState(false);
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-3 sm:px-4 gap-6">
        <EmailVerificationContainer />
        
        <div className="w-full max-w-md">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowTestTool(!showTestTool)}
          >
            {showTestTool ? 'Hide Test Tools' : 'Show Test Tools'}
          </Button>
          
          {showTestTool && (
            <div className="mt-4">
              <TestVerificationLink />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
