
import React from 'react';
import { Card } from '@/components/ui/card';
import UserAuthHeader from './auth/UserAuthHeader';
import UserAuthTabs from './auth/UserAuthTabs';

interface UserAuthProps {
  onSuccess?: () => void;
  onClose?: () => void;
  defaultTab?: 'login' | 'signup';
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
}

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
