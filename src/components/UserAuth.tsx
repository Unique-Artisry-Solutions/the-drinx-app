
import React from 'react';
import { Card } from '@/components/ui/card';
import UserAuthHeader from './auth/UserAuthHeader';
import UserAuthTabs from './auth/UserAuthTabs';
import { UserAuthProps } from './auth/types';

const UserAuth: React.FC<UserAuthProps> = ({ 
  onSuccess,
  onClose,
  defaultTab = 'login',
  userType = 'individual'
}) => {
  // Provide safe default handlers
  const safeOnSuccess = onSuccess ?? (() => console.log('Authentication successful'));
  const safeOnClose = onClose ?? (() => console.log('Auth dialog closed'));

  return (
    <Card className="w-full max-w-md mx-auto">
      <UserAuthHeader 
        defaultTab={defaultTab} 
        userType={userType} 
      />
      <UserAuthTabs 
        onSuccess={safeOnSuccess}
        onClose={safeOnClose}
        defaultTab={defaultTab}
        userType={userType}
      />
    </Card>
  );
};

export default UserAuth;
