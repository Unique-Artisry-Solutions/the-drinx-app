
import React from 'react';
import Layout from '@/components/Layout';
import EmailVerificationContainer from '@/components/auth/EmailVerificationContainer';

const VerifyEmail: React.FC = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[80vh] px-3 sm:px-4">
        <EmailVerificationContainer />
      </div>
    </Layout>
  );
};

export default VerifyEmail;
