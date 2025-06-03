
import React from 'react';
import { Card } from '@/components/ui/card';
import UserAuthHeader from './UserAuthHeader';
import UserAuthTabs from './UserAuthTabs';
import { UserAuthProps } from './types';
import { BaseComponentProps } from '@/components/shared/types';

// Extend with standard props
interface StandardUserAuthProps extends UserAuthProps, BaseComponentProps {}

const UserAuth: React.FC<StandardUserAuthProps> = ({ 
  onSuccess,
  onClose,
  defaultTab = 'login',
  userType = 'individual',
  className,
  'data-testid': testId
}) => {
  return (
    <Card 
      className={`w-full max-w-md mx-auto ${className || ''}`}
      data-testid={testId}
    >
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
