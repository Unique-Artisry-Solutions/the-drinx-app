
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
  return (
    <Card className="w-full max-w-md mx-auto">
      <UserAuthHeader defaultTab={defaultTab} userType={userType} />
      <UserAuthTabs 
        onSuccess={onSuccess}
        onClose={onClose}
        defaultTab={defaultTab}
        userType={userType}
      />
    </Card>
  );
};

export default UserAuth;
